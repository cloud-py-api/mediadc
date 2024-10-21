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

use OCA\MediaDC\Db\Setting;
use OCA\MediaDC\Db\SettingMapper;

class UtilsService {
	public function __construct(
		private SettingMapper $settingMapper,
	) {
	}

	public function checkForSettingsUpdates($app_data) {
		$settings = $this->settingMapper->findAll();
		if (count($settings) > 0) {
			$this->updateSettingsTexts($app_data, $settings);
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
			$this->settingMapper->delete($setting);
		}
	}

	private function updateSettingsTexts(array $app_data, array $settings) {
		$newSettingsKeys = array_map(function ($setting) {
			return $setting['name'];
		}, $app_data['settings']);
		foreach ($settings as $setting) {
			if (in_array($setting->getName(), $newSettingsKeys)) {
				$newSetting = null;
				foreach ($app_data['settings'] as $s) {
					if ($s['name'] == $setting->getName()) {
						$newSetting = $s;
					}
				}
				if (isset($newSetting)) {
					if ($setting->getDescription() !== $newSetting['description']) {
						$setting->setDescription($newSetting['description']);
					}
					if ($setting->getDisplayName() !== $newSetting['displayName']) {
						$setting->setDisplayName($newSetting['displayName']);
					}
					$this->settingMapper->update($setting);
				}
			}
		}
	}
}
