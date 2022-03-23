<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2021 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @copyright Copyright (c) 2021 Alexander Piskun <bigcat88@icloud.com>
 *
 * @author 2021 Andrey Borysenko <andrey18106x@gmail.com>
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

use OCP\IRequest;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;

use OCA\MediaDC\AppInfo\Application;
use OCA\MediaDC\Db\CollectorTask;
use OCA\MediaDC\Service\CollectorService;


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
	 */
	public function index(): JSONResponse {
		return new JSONResponse($this->service->getUserCollectorTasks(), Http::STATUS_OK);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param string $targetDirectoryIds
	 * @param string $excludeList
	 * @param string $collectorSettings
	 */
	public function collect($targetDirectoryIds, $excludeList, $collectorSettings): JSONResponse {
		if ($targetDirectoryIds !== null && $excludeList !== null && $collectorSettings !== null) {
			$params = [
				'targetDirectoryIds' => json_decode($targetDirectoryIds),
				'excludeList' => $excludeList,
				'collectorSettings' => $collectorSettings
			];
			return new JSONResponse($this->service->collect($params), Http::STATUS_OK);
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
	public function restart($taskId, $targetDirectoryIds, $excludeList, $collectorSettings): JSONResponse {
		if ($taskId !== null && $targetDirectoryIds !== null
			&& $excludeList !== null && $collectorSettings !== null) {
			$params = [
				'taskId' => $taskId,
				'targetDirectoryIds' => json_decode($targetDirectoryIds),
				'excludeList' => $excludeList,
				'collectorSettings' => $collectorSettings
			];
			return new JSONResponse($this->service->restart($params), Http::STATUS_OK);
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
	 */
	public function details(int $taskId, int $limit = null, int $page = null): JSONResponse {
		if ($taskId) {
			/** @var CollectorTask */
			$collectorTask = $this->service->get($taskId);
			if ($collectorTask instanceof CollectorTask) {
				$offset = $page * $limit;
				$collectorTaskDetails = $this->service->details($taskId, $limit, $offset);
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
			$collectorTask = $this->service->get($taskId);
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
	public function deleteTaskDetail(int $taskDetailId): JSONResponse {
		if ($taskDetailId) {
			/** @var CollectorTask */
			$deletedTaskDetail = $this->service->deleteTaskDetail($taskDetailId);
			return new JSONResponse([
				'success' => $taskDetailId === intval($deletedTaskDetail->getId()),
				'deletedTaskDetail' => $deletedTaskDetail
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
	public function getDetailGroupFilesInfo(int $taskDetailId, bool $filesizeAscending = false): JSONResponse {
		if ($taskDetailId) {
			return new JSONResponse($this->service->getDetailGroupFilesInfo($taskDetailId, $filesizeAscending), Http::STATUS_OK);
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function getDetailFilesTotalSize($taskId): JSONResponse {
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
	public function deleteTaskDetailFile(int $taskId, int $taskDetailId, int $fileId): JSONResponse {
		if ($taskDetailId && $fileId) {
			return new JSONResponse($this->service->deleteTaskDetailFile($taskId, $taskDetailId, $fileId), Http::STATUS_OK);
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}

	// Batch editing actions

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function removeTaskDetailGroups(array $taskDetailIds): JSONResponse {
		if ($taskDetailIds) {
			return new JSONResponse($this->service->removeTaskDetailGroups($taskDetailIds), Http::STATUS_OK);
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function deleteTaskDetailFiles(int $taskDetailId, array $fileIds): JSONResponse {
		if ($taskDetailId && $fileIds) {
			return new JSONResponse($this->service->deleteTaskDetailFiles($taskDetailId, $fileIds), Http::STATUS_OK);
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function removeTaskDetailFiles(int $taskDetailId, array $fileIds): JSONResponse {
		if ($taskDetailId && $fileIds) {
			return new JSONResponse($this->service->removeTaskDetailFiles($taskDetailId, $fileIds), Http::STATUS_OK);
		} else {
			return new JSONResponse(['success' => false], Http::STATUS_OK);
		}
	}

}
