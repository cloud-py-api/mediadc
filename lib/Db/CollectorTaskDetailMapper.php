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
		* @throws \OCP\AppFramework\Db\DoesNotExistException if not found
		* @throws \OCP\AppFramework\Db\MultipleObjectsReturnedException if more than one result
		*/
	public function find(int $id): Entity {
		$qb = $this->db->getQueryBuilder();

		$qb->select('*')
			->from($this->tableName)
			->where(
				$qb->expr()->eq('id', $qb->createNamedParameter($id,IQueryBuilder::PARAM_INT))
			);

		return $this->findEntity($qb);
	}

	public function findAll($limit=null, $offset=null): array {
		$qb = $this->db->getQueryBuilder();

		$qb->select('*')
			->from($this->tableName)
			->setMaxResults($limit)
			->setFirstResult($offset);

		return $this->findEntities($qb);
	}

	/**
		* @param int $taskId
		*/
	public function findAllById($taskId, $limit=null, $offset=null): array {
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

}
