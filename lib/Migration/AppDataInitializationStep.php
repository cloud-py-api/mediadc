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

namespace OCA\MediaDC\Migration;

use OCP\Migration\IOutput;
use OCP\Migration\IRepairStep;

use OCA\MediaDC\Db\Setting;
use OCA\MediaDC\Db\SettingMapper;
use OCA\MediaDC\Migration\data\AppInitialData;


class AppDataInitializationStep implements IRepairStep
{

	/** @var SettingMapper */
	private $settingMapper;

	/** @var AppInitialData */
	private $appInitialData;

	public function __construct(SettingMapper $settingMapper, AppInitialData $appInitialData)
	{
		$this->settingMapper = $settingMapper;
		$this->appInitialData = $appInitialData;
	}

	public function getName(): string
	{
		return "Initializing MediaDC static tables data";
	}

	public function run(IOutput $output)
	{
		$output->startProgress(2);
		$app_data = $this->appInitialData->getAppInitialData();

		if (count($this->settingMapper->findAll()) === 0 && isset($app_data['settings'])) {
			if (isset($app_data['settings'])) {
				foreach ($app_data['settings'] as $setting) {
					$this->settingMapper->insert(new Setting([
						'name' => $setting['name'],
						'value' => is_array($setting['value']) ? json_encode($setting['value']) : str_replace('\\', '', json_encode($setting['value'])),
						'displayName' => $setting['displayName'],
						'description' => $setting['description']
					]));
				}
			}
		}
		$output->advance(1);

		$this->checkForDataUpdates($app_data);
		$output->advance(2);

		$output->finishProgress();
	}

	private function checkForDataUpdates($app_data)
	{
		$settings = $this->settingMapper->findAll();
		if (count($settings) > 0 && count($app_data['settings']) > count($settings)) {
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
						'value' => is_array($setting['value']) ? json_encode($setting['value']) : str_replace('\\', '', json_encode($setting['value'])),
						'displayName' => $setting['displayName'],
						'description' => $setting['description']
					]));
				}
			}
		} else if (count($settings) > 0 && count($app_data['settings']) < count($settings)) {
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
}
