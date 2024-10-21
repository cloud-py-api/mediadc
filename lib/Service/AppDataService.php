<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2022 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @copyright Copyright (c) 2022 Alexander Piskun <bigcat88@icloud.com>
 *
 * @author 2022 Andrey Borysenko <andrey18106x@gmail.com>
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

use OCA\MediaDC\AppInfo\Application;
use OCP\Files\AppData\IAppDataFactory;
use OCP\Files\IAppData;
use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;
use OCP\Files\SimpleFS\ISimpleFolder;
use OCP\IConfig;

use RuntimeException;

class AppDataService {
	private string $ncInstanceId;
	private string $ncDataFolder;
	private IAppData $appData;

	public function __construct(
		private readonly IAppDataFactory $appDataFactory,
		private readonly IConfig $config,
	) {
		$this->ncInstanceId = $this->config->getSystemValue('instanceid');
		$this->ncDataFolder = $this->config->getSystemValue('datadirectory');
		$this->appData = $this->appDataFactory->get(Application::APP_ID);
	}

	/**
	 * Create appdata folder if not exists
	 *
	 * @param string $folderName target appdata folder
	 *
	 * @return bool `false` on permission error
	 */
	public function createAppDataFolder(string $folderName): bool {
		$appDataFolder = $this->ncDataFolder . '/appdata_' . $this->ncInstanceId . '/'
			. Application::APP_ID . '/' . $folderName;
		$folderNameExists = false;
		try {
			$folder = $this->appData->getFolder($folderName);
			$folderNameExists = $folder instanceof ISimpleFolder;
		} catch (NotFoundException $e) {
		}
		if (!$folderNameExists) {
			try {
				$this->appData->newFolder($folderName);
				return true;
			} catch (NotPermittedException $e) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Get app's appdata folder
	 *
	 * @param string $folderName target appdata folder
	 *
	 * @return array
	 */
	public function getAppDataFolder(string $folderName): array {
		try {
			$appDataFolderPath = $this->ncDataFolder . '/appdata_' . $this->ncInstanceId . '/'
				. Application::APP_ID . '/' . $folderName;
			$folder = $this->appData->getFolder($folderName);
			return [
				'success' => file_exists($appDataFolderPath),
				'folder' => $folder,
				'folderName' => $folder->getName(),
				'path' => $appDataFolderPath,
			];
		} catch (NotFoundException|RuntimeException $e) {
			return ['success' => file_exists($appDataFolderPath), 'error' => $e->getMessage()];
		}
	}
}
