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

use OCA\MediaDC\AppInfo\Application;
use OCA\MediaDC\Db\Setting;
use OCA\MediaDC\Db\SettingMapper;


class PythonService
{

	/** @var string */
	private $cwd;

	/** @var string */
	private $pythonCommand;

	/** @var UtilsService */
	private $utils;

	public function __construct(SettingMapper $settingMapper, UtilsService $utils)
	{
		$this->utils = $utils;
		/** @var Setting */
		$pythonCommand = $settingMapper->findByName('python_command');
		$this->pythonCommand = $pythonCommand->getValue();
		$this->cwd = $this->utils->getCustomAppsDirectory() . Application::APP_ID . '/lib/Service/python';
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
	public function run($scriptName, $scriptParams = [], $nonBlocking = false, $env = [])
	{
		if (count($scriptParams) > 0) {
			$params = array_map(function ($key, $value) {
				return $value !== '' ? "$key $value " : "$key";
			}, array_keys($scriptParams), array_values($scriptParams));
			$cmd = $this->pythonCommand . ' ' . $this->cwd . $scriptName . ' ' . join(' ', $params);
		} else {
			$cmd = $this->pythonCommand . ' ' .  $this->cwd . $scriptName;
		}
		if (count($env) > 0) {
			$envVariables = join(' ', array_map(function ($key, $value) {
				return "$key=\"$value\" ";
			}, array_keys($env), array_values($env)));
		} else {
			$envVariables = '';
		}
		if ($nonBlocking) {
			exec($envVariables . 'nohup ' . $cmd . ' > /dev/null 2>&1 &');
		} else {
			$errors = [];
			exec($envVariables . $cmd, $output, $result_code);
			if ($result_code !== 0) {
				if (count($output) > 0) {
					if (isset(json_decode($output[0], true)['errors'])) {
						$errors = json_decode($output[0], true)['errors'];
					} else {
						exec($envVariables . $cmd . ' 2>&1 1>/dev/null', $o_errors, $result_code);
						$errors = array_merge($output, ['', ''], $o_errors);
					}
				} else {
					exec($envVariables . $cmd . ' 2>&1 1>/dev/null', $o_errors, $result_code);
					$errors = $o_errors;
				}
			}
			return [
				'output' => $output,
				'result_code' => $result_code,
				'errors' => $errors,
			];
		}
	}

	/**
	 * Check server requirements
	 *
	 * @return array check results with errors list
	 */
	private function checkDepsRequirements()
	{
		$errors = [];
		if (!$this->utils->isFunctionEnabled('exec')) {
			array_push($errors, '`exec` PHP function is not available.');
		}
		$pythonCompatible = $this->utils->isPythonCompatible();
		if (!$pythonCompatible['success']) {
			array_push($errors, 'Python version is lower then 3.6.8 or not available (result_code:' . $pythonCompatible['result_code'] . ')');
		}
		return ['success' => count($errors) === 0, 'errors' => $errors];
	}

	/**
	 * @param string @listName
	 *
	 * @return array installation results list
	 */
	public function installDependencies($listName = '')
	{
		$depsCheck = $this->checkDepsRequirements();
		if ($depsCheck['success']) {
			try {
				$pythonResult = $this->run('/install.py', [
					'--install' => $listName === '' ? 'required optional' : $listName,
				], false, ['PHP_PATH' => $this->utils->getPhpInterpreter()]);
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
	public function checkInstallation()
	{
		$depsCheck = $this->checkDepsRequirements();
		if ($depsCheck['success']) {
			try {
				$pythonResult = $this->run('/install.py', ['--check' => ''], false, ['PHP_PATH' => $this->utils->getPhpInterpreter()]);
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
	public function deleteDependencies($packagesList = [])
	{
		$depsCheck = $this->checkDepsRequirements();
		if ($depsCheck['success']) {
			try {
				$pythonResult = $this->run('/install.py', ['--delete' => join(" ", $packagesList)], false, ['PHP_PATH' => $this->utils->getPhpInterpreter()]);
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
	public function updateDependencies($packagesList = [])
	{
		$depsCheck = $this->checkDepsRequirements();
		if ($depsCheck['success']) {
			try {
				$pythonResult = $this->run('/install.py', ['--update' => join(" ", $packagesList)], false, ['PHP_PATH' => $this->utils->getPhpInterpreter()]);
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
	 * @param array $pythonResult
	 *
	 * @return array
	 */
	private function parsePythonOutput($pythonResult)
	{
		$output = $pythonResult['output'];
		$result_code = $pythonResult['result_code'];

		$required = null;
		$video_required = null;
		$video_required = null;
		$optional = null;
		$boost = null;
		$available_algorithms = null;
		$installed_list = null;
		$warnings = null;
		$errors = null;

		if ($result_code === 0) {
			if (count($output) > 0) {
				$result = [];
				foreach (json_decode($output[0]) as $result_key => $result_value) {
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
		} else {
			if (isset($pythonResult['errors'])) {
				$errors = $pythonResult['errors'];
			}
		}

		return [
			'success' => $result_code === 0,
			'installed' => $result_code === 0 && count($required) === 0,
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
}
