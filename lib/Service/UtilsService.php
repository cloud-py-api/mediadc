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

namespace OCA\MediaDC\Service;

use bantu\IniGetWrapper\IniGetWrapper;
use OCP\IConfig;
use OCP\App\IAppManager;
use OCA\ServerInfo\DatabaseStatistics;

use OCA\MediaDC\AppInfo\Application;
use OCA\MediaDC\Db\Setting;
use OCA\MediaDC\Db\SettingMapper;

class UtilsService {
	/** @var IConfig */
	private $config;

	/** @var SettingMapper */
	private $settingMapper;

	/** @var string */
	private $pythonCommand;

	/** @var IAppManager */
	private $appManager;

	/** @var ?DatabaseStatistics */
	private $databaseStatistics;

	public function __construct(
		IConfig $config,
		SettingMapper $settingMapper,
		IAppManager $appManager,
		?DatabaseStatistics $databaseStatistics
	) {
		$this->config = $config;
		$this->settingMapper = $settingMapper;
		$this->appManager = $appManager;
		$this->databaseStatistics = $databaseStatistics;
	}

	/**
	 * Return a suitable PHP interpreter that is likely to be the same version as the
	 * currently running interpreter.  This is similar to using the PHP_BINARY constant, but
	 * it will also work from within mod_php or PHP-FPM, in which case PHP_BINARY will return
	 * unusable interpreters.
	 *
	 * @return string
	 */
	public function getPhpInterpreter() {
		$usePhpPathFromSettings = json_decode($this->settingMapper->findByName('use_php_path_from_settings')->getValue());

		if (isset($usePhpPathFromSettings) && $usePhpPathFromSettings) {
			$phpPath = json_decode($this->settingMapper->findByName('php_path')->getValue());
			return $phpPath;
		}

		static $cachedExecutable = null;

		if ($cachedExecutable !== null) {
			return $cachedExecutable;
		}

		$basename = basename(PHP_BINARY);

		// If the binary is 'php', 'php7', 'php7.3' etc, then assume it's a usable interpreter
		if ($basename === 'php' || preg_match('/^php\d+(?:\.\d+)*$/', $basename)) {
			return PHP_BINARY;
		}

		// Otherwise, we might be running as mod_php, php-fpm, etc, where PHP_BINARY is not a
		// usable PHP interpreter.  Try to find one with the same version as the current one.

		$candidates = [
			'php' . PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION . '.' . PHP_RELEASE_VERSION,
			'php' . PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION,
			'php' . PHP_MAJOR_VERSION,
		];

		$envPath = $_SERVER['PATH'] ?? '';
		$paths = $envPath !== '' ? explode(':', $envPath) : [];

		if (!in_array(PHP_BINDIR, $paths, true)) {
			$paths[] = PHP_BINDIR;
		}

		foreach ($candidates as $candidate) {
			foreach ($paths as $path) {
				$executable = $path . DIRECTORY_SEPARATOR . $candidate;
				if (is_executable($executable)) {
					$cachedExecutable = $executable;
					return $executable;
				}
			}
		}

		// Fallback, if nothing else can be found
		$cachedExecutable = 'php';
		return $cachedExecutable;
	}

	/**
	 * Check if a php function available
	 *
	 * @param string $function_name
	 *
	 * @return bool
	 */
	public function isFunctionEnabled($function_name) {
		if (!function_exists($function_name)) {
			return false;
		}
		/**
		 * @psalm-suppress UndefinedClass
		 * @psalm-suppress UndefinedDocblockClass
		 * @var IniGetWrapper $ini
		 */
		$ini = \OCP\Server::get(IniGetWrapper::class);
		$disabled = explode(',', $ini->get('disable_functions') ?: '');
		$disabled = array_map('trim', $disabled);
		if (in_array($function_name, $disabled)) {
			return false;
		}
		/** @psalm-suppress UndefinedDocblockClass */
		$disabled = explode(',', $ini->get('suhosin.executor.func.blacklist') ?: '');
		$disabled = array_map('trim', $disabled);
		if (in_array($function_name, $disabled)) {
			return false;
		}
		return true;
	}

	public function getPythonVersion(): array {
		/** @var Setting */
		$pythonCommandSetting = $this->settingMapper->findByName('python_command');
		$this->pythonCommand = $pythonCommandSetting->getValue();
		exec($this->pythonCommand . ' --version', $output, $result_code);
		if ($result_code === 0 && isset($output[0]) && preg_match_all("/\d{1}\.\d{1,2}(\.\d{1,2}){0,1}/s", $output[0], $matches)) {
			return isset($matches[0][0]) ?
				['success' => true, 'matches' => $matches[0][0], 'result_code' => $result_code] :
				['success' => false, 'result_code' => $result_code];
		}
		return ['success' => false, 'result_code' => $result_code];
	}

	/**
	 * Check if installed Python version compatible with MediaDC application
	 *
	 * @return array $result
	 */
	public function isPythonCompatible(): array {
		$pythonVersion = $this->getPythonVersion();
		if (!$pythonVersion['success']) {
			return ['success' => false, 'result_code' => $pythonVersion['result_code']];
		}
		$pythonVersionDigits = explode(".", $pythonVersion['matches']);
		if ((int)$pythonVersionDigits[0] >= 3) {
			if ((int)$pythonVersionDigits[1] < 6) {
				return ['success' => false, 'result_code' => $pythonVersion['result_code']];
			}
			if ((int)$pythonVersionDigits[1] > 6) {
				return ['success' => true, 'result_code' => $pythonVersion['result_code']];
			} elseif ((int)$pythonVersionDigits[1] === 6 && (int)$pythonVersionDigits[2] >= 8) {
				return ['success' => true, 'result_code' => $pythonVersion['result_code']];
			}
			if ((int)$pythonVersionDigits[2] >= 0) {
				return ['success' => true, 'result_code' => $pythonVersion['result_code']];
			}
		}
		return ['success' => false, 'result_code' => $pythonVersion['result_code']];
	}

	public function isSnapEnv(): bool {
		return getenv('SNAP') !== false;
	}

	public function isVideosSupported(): bool {
		$result = false;
		exec('ffmpeg -version', $output, $result_code);
		if ($result_code === 0 && count($output) > 0 && preg_match('/version/s', $output[0], $matches)) {
			$result = count($matches) > 0 && $matches[0] === 'version';
		}
		exec('ffprobe -version', $output, $result_code);
		if ($result_code === 0 && count($output) > 0 && preg_match('/version/s', $output[0], $matches)) {
			$result = $result && count($matches) > 0 && $matches[0] === 'version';
		}
		return $result;
	}

	public function isMusliLinux(): bool {
		exec('ldd --version', $output, $result_code);
		if ($result_code == 0 && count($output) > 0 && str_contains($output[0], 'musl')) {
			return true;
		}
		return false;
	}

	public function getOsArch(): string {
		$machineType = php_uname('m');
		if (str_contains($machineType, 'x86_64')) {
			return 'amd64';
		} elseif (str_contains($machineType, 'arm64')) {
			return 'arm64';
		} else {
			return 'armv7';
		}
		return $machineType;
	}

	public function getCustomAppsDirectory() {
		$apps_directory = $this->config->getSystemValue('apps_paths');
		if ($apps_directory !== "" && is_array($apps_directory) && count($apps_directory) > 0) {
			foreach ($apps_directory as $custom_apps_dir) {
				$appDir = $custom_apps_dir['path'] . '/' . Application::APP_ID;
				if (
					file_exists($custom_apps_dir['path']) && is_dir($custom_apps_dir['path']) && $custom_apps_dir['writable']
					&& file_exists($appDir) && is_dir($appDir)
				) {
					return $custom_apps_dir['path'] . '/';
				}
			}
		}
		return getcwd() . '/apps/';
	}

	public function getSystemInfo(): array {
		$pythonVersion = $this->getPythonVersion();
		$result = [
			'nextcloud-version' => $this->config->getSystemValue('version'),
			Application::APP_ID . '-version' => $this->appManager->getAppVersion(Application::APP_ID),
			'is-videos-supported' => $this->isVideosSupported(),
			'is-snap' => $this->isSnapEnv(),
			'arch' => $this->getOsArch(),
			'webserver' => isset($_SERVER['SERVER_SOFTWARE']) ? $_SERVER['SERVER_SOFTWARE'] : null,
			'database' => $this->databaseStatistics !== null ? $this->databaseStatistics->getDatabaseStatistics() : null,
			'php-version' => phpversion(),
			'php-interpreter' => $this->getPhpInterpreter(),
			'python-version' => $pythonVersion['success'] ? $pythonVersion['matches'] : 'Error: result_code=' . $pythonVersion['result_code'],
			'python-interpretter-setting' => json_decode($this->pythonCommand),
			'os' => php_uname('s'),
			'os-release' => php_uname('r'),
			'machine-type' => php_uname('m'),
		];
		return $result;
	}

	public function checkForSettingsUpdates($app_data) {
		$settings = $this->settingMapper->findAll();
		if (count($settings) > 0) {
			$this->checkForNewSettings($app_data, $settings);
			$this->checkForDeletedSettings($app_data, $settings);
		}
	}

	private function checkForNewSettings(array $app_data, array $settings): void {
		$currentSettingsKeys = array_map(function ($setting) {
			return $setting->getName();
		}, $settings);
		$newSettingsKeys = array_map(function ($setting) {
			return $setting['name'];
		}, $app_data['settings']);
		$newSettings = [];
		foreach ($newSettingsKeys as $setting) {
			if (!in_array($setting, $currentSettingsKeys)) {
				array_push($newSettings, $setting);
			}
		}
		foreach ($app_data['settings'] as $setting) {
			if (in_array($setting['name'], $newSettings)) {
				$this->settingMapper->insert(new Setting([
					'name' => $setting['name'],
					'value' => is_array($setting['value']) ?
						json_encode($setting['value'])
						: str_replace('\\', '', json_encode($setting['value'])),
					'displayName' => $setting['displayName'],
					'description' => $setting['description']
				]));
			}
		}
	}

	private function checkForDeletedSettings(array $app_data, array $settings): void {
		$currentSettingsKeys = array_map(function ($setting) {
			return $setting->getName();
		}, $settings);
		$newSettingsKeys = array_map(function ($setting) {
			return $setting['name'];
		}, $app_data['settings']);
		$settingsToRemove = [];
		foreach ($currentSettingsKeys as $setting) {
			if (!in_array($setting, $newSettingsKeys)) {
				array_push($settingsToRemove, $setting);
			}
		}
		foreach ($settingsToRemove as $settingName) {
			$setting = $this->settingMapper->findByName($settingName);
			if (isset($setting)) {
				$this->settingMapper->delete($setting);
			}
		}
	}
}
