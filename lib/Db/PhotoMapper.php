<?php

declare(strict_types=1);

/**
 * @copyright Сopyright (c) 2021-2022 Andrey Borysenko <andrey18106x@gmail.com>
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

use Exception;
use OCP\IDBConnection;
use OCP\AppFramework\Db\Entity;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;

use OCA\MediaDC\AppInfo\Application;

class PhotoMapper extends QBMapper {
	public function __construct(IDBConnection $db) {
		parent::__construct($db, Application::APP_ID . '_photos');
	}

	/**
	 * @param int $id
	 *
	 * @throws \OCP\AppFramework\Db\DoesNotExistException if not found
	 * @throws \OCP\AppFramework\Db\MultipleObjectsReturnedException if more than one result
	 *
	 * @return \OCA\MediaDC\Db\Photo
	 */
	public function find(int $id): Entity {
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->tableName)
			->where(
				$qb->expr()->eq('fileid', $qb->createNamedParameter($id, IQueryBuilder::PARAM_INT))
			);
		return $this->findEntity($qb);
	}

	public function findAllFileids(int $limit = null, int $offset = null): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('t.id', 't.fileid')
			->from($this->tableName, 't')
			->setMaxResults($limit)
			->setFirstResult($offset);
		return $this->findEntities($qb);
	}

	/**
	 * Check if file exists in filecache
	 *
	 * @param int $fileid
	 *
	 * @return bool
	 */
	public function inFileCache(int $fileid): bool {
		$qb = $this->db->getQueryBuilder();
		$qb->select('t.fileid')->from('filecache', 't')->where(
			$qb->expr()->eq('fileid', $qb->createNamedParameter($fileid, IQueryBuilder::PARAM_INT))
		);
		try {
			$result = $qb->executeQuery();
			return $result->rowCount() === 0;
		} catch (Exception $e) {
			return false;
		}
	}

	public function truncate(): int {
		return $this->db->getQueryBuilder()->delete($this->tableName)->executeStatement();
	}

	public function resolve(int $fileid, bool $resolved = true): int {
		$qb = $this->db->getQueryBuilder();
		$qb->update($this->tableName)
			->set('skipped', $qb->createNamedParameter($resolved ? 100 : 0, IQueryBuilder::PARAM_INT))
			->where(
				$qb->expr()->eq('fileid', $qb->createNamedParameter($fileid, IQueryBuilder::PARAM_INT))
			);
		return $qb->executeStatement();
	}

	/**
	 * Find all user's resolved files (skipped flag >=100)
	 *
	 * @param string $userId
	 * @param int $limit
	 * @param int $offset
	 *
	 * @return array
	 */
	public function findAllResolvedByUser(string $userId, int $limit = null, int $offset = null) {
		$qb = $this->db->getQueryBuilder();
		$qb->select(
			'ocf.fileid',
			'ocf.name',
			'ocf.path',
			'ocf.size',
			'ocf.mimetype',
			'ocf.mimepart'
		)
			->from($this->tableName, 'mdc_photos')
			->innerJoin('mdc_photos', 'filecache', 'ocf', 'ocf.fileid=mdc_photos.fileid')
			->innerJoin('ocf', 'storages', 'strg', 'ocf.storage=strg.numeric_id')
			->innerJoin('strg', 'mounts', 'mnts', 'strg.numeric_id=mnts.storage_id')
			->where(
				$qb->expr()->eq('mnts.user_id', $qb->createNamedParameter($userId, IQueryBuilder::PARAM_STR)),
				$qb->expr()->gte('mdc_photos.skipped', $qb->createNamedParameter(100, IQueryBuilder::PARAM_INT))
			)
			->groupBy('ocf.fileid')
			->setMaxResults($limit)
			->setFirstResult($offset);
		return $qb->executeQuery()->fetchAll();
	}

	public function cleanupResolved(array $fileIds): int {
		$qb = $this->db->getQueryBuilder();
		$qb->update($this->tableName)
			->set('skipped', $qb->createNamedParameter(0, IQueryBuilder::PARAM_INT))
			->where(
				$qb->expr()->gte('skipped', $qb->createNamedParameter(100, IQueryBuilder::PARAM_INT)),
				$qb->expr()->in('fileid', $qb->createNamedParameter($fileIds, IQueryBuilder::PARAM_INT_ARRAY))
			);
		return $qb->executeStatement();
	}
}
