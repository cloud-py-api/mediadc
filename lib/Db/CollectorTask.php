<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2021-2022 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @copyright Copyright (c) 2021-2022 Alexander Piskun <bigcat88@icloud.com>
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

namespace OCA\MediaDC\Db;

use JsonSerializable;
use OCP\AppFramework\Db\Entity;

/**
 * Class CollectorTask
 *
 * @package OCA\MediaDC\Db
 *
 * @method string getType()
 * @method string getOwner()
 * @method string getTargetDirectoryIds()
 * @method string getExcludeList()
 * @method string getCollectorSettings()
 * @method int getFilesScanned()
 * @method int getFilesTotal()
 * @method int getFilesTotalSize()
 * @method int getCreatedTime()
 * @method int getFinishedTime()
 * @method int getUpdatedTime()
 * @method int getDeletedFilesCount()
 * @method int getDeletedFilesSize()
 * @method int getPyPid()
 * @method array getErrors()
 * @method void setType(string $type)
 * @method void setOwner(string $taskOwner)
 * @method void setTargetDirectoryIds(string $targetDirectoryIds)
 * @method void setExcludeList(string $excludeList)
 * @method void setCollectorSettings(string $collectorSettings)
 * @method void setFilesScanned(int $totalFilesScanned)
 * @method void setFilesTotal(int $filesTotal)
 * @method void setFilesTotalSize(int $filesTotalSize)
 * @method void setDeletedFilesCount(int $deletedFilesCount)
 * @method void setDeletedFilesSize(int $deletedFilesSize)
 * @method void setCreatedTime(int $taskCreated)
 * @method void setFinishedTime(int $taskFinished)
 * @method void setUpdatedTime(int $updatedTime)
 * @method void setPyPid(int $pyPid)
 * @method void setErrors(string $errors)
 */
class CollectorTask extends Entity implements JsonSerializable {
	protected $type;
	protected $owner;
	protected $targetDirectoryIds;
	protected $excludeList;
	protected $collectorSettings;
	protected $filesScanned;
	protected $filesTotal;
	protected $filesTotalSize;
	protected $deletedFilesCount;
	protected $deletedFilesSize;
	protected $createdTime;
	protected $finishedTime;
	protected $updatedTime;
	protected $pyPid;
	protected $errors;


	public function __construct(array $params = []) {
		if (isset($params['id'])) {
			$this->setId($params['id']);
		}
		if (isset($params['type'])) {
			$this->setType($params['type']);
		}
		if (isset($params['owner'])) {
			$this->setOwner($params['owner']);
		}
		if (isset($params['targetDirectoryIds'])) {
			$this->setTargetDirectoryIds($params['targetDirectoryIds']);
		}
		if (isset($params['excludeList'])) {
			$this->setExcludeList($params['excludeList']);
		}
		if (isset($params['collectorSettings'])) {
			$this->setCollectorSettings($params['collectorSettings']);
		}
		if (isset($params['filesScanned'])) {
			$this->setFilesScanned($params['filesScanned']);
		}
		if (isset($params['filesTotal'])) {
			$this->setFilesTotal($params['filesTotal']);
		}
		if (isset($params['filesTotalSize'])) {
			$this->setFilesTotalSize($params['filesTotalSize']);
		}
		if (isset($params['deletedFilesCount'])) {
			$this->setDeletedFilesCount($params['deletedFilesCount']);
		}
		if (isset($params['deletedFilesSize'])) {
			$this->setDeletedFilesSize($params['deletedFilesSize']);
		}
		if (isset($params['createdTime'])) {
			$this->setCreatedTime($params['createdTime']);
		}
		if (isset($params['taskFinished'])) {
			$this->setFinishedTime($params['taskFinished']);
		}
		if (isset($params['updatedTime'])) {
			$this->setUpdatedTime($params['updatedTime']);
		}
		if (isset($params['pyPid'])) {
			$this->setPyPid($params['pyPid']);
		}
		if (isset($params['errors'])) {
			$this->setErrors($params['errors']);
		}
	}

	public function jsonSerialize(): array {
		return [
			'id' => $this->getId(),
			'type' => $this->getType(),
			'owner' => $this->getOwner(),
			'target_directory_ids' => $this->getTargetDirectoryIds(),
			'exclude_list' => $this->getExcludeList(),
			'collector_settings' => $this->getCollectorSettings(),
			'files_scanned' => $this->getFilesScanned(),
			'files_total' => $this->getFilesTotal(),
			'files_total_size' => $this->getFilesTotalSize(),
			'deleted_files_count' => $this->getDeletedFilesCount(),
			'deleted_files_size' => $this->getDeletedFilesSize(),
			'created_time' => $this->getCreatedTime(),
			'finished_time' => $this->getFinishedTime(),
			'updated_time' => $this->getUpdatedTime(),
			'py_pid' => $this->getPyPid(),
			'errors' => $this->getErrors(),
		];
	}
}
