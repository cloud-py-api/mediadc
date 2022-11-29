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

use RuntimeException;
use OCP\Files\IAppData;
use OCP\Files\NotPermittedException;
use OCP\Files\NotFoundException;
use OCP\IConfig;

use OCA\MediaDC\AppInfo\Application;

class AppDataService {
	/** @var IAppData */
	private $appData;

	/** @var IConfig */
	private $config;

	/** @var UtilsService */
	private $utils;

	/** @var PythonService */
	private $pythonService;

	public function __construct(
		IAppData $appData,
		IConfig $config,
		UtilsService $utils,
		PythonService $pythonService
	) {
		$this->appData = $appData;
		$this->config = $config;
		$this->utils = $utils;
		$this->pythonService = $pythonService;
		$this->ncInstanceId = $this->config->getSystemValue('instanceid');
		$this->ncDataFolder = $this->config->getSystemValue('datadirectory');
	}

	public function createAppDataFolder(string $folderName): bool {
		$appDataFolder = $this->ncDataFolder . '/appdata_' . $this->ncInstanceId . '/'
			. Application::APP_ID . '/' . $folderName;
		if (!file_exists($appDataFolder)) {
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
	 * @param string $folderName
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
				'ls' => json_encode($folder->getDirectoryListing()),
			];
		} catch (NotFoundException | RuntimeException $e) {
			return ['success' => file_exists($appDataFolderPath), 'error' => $e->getMessage()];
		}
	}

	public function downloadPythonBinary(bool $update = false) {
		$url = 'https://github.com/bigcat88/cpa_py_bundles/releases/download/0.3.0-beta.1/cpa_' .
			$this->getBinaryName() . '.gz';
		$binariesFolder = $this->getAppDataFolder('binaries');
		if (isset($binariesFolder['success']) && $binariesFolder['success']) {
			$dir = $this->getAppDataFolder('binaries')['path'] . '/';
		}
		$file_name = 'main.gz';
		$save_file_loc = $dir . $file_name;
		if (!file_exists($dir . str_replace('.gz', '', $file_name)) && $update) {
			$cURL = curl_init($url);
			$fp = fopen($save_file_loc, 'wb');
			if ($fp) {
				curl_setopt_array($cURL, [
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_FILE => $fp,
					CURLOPT_FOLLOWLOCATION => true,
				]);
				curl_exec($cURL);
				curl_close($cURL);
				fclose($fp);
				$ungzipped = $this->unGz($file_name);
				$chmodx = $this->addChmodX($file_name);
				$test = $this->testDownloadedBinary($file_name);
				unlink($save_file_loc);
				return [
					'downloaded' => file_exists($save_file_loc),
					'ungzipped' => $ungzipped,
					'chmodx' => $chmodx,
					'test' => $test
				];
			}
		}
		if (!file_exists($dir . str_replace('.gz', '', $file_name))) {
			return ['success' => false, 'file' => $save_file_loc];
		} else {
			return [
				'success' => true,
				'downloaded' => true,
				'ungzipped' => true,
				'chmodx' => true,
			];
		}
	}

	public function unGz(string $file_name): bool {
		$out_file_name = $this->getAppDataFolder('binaries')['path'] . '/main';
		$buffer_size = 4096;
		$file_name = $this->getAppDataFolder('binaries')['path'] . '/' . $file_name;
		$gz_file = gzopen($file_name, 'rb');
		$out_file = fopen($out_file_name, 'wb');
		while (!gzeof($gz_file)) {
			fwrite($out_file, gzread($gz_file, $buffer_size));
		}
		fclose($out_file);
		gzclose($gz_file);
		return file_exists($out_file_name);
	}

	public function addChmodX(string $file_name): bool {
		$file_name = $this->getAppDataFolder('binaries')['path'] . '/' .
			str_replace('.gz', '', $file_name);
		if (file_exists($file_name)) {
			exec('chmod +x ' . $file_name, $output, $result_code);
			return $result_code === 0;
		}
		return false;
	}

	public function testDownloadedBinary(string $file_name): array {
		$result = $this->pythonService->run('binaries/' . str_replace('.gz', '', $file_name), [
			'--info' => ''
		], false, [
			'PHP_PATH' => $this->utils->getPhpInterpreter(),
			'SERVER_ROOT' => \OC::$SERVERROOT,
		], true);
		return [
			'success' => $result['result_code'] === 0,
			'result' => $result,
		];
	}

	public function getBinaryName(): string {
		if (!$this->utils->isMusliLinux()) {
			$binaryName = 'manylinux_' . $this->utils->getOsArch();
		} else {
			$binaryName = 'musllinux_' . $this->utils->getOsArch();
		}
		return $binaryName;
	}
}
