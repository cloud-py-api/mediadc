<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2021-2022 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @copyright Copyright (c) 2021-2022 Alexander Piskun <bigcat88@icloud.com>
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

namespace OCA\MediaDC\Migration;

use OCP\DB\ISchemaWrapper;
use OCP\Migration\SimpleMigrationStep;
use OCP\Migration\IOutput;

class Version0001Date20210627153636 extends SimpleMigrationStep {
	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, \Closure $schemaClosure, array $options) {
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if (!$schema->hasTable('mediadc_photos')) {
			$table = $schema->createTable('mediadc_photos');

			$table->addColumn('id', 'bigint', [
				'autoincrement' => true,
				'notnull' => true
			]);
			$table->addColumn('fileid', 'bigint', [
				'notnull' => true
			]);
			$table->addColumn('hash', 'binary', [
				'notnull' => true,
				'default' => "",
				'length' => 512
			]);
			$table->addColumn('mtime', 'bigint', [
				'notnull' => true,
				'default' => 0
			]);
			$table->addColumn('skipped', 'integer', [
				'notnull' => true,
				'default' => 0
			]);

			$table->setPrimaryKey(['id']);
			$table->addUniqueIndex(['fileid'], 'mediadc_photos_fileid__index');
			$table->addIndex(['mtime'], 'mediadc_photos_mtime__index');
		}


		if (!$schema->hasTable('mediadc_videos')) {
			$table = $schema->createTable('mediadc_videos');

			$table->addColumn('id', 'bigint', [
				'autoincrement' => true,
				'notnull' => true
			]);
			$table->addColumn('fileid', 'bigint', [
				'notnull' => true
			]);
			$table->addColumn('duration', 'integer', [
				'notnull' => true,
				'default' => 0
			]);
			$table->addColumn('timestamps', 'json', [
				'notnull' => true
			]);
			$table->addColumn('hash', 'binary', [
				'notnull' => true,
				'default' => "",
				'length' => 2048
			]);
			$table->addColumn('mtime', 'bigint', [
				'notnull' => true,
				'default' => 0
			]);
			$table->addColumn('skipped', 'integer', [
				'notnull' => true,
				'default' => 0
			]);

			$table->setPrimaryKey(['id']);
			$table->addUniqueIndex(['fileid'], 'mediadc_videos_fileid__index');
			$table->addIndex(['mtime'], 'mediadc_videos_mtime__index');
		}


		if (!$schema->hasTable('mediadc_settings')) {
			$table = $schema->createTable('mediadc_settings');

			$table->addColumn('id', 'integer', [
				'autoincrement' => true,
				'notnull' => true
			]);
			$table->addColumn('name', 'string', [
				'notnull' => true,
				'default' => ""
			]);
			$table->addColumn('value', 'json', [
				'notnull' => true
			]);
			$table->addColumn('display_name', 'string', [
				'notnull' => true,
				'default' => ""
			]);
			$table->addColumn('description', 'string', [
				'notnull' => true,
				'default' => ""
			]);

			$table->setPrimaryKey(['id']);
			$table->addIndex(['name'], 'mediadc_setting__index');
		}


		if (!$schema->hasTable('mediadc_tasks')) {
			$table = $schema->createTable('mediadc_tasks');

			$table->addColumn('id', 'integer', [
				'autoincrement' => true,
				'notnull' => true
			]);
			$table->addColumn('type', 'string', [
				'notnull' => true,
				'length' => 64,
				'default' => 'manual'
			]);
			$table->addColumn('owner', 'string', [
				'notnull' => true,
				'length' => 64,
				'default' => 0
			]);
			$table->addColumn('target_directory_ids', 'json', [
				'notnull' => true
			]);
			$table->addColumn('exclude_list', 'json', [
				'notnull' => true
			]);
			$table->addColumn('collector_settings', 'json', [
				'notnull' => true
			]);
			$table->addColumn('files_scanned', 'bigint', [
				'notnull' => true,
				'default' => 0
			]);
			$table->addColumn('files_total', 'bigint', [
				'notnull' => true,
				'default' => 0
			]);
			$table->addColumn('files_total_size', 'bigint', [
				'notnull' => true,
				'default' => 0
			]);
			$table->addColumn('deleted_files_count', 'bigint', [
				'notnull' => true,
				'default' => 0
			]);
			$table->addColumn('deleted_files_size', 'bigint', [
				'notnull' => true,
				'default' => 0
			]);
			$table->addColumn('created_time', 'bigint', [
				'notnull' => true,
				'default' => 0
			]);
			$table->addColumn('finished_time', 'bigint', [
				'notnull' => true,
				'default' => 0
			]);
			$table->addColumn('updated_time', 'bigint', [
				'notnull' => true,
				'default' => 0
			]);
			$table->addColumn('py_pid', 'integer', [
				'notnull' => true,
				'default' => 0
			]);
			$table->addColumn('errors', 'string', [
				'notnull' => true,
				'default' => '',
				'length' => 1024,
			]);

			$table->setPrimaryKey(['id']);
			$table->addIndex(['owner'], 'mediadc_task_owner__index');
			$table->addIndex(['py_pid'], 'mediadc_py_pid__index');
		}


		if (!$schema->hasTable('mediadc_tasks_details')) {
			$table = $schema->createTable('mediadc_tasks_details');

			$table->addColumn('id', 'integer', [
				'autoincrement' => true,
				'notnull' => true
			]);
			$table->addColumn('task_id', 'integer', [
				'notnull' => true
			]);
			$table->addColumn('group_files_ids', 'json', [
				'notnull' => true
			]);

			$table->setPrimaryKey(['id']);
			$table->addIndex(['task_id'], 'mediadc_details_taskid__index');
		}

		return $schema;
	}
}
