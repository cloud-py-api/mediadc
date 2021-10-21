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

namespace OCA\MediaDC\Service;

use OCP\IDBConnection;
use OCP\DB\ISchemaWrapper;
use OCP\DB\QueryBuilder\IQueryBuilder;

use OCA\MediaDC\AppInfo\Application;


class CleanupService {

	/** @var IDBConnection */
	private $db;

	/** @var ISchemaWrapper */
	private $schema;

	public function __construct(IDBConnection $db, ISchemaWrapper $schema)
	{
		$this->db = $db;
		$this->schema = $schema;
	}

	public function dropAppTables() {
		$tables = array_filter($this->schema->getTableNames(), '\OCA\MediaDC\Service\CleanupService::tablesCallback');
		foreach ($tables as $table) {
			$this->db->dropTable($table);
		}
		$this->removeAppMigrations();
	}

	/**
	 * Callback for tables filter
	 * 
	 * @param string $tableName
	 * 
	 * @return bool
	 */
	static function tablesCallback($tableName) {
		return strpos($tableName, Application::APP_ID) !== false;
	}

	private function removeAppMigrations() {
		/** @var IQueryBuilder */
		$qb = $this->db->getQueryBuilder();
		$qb->delete('migrations')->where(
			$qb->expr()->eq('app', $qb->createNamedParameter(Application::APP_ID, IQueryBuilder::PARAM_STR))
		);
		$qb->execute();
	}

}
