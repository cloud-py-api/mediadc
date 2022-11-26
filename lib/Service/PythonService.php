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
use OCP\IConfig;

class PythonService {
	/** @var string */
	private $cwd;

	/** @var string */
	private $pythonCommand;

	public function __construct(
		SettingMapper $settingMapper,
		IConfig $config
	) {
		/** @var Setting $pythonCommand */
		$pythonCommand = $settingMapper->findByName('python_command');
		$this->pythonCommand = $pythonCommand->getValue();
		$ncInstanceId = $config->getSystemValue('instanceid');
		$ncDataFolder = $config->getSystemValue('datadirectory');
		$this->cwd = $ncDataFolder . '/appdata_' . $ncInstanceId . '/' . Application::APP_ID . '/';
	}

	/**
	 * Runs Python script with given script relative path and script params
	 *
	 * @param string $scriptName relative path to the Python script
	 * @param array $scriptParams params to script in array (`['-param1' => value1, '--param2' => value2]`)
	 * @param boolean $nonBlocking flag that determines how to run Python script.
	 * @param array $env env variables for python script
	 * @param bool $binary flag to determine python binaries run or python script
	 *
	 * @return array|void
	 *
	 * If `$nonBlocking = true` - function will not waiting for Python script output and return `void`.
	 * If `$nonBlocking = false` - function will return array with the `result_code`
	 * and `output` of the script after Python script finish executing.
	 */
	public function run($scriptName, $scriptParams = [], $nonBlocking = false, $env = [], $binary = false) {
		if (count($scriptParams) > 0) {
			$params = array_map(function ($key, $value) {
				return $value !== '' ? "$key $value " : "$key";
			}, array_keys($scriptParams), array_values($scriptParams));
			$cmd = $this->cwd . $scriptName . ' ' . join(' ', $params);
		} else {
			$cmd = $this->cwd . $scriptName;
		}
		if (count($env) > 0) {
			$envVariables = join(' ', array_map(function ($key, $value) {
				return "$key=\"$value\" ";
			}, array_keys($env), array_values($env)));
		} else {
			$envVariables = '';
		}
		if (!$binary) {
			$cmd = $this->pythonCommand . ' ' . $cmd;
		}
		if ($nonBlocking) {
			$logFile = $this->cwd . 'logs/' . date('d-m-Y_H:m:s', time()) . '.log';
			exec($envVariables . 'nohup ' . $cmd . ' > ' . $logFile . ' 2>' . $logFile . ' &');
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
				'cwd' => $this->cwd,
				'cmd' => $envVariables . $cmd
			];
		}
	}
}
