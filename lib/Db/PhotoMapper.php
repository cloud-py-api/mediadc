<?php

declare(strict_types=1);

/**
 * @copyright 2021 Andrey Borysenko <andrey18106x@gmail.com>
 * @copyright 2021 Alexander Piskun <bigcat88@icloud.com>
 *
 * @author 2021 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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
 */

namespace OCA\MediaDC\Db;

use Exception;
use OCP\IDBConnection;
use OCP\AppFramework\Db\Entity;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\QueryBuilder\IQueryBuilder;

use OCA\MediaDC\AppInfo\Application;
use OCP\DB\IResult;
use Psr\Log\LoggerInterface;

class PhotoMapper extends QBMapper {

	/** @var LoggerInterface */
	private $logger;

	public function __construct(IDBConnection $db, LoggerInterface $logger) {
		parent::__construct($db, Application::APP_ID . '_photos');

		$this->logger = $logger;
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
				$qb->expr()->eq('file_id', $qb->createNamedParameter($id,IQueryBuilder::PARAM_INT))
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

	public function findAllFileids($limit=null, $offset=null): array {
		$qb = $this->db->getQueryBuilder();

		$qb->select('t.id', 't.fileid')
			->from($this->tableName, 't')
			->setMaxResults($limit)
			->setFirstResult($offset);

		return $this->findEntities($qb);
	}

	public function inFileCache(int $fileid): bool {
		/** @var IQueryBuilder */
		$qb = $this->db->getQueryBuilder();
		$qb->select('t.fileid')->from('filecache', 't')->where(
			$qb->expr()->eq('fileid', $qb->createNamedParameter($fileid, IQueryBuilder::PARAM_INT))
		);
		try {
			$result = $qb->execute();
			return $result instanceof IResult ? $result->rowCount() === 0 : $result === 0;
		} catch (Exception $e) {
			return false;
		}
	}

	public function truncate(): int {
		$result = $this->db->getQueryBuilder()->delete($this->tableName)->execute();
		return $result instanceof IResult ? $result->rowCount() : $result;
	}

}
