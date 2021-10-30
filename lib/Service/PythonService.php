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

use OCA\MediaDC\AppInfo\Application;
use OCA\MediaDC\Db\Setting;
use OCA\MediaDC\Db\SettingMapper;

use OCP\IConfig;
use Psr\Log\LoggerInterface;
use bantu\IniGetWrapper\IniGetWrapper;


class PythonService {

	/** @var string */
	private $cwd;

	/** @var string */
	private $pythonCommand;

	/** @var IConfig */
	private $config;

	/** @var LoggerInterface */
	private $logger;

	public function __construct(SettingMapper $settingMapper, IConfig $config, LoggerInterface $logger)
	{
		$this->config = $config;
		$this->logger = $logger;
		/** @var Setting */
		$pythonCommand = $settingMapper->findByName('python_command');
		$this->pythonCommand = $pythonCommand->getValue();
		$this->cwd = $this->getCustomAppsDirectory() . Application::APP_ID . '/lib/Service/python';
	}

	/**
	 * Runs Python script with given script relative path and script params
	 * 
	 * @param string $scriptName relative path to the Python script
	 * @param array $scriptParams params to script in array (`['-param1' => value1, '--param2' => value2]`)
	 * @param boolean $nonBlocking flag that determines how to run Python script.
	 * @param array $env env variables for python script
	 * 
	 * @return array|void
	 * 
	 * If `$nonBlocking = true` - function will not waiting for Python script output and return `void`.
	 * If `$nonBlocking = false` - function will return array with the `result_code` 
	 * and `output` of the script after Python script finish executing.
	 */
	public function run($scriptName, $scriptParams, $nonBlocking = false, $env = []) {
		if (count($scriptParams) > 0) {
			$params = array_map('\OCA\MediaDC\Service\PythonService::scriptParamsCallback', array_keys($scriptParams), array_values($scriptParams));
			$cmd = $this->pythonCommand . ' ' . $this->cwd . $scriptName . ' ' . join(' ', $params);
		} else {
			$cmd = $this->pythonCommand . ' ' .  $this->cwd . $scriptName;
		}
		if (count($env) > 0) {
			$envVariables = join(' ', array_map('\OCA\MediaDC\Service\PythonService::scriptEnvsCallback', array_keys($env), array_values($env)));
		} else {
			$envVariables = '';
		}
		if ($nonBlocking) {
			exec($envVariables . 'nohup ' . $cmd . ' > /dev/null 2>&1 &');
		} else {
			exec($envVariables . $cmd, $output, $result_code);
			return [
				'output' => $output,
				'result_code' => $result_code,
			];
		}
	}

	/**
	 * Callback for concatinating Python script params
	 * 
	 * @param string $key
	 * @param string $value
	 * 
	 * @return string
	 */
	static function scriptParamsCallback($key, $value) {
		return $value !== '' ? "$key $value " : "$key";
	}

	/**
	 * Callback for concatinating Python environment variables
	 * 
	 * @param string $key
	 * @param string $value
	 * 
	 * @return string
	 */
	static function scriptEnvsCallback($key, $value) {
		return "$key=\"$value\" ";
	}

	/**
	 * Check server requirements
	 * 
	 * @return array check results with errors list
	 */
	private function checkDepsRequirements() {
		$errors = [];
		if (!$this->isFunctionEnabled('exec')) {
			array_push($errors, '`exec` PHP function is not available.');
		}
		if (!$this->isPythonCompatible()) {
			array_push($errors, 'Python version is lower then 3.6.8 or not available');
		}
		return ['success' => count($errors) === 0, 'errors' => $errors];
	}

	/**
	 * @param string @listName
	 * 
	 * @return array installation results list
	 */
	public function installDependencies($listName = '') {
		$depsCheck = $this->checkDepsRequirements();
		if ($depsCheck['success']) {
			try {
				$pythonResult = $this->run('/install.py', [
					'--install' => $listName === '' ? 'required optional' : $listName,
				], false, ['PHP_PATH' => $this->getPhpInterpreter()]);
				return $this->parsePythonOutput($pythonResult);
			} catch (\Exception $e) {
				return [
					'success' => false,
					'message' => 'Some error while running the Python script',
				];
			}
		}
		return $depsCheck;
	}

	/**
	 * @return array list of uninstalled Python packages
	 */
	public function checkInstallation() {
		$depsCheck = $this->checkDepsRequirements();
		if ($depsCheck['success']) {
			try {
				$pythonResult = $this->run('/install.py', ['--check' => ''], false, ['PHP_PATH' => $this->getPhpInterpreter()]);
				return $this->parsePythonOutput($pythonResult);
			} catch (\Exception $e) {
				return [
					'success' => false,
					'message' => 'Some error while running the Python script',
				];
			}
		}
		return $depsCheck;
	}

	/**
	 * @param array $packagesList
	 * 
	 * @return array installed packages list after deleting
	 */
	public function deleteDependencies($packagesList = []) {
		$depsCheck = $this->checkDepsRequirements();
		if ($depsCheck['success']) {
			try {
				$pythonResult = $this->run('/install.py', ['--delete' => join(" ", $packagesList)], false, ['PHP_PATH' => $this->getPhpInterpreter()]);
				return $this->parsePythonOutput($pythonResult);
			} catch (\Exception $e) {
				return [
					'success' => false,
					'message' => 'Some error while running the Python script',
				];
			}
		}
		return $depsCheck;
	}

	/**
	 * @param array $packagesList
	 * 
	 * @return array installed packages list after deleting
	 */
	public function updateDependencies($packagesList = []) {
		$depsCheck = $this->checkDepsRequirements();
		if ($depsCheck['success']) {
			try {
				$pythonResult = $this->run('/install.py', ['--update' => join(" ", $packagesList)], false, ['PHP_PATH' => $this->getPhpInterpreter()]);
				return $this->parsePythonOutput($pythonResult);
			} catch (\Exception $e) {
				return [
					'success' => false,
					'message' => 'Some error while running the Python script',
				];
			}
		}
		return $depsCheck;
	}

	/**
	 * @return string|null
	 */
	public function getPythonVersion() {
		exec($this->pythonCommand . ' --version', $output, $result_code);
		if ($result_code === 0 && isset($output[0]) && preg_match_all("/\d{1}\.\d{1,2}(\.\d{1,2}){0,1}/s", $output[0], $matches)) {
			return isset($matches[0][0]) ? $matches[0][0] : null;
		}
		$this->logger->error('[' . self::class . '] Command executed with error result_code: ' . $result_code);
		return null;
	}

	/**
	 * Check if installed Python version compatible with MediaDC application
	 * 
	 * @return bool $isCompatible
	 */
	public function isPythonCompatible() {
		$pythonVersion = $this->getPythonVersion();
		if ($pythonVersion === null) {
			return false;
		}
		$pythonVersionDigits = explode(".", $pythonVersion);
		if ((int)$pythonVersionDigits[0] >= 3) {
			if ((int)$pythonVersionDigits[1] < 6) {
				return false;
			}
			if ((int)$pythonVersionDigits[1] > 6) {
				return true;
			} else if ((int)$pythonVersionDigits[1] === 6 && (int)$pythonVersionDigits[2] >= 8) {
				return true;
			}
			if ((int)$pythonVersionDigits[2] >= 0) {
				return true;
			}
		}
		return false;
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
	 * @param array $pythonResult
	 * 
	 * @return array
	 */
	private function parsePythonOutput($pythonResult) {
		$output = $pythonResult['output'];
		$result_code = $pythonResult['result_code'];
		if (count($output) > 0) {
			$result = [];
			foreach(json_decode($output[0]) as $result_key => $result_value) {
				$result[$result_key] = $result_value;
			}
			if (isset($result['required'])) {
				$required = (array)$result['required'];
			}
			if (isset($result['video_required'])) {
				$video_required = (array)$result['video_required'];
			}
			if (isset($result['optional'])) {
				$optional = (array)$result['optional'];
			}
			if (isset($result['boost'])) {
				$boost = (array)$result['boost'];
			}
			if (isset($result['available_algorithms'])) {
				$available_algorithms = $result['available_algorithms'];
			}
			if (isset($result['installed_list'])) {
				$installed_list = $result['installed_list'];
			}
			if (isset($result['errors'])) {
				$errors = $result['errors'];
			}
			if (isset($result['warnings'])) {
				$warnings = $result['warnings'];
			}
		}
		return [
			'success' => $result_code === 0,
			'installed' => count($required) === 0,
			'required' => $required,
			'video_required' => $video_required,
			'optional' => $optional,
			'boost' => $boost,
			'available_algorithms' => $available_algorithms,
			'installed_list' => $installed_list,
			'errors' => $errors,
			'warnings' => $warnings,
		];
	}

	private function getCustomAppsDirectory() {
		$apps_directory = $this->config->getSystemValue('apps_paths');
		if ($apps_directory !== "" && is_array($apps_directory) && count($apps_directory) > 0) {
			foreach ($apps_directory as $custom_apps_dir) {
				$mediadcDir = $custom_apps_dir['path'] . '/' . Application::APP_ID;
				if (file_exists($custom_apps_dir['path']) && is_dir($custom_apps_dir['path']) && $custom_apps_dir['writable'] 
					&& file_exists($mediadcDir) && is_dir($mediadcDir)) {
					return $custom_apps_dir['path'] . '/';
				}
			}
		}
		return getcwd() . '/apps/';
	}

	/**
	 * Check if a php function available
	 * 
	 * @param string $function_name
	 * 
	 * @return bool
	 */
	private function isFunctionEnabled($function_name) {
		if (!function_exists($function_name)) {
			return false;
		}
		/** @var IniGetWrapper $ini */
		$ini = \OC::$server->get(IniGetWrapper::class);
		$disabled = explode(',', $ini->get('disable_functions') ?: '');
		$disabled = array_map('trim', $disabled);
		if (in_array($function_name, $disabled)) {
			return false;
		}
		$disabled = explode(',', $ini->get('suhosin.executor.func.blacklist') ?: '');
		$disabled = array_map('trim', $disabled);
		if (in_array($function_name, $disabled)) {
			return false;
		}
		return true;
	}

}
