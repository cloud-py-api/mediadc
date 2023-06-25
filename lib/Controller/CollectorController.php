<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2021-2022 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @copyright opyright (c) 2021-2022 Alexander Piskun <bigcat88@icloud.com>
 *
 * @author 2021-2022 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OCA\MediaDC\Controller;

use Exception;
use OCP\IRequest;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;

use OCA\MediaDC\AppInfo\Application;
use OCA\MediaDC\Db\CollectorTask;
use OCA\MediaDC\Service\CollectorService;
use OCP\AppFramework\Http\DataDownloadResponse;

class CollectorController extends Controller {
	/** @var CollectorService */
	private $service;

	public function __construct(IRequest $request, CollectorService $service) {
		parent::__construct(Application::APP_ID, $request);

		$this->service = $service;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param bool $recent
	 */
	public function index(bool $recent = false): JSONResponse {
		if ($recent) {
			return new JSONResponse($this->service->getUserRecentTasks(), Http::STATUS_OK);
		}
		return new JSONResponse($this->service->getUserCollectorTasks(), Http::STATUS_OK);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param string $type
	 * @param int $limit
	 * @param int $offset
	 */
	public function resolved(string $type, int $limit = null, int $offset = null): JSONResponse {
		return new JSONResponse([
			'success' => true,
			'resolved' => $this->service->resolved($type, $limit, $offset)
		], Http::STATUS_OK);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param string $type
	 * @param int $fileid
	 * @param bool $resolved
	 */
	public function markResolved(string $type, int $fileId, bool $resolved = true): JSONResponse {
		return new JSONResponse($this->service->markResolved($type, $fileId, $resolved), Http::STATUS_OK);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param string $targetDirectoryIds
	 * @param string $excludeList
	 * @param string $collectorSettings
	 */
	public function runTask($targetDirectoryIds, $excludeList, $collectorSettings): JSONResponse {
		if ($targetDirectoryIds !== null && $excludeList !== null && $collectorSettings !== null) {
			$params = [
				'targetDirectoryIds' => json_decode($targetDirectoryIds),
				'excludeList' => $excludeList,
				'collectorSettings' => $collectorSettings
			];
			return new JSONResponse($this->service->runTask($params), Http::STATUS_OK);
		} else {
			return new JSONResponse([
				'success' => false,
				'message' => 'Collector params not valid'
			], Http::STATUS_OK);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param int $taskId
	 * @param string $targetDirectoryIds
	 * @param string $excludeList
	 * @param string $collectorSettings
	 */
	public function restartTask($taskId, $targetDirectoryIds, $excludeList, $collectorSettings): JSONResponse {
		if (
			$taskId !== null && $targetDirectoryIds !== null
			&& $excludeList !== null && $collectorSettings !== null
		) {
			$params = [
				'taskId' => $taskId,
				'targetDirectoryIds' => json_decode($targetDirectoryIds),
				'excludeList' => $excludeList,
				'collectorSettings' => $collectorSettings
			];
			return new JSONResponse($this->service->restartTask($params), Http::STATUS_OK);
		} else {
			return new JSONResponse([
				'success' => false,
				'message' => 'Collector params not valid'
			], Http::STATUS_OK);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param int $taskId
	 * @param int $limit
	 * @param int $page
	 * @param array $filter
	 */
	public function details(int $taskId, int $limit = null, int $page = null, array $filter = []): JSONResponse {
		if ($taskId) {
			/** @var CollectorTask */
			$collectorTask = $this->service->getCollectorTask($taskId);
			if ($collectorTask instanceof CollectorTask) {
				$offset = $page * $limit;
				$collectorTaskDetails = $this->service->details($taskId, $limit, $offset, $filter);
				return new JSONResponse([
					'id' => $taskId,
					'success' => $taskId === intval($collectorTask->getId()),
					'collectorTask' => $collectorTask,
					'collectorTaskDetails' => $collectorTaskDetails
				], Http::STATUS_OK);
			} else {
				return new JSONResponse([
					'success' => false,
					'message' => 'Collector Task #' . $taskId . ' not found'
				]);
			}
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function getTaskInfo(int $taskId): JSONResponse {
		if ($taskId) {
			/** @var CollectorTask */
			$collectorTask = $this->service->getCollectorTask($taskId);
			$collectorTaskInfo = $this->service->getTaskInfo($collectorTask);
			return new JSONResponse([
				'collectorTaskInfo' => [
					'target_directories' => $collectorTaskInfo['target_directories'],
					'exclude_directories' => $collectorTaskInfo['exclude_directories'],
				],
			], Http::STATUS_OK);
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param int $taskId target task id
	 * @param string $format export file format (xml, json)
	 *
	 * @throws Exception
	 * @return DataDownloadResponse|null
	 */
	public function getTaskResultsExport(int $taskId, string $format): ?DataDownloadResponse {
		if (in_array($format, ['xml', 'json'])) {
			$export = $this->service->exportTaskResults(intval($taskId), $format);
			if ($export) {
				return new DataDownloadResponse($export['data'], $export['filename'], $export['contentType']);
			}
		}
		throw new Exception('Bad request. Requested export format is not supported.');
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function deleteTask(int $taskId): JSONResponse {
		if ($taskId) {
			/** @var CollectorTask */
			$deletedTask = $this->service->delete($taskId);
			return new JSONResponse([
				'success' => $taskId === intval($deletedTask->getId()),
				'taskId' => $taskId,
				'deletedTask' => $deletedTask
			], Http::STATUS_OK);
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function deleteTaskDetail(int $taskId, int $groupId): JSONResponse {
		if ($taskId && $groupId) {
			return new JSONResponse([
				'success' => $this->service->deleteTaskDetail($taskId, $groupId) > 0,
			], Http::STATUS_OK);
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function terminateTask(int $taskId): JSONResponse {
		if ($taskId) {
			/** @var CollectorTask */
			$terminatedTask = $this->service->terminate($taskId);
			return new JSONResponse([
				'success' => $taskId === intval($terminatedTask->getId()) && $terminatedTask->getPyPid() === 0,
				'taskId' => $taskId,
				'terminatedTask' => $terminatedTask
			], Http::STATUS_OK);
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function duplicateTask(int $taskId): JSONResponse {
		if ($taskId) {
			$duplicatedTask = $this->service->duplicate($taskId);
			return new JSONResponse([
				'success' => $duplicatedTask !== null,
				'duplicatedTask' => $duplicatedTask,
			], Http::STATUS_OK);
		}
		return new JSONResponse(['success' => false], Http::STATUS_OK);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function getDetailGroupFilesInfo(int $taskId, int $groupId, bool $filesizeAscending = false): JSONResponse {
		if ($taskId) {
			return new JSONResponse($this->service->getDetailGroupFilesInfo($taskId, $groupId, $filesizeAscending), Http::STATUS_OK);
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param int $taskId
	 * @param int $groupId
	 */
	public function getDetailFilesTotalSize(int $taskId): JSONResponse {
		if ($taskId) {
			return new JSONResponse($this->service->getDetailFilesTotalSize(intval($taskId)), Http::STATUS_OK);
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function deleteTaskDetailFile(int $taskId, int $groupId, int $fileId): JSONResponse {
		if ($groupId && $fileId) {
			return new JSONResponse($this->service->deleteTaskDetailFile($taskId, $groupId, $fileId), Http::STATUS_OK);
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}

	// Batch editing actions

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function removeTaskDetailGroups(int $taskId, array $groupIds): JSONResponse {
		if ($taskId && $groupIds) {
			return new JSONResponse($this->service->removeTaskDetailGroups($taskId, $groupIds), Http::STATUS_OK);
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function deleteTaskDetailGroupsFiles(int $taskId, array $groupIds): JSONResponse {
		if ($taskId && $groupIds) {
			return new JSONResponse($this->service->deleteTaskDetailGroupsFiles($taskId, $groupIds), Http::STATUS_OK);
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function deleteTaskDetailFiles(int $taskId, int $groupId, array $fileIds): JSONResponse {
		if ($taskId && $groupId && $fileIds) {
			return new JSONResponse($this->service->deleteTaskDetailFiles($taskId, $groupId, $fileIds), Http::STATUS_OK);
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function removeTaskDetailFiles(int $taskId, int $groupId, array $fileIds): JSONResponse {
		if ($taskId && $groupId && $fileIds) {
			return new JSONResponse($this->service->removeTaskDetailFiles($taskId, $groupId, $fileIds), Http::STATUS_OK);
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}
}
