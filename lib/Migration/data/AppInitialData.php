<?php

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

namespace OCA\MediaDC\Migration\data;

class AppInitialData {
	/** @var \OCP\IL10N */
	private $l10n;

	public static $APP_INITIAL_DATA = [
		'settings' => [
			[
				"name" => "hashing_algorithm",
				"value" => "dhash",
				"displayName" => "Hashing algorithm",
				"description" => "Hashing algorithm used by Python background script"
			],
			[
				"name" => "similarity_threshold",
				"value" => 90,
				"displayName" => "Similarity threshold",
				"description" => "Hashing algorithm threshold (precision)"
			],
			[
				"name" => "hash_size",
				"value" => 16,
				"displayName" => "Hash size",
				"description" => "Computed hash size (8, 16, 32, 64)"
			],
			[
				"name" => "python_limit",
				"value" => 1,
				"displayName" => "Simultaneously running tasks limit",
				"description" => "Maximum number of python background scripts running"
			],
			[
				"name" => "exclude_list",
				"value" => [
					"mask" => [],
					"fileid" => []
				],
				"displayName" => "Exclude list",
				"description" => "Global administrator's exclude list that applies to each task"
			],
			[
				"name" => "python_binary",
				"value" => true,
				"displayName" => "Use pre-compiled Python binaries",
				"description" => "Use Python part in binary format (located in the appdata folder)"
			],
		]
	];

	public function __construct(\OCP\IL10N $l10n) {
		$this->l10n = $l10n;
	}

	private function _stringsForL10N(): void {
		// TRANSLATORS MediaDC Admin settings strings for localization (Eng versions stored in the database and translated on front-end)
		$this->l10n->t("Hashing algorithm");
		$this->l10n->t("Hashing algorithm used by Python background script");
		$this->l10n->t("Similarity threshold");
		$this->l10n->t("Hashing algorithm threshold (precision)");
		$this->l10n->t("Hash size");
		$this->l10n->t("Computed hash size (8, 16, 32, 64)");
		$this->l10n->t("Simultaneously running tasks limit");
		$this->l10n->t("Maximum number of python background scripts running");
		$this->l10n->t("Exclude list");
		$this->l10n->t("Global administrator's exclude list that applies to each task");
		$this->l10n->t("Use pre-compiled Python binaries");
		$this->l10n->t("Use Python part in binary format (located in the appdata folder)");
	}
}
