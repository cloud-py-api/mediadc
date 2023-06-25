<?php

declare(strict_types=1);

/**
 * @copyright Сopyright (c) 2021-2022 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @copyright Сopyright (c) 2021-2022 Alexander Piskun <bigcat88@icloud.com>
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

use OCP\IDBConnection;
use OCP\AppFramework\Db\QBMapper;
use OCP\AppFramework\Db\Entity;
use OCP\DB\QueryBuilder\IQueryBuilder;

use OCA\MediaDC\AppInfo\Application;

class CollectorTaskDetailMapper extends QBMapper {
	public function __construct(IDBConnection $db) {
		parent::__construct($db, Application::APP_ID . '_tasks_details');
	}

	/**
	 * @param int $id
	 *
	 * @throws \OCP\AppFramework\Db\DoesNotExistException if not found
	 * @throws \OCP\AppFramework\Db\MultipleObjectsReturnedException if more than one result
	 *
	 * @return \OCA\MediaDC\Db\CollectorTaskDetail
	 */
	public function find(int $id): Entity {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->tableName)
			->where(
				$qb->expr()->eq('id', $qb->createNamedParameter($id, IQueryBuilder::PARAM_INT))
			);
		return $this->findEntity($qb);
	}

	/**
	 * @param int $limit
	 * @param int $offeset
	 */
	public function findAll(int $limit = null, int $offset = null): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->tableName)
			->setMaxResults($limit)
			->setFirstResult($offset);
		return $this->findEntities($qb);
	}

	/**
	 * @param int $taskId
	 * @param int $limit
	 * @param int $offset
	 *
	 * @return array
	 */
	public function findAllById(int $taskId, int $limit = null, int $offset = null): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->tableName)
			->where(
				$qb->expr()->eq('task_id', $qb->createNamedParameter($taskId, IQueryBuilder::PARAM_INT))
			)
			->setMaxResults($limit)
			->setFirstResult($offset);
		return $this->findEntities($qb);
	}

	public function findByGroupId(int $taskId, int $groupId, int $fileid): Entity {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->tableName, 'mdc_t_d')
			->where($qb->expr()->eq('mdc_t_d.task_id', $qb->createNamedParameter($taskId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('mdc_t_d.group_id', $qb->createNamedParameter($groupId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('mdc_t_d.fileid', $qb->createNamedParameter($fileid, IQueryBuilder::PARAM_INT)))
			->orderBy('mdc_t_d.group_id', 'ASC');
		return $this->findEntity($qb);
	}

	public function findAllByGroupId(int $taskId, int $groupId): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select(
			'mdc_t_d.fileid',
		)
			->from($this->tableName, 'mdc_t_d')
			->where($qb->expr()->eq('mdc_t_d.task_id', $qb->createNamedParameter($taskId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('mdc_t_d.group_id', $qb->createNamedParameter($groupId, IQueryBuilder::PARAM_INT)))
			->orderBy('mdc_t_d.group_id', 'ASC');
		return array_map(function ($row) {
			return intval($row['fileid']);
		}, $qb->executeQuery()->fetchAll());
	}

	public function findAllByGroupIdSize(int $taskId, int $groupId): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select(
			'mdc_t_d.fileid',
		)
			->from($this->tableName, 'mdc_t_d')
			->innerJoin('mdc_t_d', 'filecache', 'f', $qb->expr()->eq('mdc_t_d.fileid', 'f.fileid'))
			->where($qb->expr()->eq('mdc_t_d.task_id', $qb->createNamedParameter($taskId, IQueryBuilder::PARAM_INT)))
			->andWhere($qb->expr()->eq('mdc_t_d.group_id', $qb->createNamedParameter($groupId, IQueryBuilder::PARAM_INT)))
			->orderBy('mdc_t_d.group_id', 'ASC')
			->addOrderBy('f.size', 'DESC');
		return array_map(function ($row) {
			return intval($row['fileid']);
		}, $qb->executeQuery()->fetchAll());
	}

	/**
	 * @param int $taskId
	 * @param int $limit
	 * @param int $offset
	 *
	 * @return array
	 */
	public function findAllByIdGroupped(int $taskId, int $limit = null, int $offset = null): array {
		$qb = $this->db->getQueryBuilder();
		$platform = $this->db->getDatabasePlatform()->getName();
		if ($platform === 'mysql') {
			$grouppedFileIdsFunction = $qb->createFunction('GROUP_CONCAT(mdc_t_d.fileid SEPARATOR \',\') as files');
			$grouppedFilesSizesFunction = $qb->createFunction('GROUP_CONCAT(ocf.size SEPARATOR \',\') as filessizes');
		} elseif ($platform === 'postgresql') {
			$grouppedFileIdsFunction = $qb->createFunction('array_to_string(array_agg(mdc_t_d.fileid), \',\') as files');
			$grouppedFilesSizesFunction = $qb->createFunction('array_to_string(array_agg(ocf.size), \',\') as filessizes');
		}
		$qb->select(
			'mdc_t_d.task_id',
			'mdc_t_d.group_id',
			$grouppedFileIdsFunction,
			$grouppedFilesSizesFunction,
		)
			->from($this->tableName, 'mdc_t_d')
			->innerJoin('mdc_t_d', 'filecache', 'ocf', 'ocf.fileid=mdc_t_d.fileid')
			->groupBy('mdc_t_d.task_id', 'mdc_t_d.group_id')
			->having($qb->expr()->eq('mdc_t_d.task_id', $qb->createNamedParameter($taskId, IQueryBuilder::PARAM_INT)))
			->orderBy('mdc_t_d.group_id', 'ASC')
			->setMaxResults($limit)
			->setFirstResult($offset);
		return $qb->executeQuery()->fetchAll();
	}

	/**
	 * @param int $taskId
	 * @param int $limit
	 * @param int $offset
	 *
	 * @return array
	 */
	public function findAllByIdGrouppedExtended(int $taskId, int $limit = null, int $offset = null): array {
		$qb = $this->db->getQueryBuilder();
		$platform = $this->db->getDatabasePlatform()->getName();
		if ($platform === 'mysql') {
			$grouppedFileIdsFunction = $qb->createFunction('GROUP_CONCAT(mdc_t_d.fileid SEPARATOR \',\') as files');
			$grouppedFilesNamesFunction = $qb->createFunction('GROUP_CONCAT(ocf.name SEPARATOR \',\') as filesnames');
			$grouppedFilesPathsFunction = $qb->createFunction('GROUP_CONCAT(ocf.path SEPARATOR \',\') as filespaths');
			$grouppedFilesSizesFunction = $qb->createFunction('GROUP_CONCAT(ocf.size SEPARATOR \',\') as filessizes');
		} elseif ($platform === 'postgresql') {
			$grouppedFileIdsFunction = $qb->createFunction('array_to_string(array_agg(mdc_t_d.fileid), \',\') as files');
			$grouppedFilesNamesFunction = $qb->createFunction('array_to_string(array_agg(ocf.name), \',\') as filesnames');
			$grouppedFilesPathsFunction = $qb->createFunction('array_to_string(array_agg(ocf.path), \',\') as filespaths');
			$grouppedFilesSizesFunction = $qb->createFunction('array_to_string(array_agg(ocf.size), \',\') as filessizes');
		}
		$qb->select(
			'mdc_t_d.task_id',
			'mdc_t_d.group_id',
			$grouppedFileIdsFunction,
			$grouppedFilesNamesFunction,
			$grouppedFilesPathsFunction,
			$grouppedFilesSizesFunction,
		)
			->from($this->tableName, 'mdc_t_d')
			->innerJoin('mdc_t_d', 'filecache', 'ocf', 'ocf.fileid=mdc_t_d.fileid')
			->groupBy('mdc_t_d.task_id', 'mdc_t_d.group_id')
			->having($qb->expr()->eq('mdc_t_d.task_id', $qb->createNamedParameter($taskId, IQueryBuilder::PARAM_INT)))
			->orderBy('mdc_t_d.group_id', 'ASC')
			->setMaxResults($limit)
			->setFirstResult($offset);
		return $qb->executeQuery()->fetchAll();
	}

	public function getDetailsTotals(int $taskId, int $limit = null, int $offset = null) {
		$qb = $this->db->getQueryBuilder();
		$qb->select(
			$qb->createFunction('COUNT(ocf.fileid) as filestotal'),
			$qb->createFunction('SUM(ocf.size) as filessize'),
		)
			->from($this->tableName, 'mdc_t_d')
			->innerJoin('mdc_t_d', 'filecache', 'ocf', 'ocf.fileid=mdc_t_d.fileid')
			->groupBy('mdc_t_d.task_id', 'mdc_t_d.group_id')
			->having($qb->expr()->eq('mdc_t_d.task_id', $qb->createNamedParameter($taskId, IQueryBuilder::PARAM_INT)))
			->setMaxResults($limit)
			->setFirstResult($offset);
		return array_reduce($qb->executeQuery()->fetchAll(), function ($carry, $row) {
			$carry['filestotal'] += $row['filestotal'];
			$carry['filessize'] += $row['filessize'];
			return $carry;
		}, ['filestotal' => 0, 'filessize' => 0]);
	}

	/**
	 * @param int $taskId
	 *
	 * @return int deleted count
	 */
	public function deleteAllByTaskId(int $taskId): int {
		$qb = $this->db->getQueryBuilder();
		$result = $qb->delete($this->tableName)->where(
			$qb->expr()->eq('task_id', $qb->createNamedParameter($taskId, IQueryBuilder::PARAM_INT))
		)->executeStatement();
		return $result;
	}

	public function deleteDetailGroup(int $taskId, int $groupId) {
		$qb = $this->db->getQueryBuilder();
		$result = $qb->delete($this->tableName)
		->where($qb->expr()->eq('task_id', $qb->createNamedParameter($taskId, IQueryBuilder::PARAM_INT)))
		->andWhere($qb->expr()->eq('group_id', $qb->createNamedParameter($groupId, IQueryBuilder::PARAM_INT)))
		->executeStatement();
		return $result;
	}

	public function deleteGroupFiles(int $taskId, int $groupId, array $fileids) {
		$qb = $this->db->getQueryBuilder();
		$result = $qb->delete($this->tableName)
		->where($qb->expr()->eq('task_id', $qb->createNamedParameter($taskId, IQueryBuilder::PARAM_INT)))
		->andWhere($qb->expr()->eq('group_id', $qb->createNamedParameter($groupId, IQueryBuilder::PARAM_INT)))
		->andWhere($qb->expr()->in('fileid', $qb->createNamedParameter($fileids, IQueryBuilder::PARAM_INT_ARRAY)))
		->executeStatement();
		return $result;
	}
}
