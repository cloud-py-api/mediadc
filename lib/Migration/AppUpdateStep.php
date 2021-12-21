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

namespace OCA\MediaDC\Migration;

use OCP\Migration\IOutput;
use OCP\Migration\IRepairStep;

use OCA\MediaDC\Db\Setting;
use OCA\MediaDC\Service\PythonService;
use OCA\MediaDC\Service\SettingsService;
use Psr\Log\LoggerInterface;


class AppUpdateStep implements IRepairStep {

	/** @var PythonService */
	private $pythonService;

	/** @var SettingsService */
	private $settingsService;

	/** @var LoggerInterface */
	private $logger;

	public function __construct(PythonService $pythonService, SettingsService $settingsService,
								LoggerInterface $logger) {
		$this->pythonService = $pythonService;
		$this->settingsService = $settingsService;
		$this->logger = $logger;
	}

	public function getName(): string {
		return "Python dependencies update along with MediaDC app update";
	}

	public function run(IOutput $output) {
		$output->startProgress(1);
		if ($this->settingsService->getSettingByName('installed')['success']) {
			/** @var Setting */
			$installedSetting = $this->settingsService->getSettingByName('installed')['setting'];
			$installed = json_decode($installedSetting->getValue(), true);
			if (isset($installed['not_installed_list'])) {
				if (isset($installed['not_installed_list']['boost']) && count($installed['not_installed_list']['boost']) > 0) {
					$installResult = $this->pythonService->installDependencies();
				} else {
					$installResult = $this->pythonService->installDependencies('required optional boost');
				}
				if (isset($installResult['installed']) && $installResult['installed']) {
					$installed['not_installed_list'] = [
						'required' => $installResult['required'],
						'optional' => $installResult['optional'],
						'boost' => $installResult['boost'],
					];
					$installed['installed_list'] = $installResult['installed_list'];
					$installed['status'] = $installResult['installed'];
					$installed['video_required'] = $installResult['video_required'];
					$installed['available_algorithms'] = $installResult['available_algorithms'];
					$installedSetting->setValue(json_encode($installed));
					$this->settingsService->updateSetting($installedSetting);
					if (count($installResult['errors']) > 0) {
						$this->logger->warning('[AppUpdateStep] Python dependencies updated with some errors: ' . json_encode($installResult));
					}
				} else {
					$this->logger->error('[AppUpdateStep] Python dependencies updating error: ' . json_encode($installResult));
				}
			}
		}
		$output->advance(1);
		$output->finishProgress();
	}

}
