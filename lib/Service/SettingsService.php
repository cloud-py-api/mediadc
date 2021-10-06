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

use OCA\MediaDC\Db\Setting;
use OCA\MediaDC\Db\SettingMapper;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;


class SettingsService {

	/** @var SettingMapper */
	private $mapper;

	public function __construct(SettingMapper $settingMapper) {
		$this->mapper = $settingMapper;
	}

	/**
	 * @return array
	 */
	public function getSettings() {
		return $this->mapper->findAll();
	}

	/**
	 * @param int $id
	 * 
	 * @return Setting|array
	 */
	public function getSettingById($id) {
		try {
			return $this->mapper->find($id);
		} catch (DoesNotExistException | MultipleObjectsReturnedException $e) {
			return [
				'success' => false,
				'message' => 'Not found'
			];
		}
	}

	/**
	 * @param string $name
	 * 
	 * @return array
	 */
	public function getSettingByName($name) {
		try {
			return [
				'success' => true, 
				'setting' => $this->mapper->findByName($name)
			];
		} catch (DoesNotExistException | MultipleObjectsReturnedException $e) {
			return [
				'success' => false,
				'message' => 'Not found'
			];
		}
	}

	/**
	 * @param array|Setting $setting
	 * 
	 * @return array
	 */
	public function updateSetting($setting) {
		try {
			if ($setting instanceof Setting) {
				$updatedSetting = $this->mapper->update($setting);
				return [
					'success' => true,
					'updated_setting' => $updatedSetting,
				];
			}
			$updatedSetting = $this->mapper->update(new Setting([
				'id' => $setting['id'],
				'name' => $setting['name'],
				'value' => is_array($setting['value']) ? json_encode($setting['value']) : $setting['value'],
				'displayName' => $setting['display_name'],
				'description' => $setting['description'],
			]));
			return [
				'success' => true,
				'updated_setting' => $updatedSetting,
			];
		} catch (\Exception $e) {
			return [
				'success' => false,
				'message' => 'An error occured while updating setting',
				'setting' => $setting,
				'error' => $e->getMessage(),
			];
		}
	}

	/**
	 * @param array $settings
	 * 
	 * @return array
	 */
	public function updateSettings($settings) {
		$updated = [];
		foreach($settings as $setting) {
			array_push($updated, $this->mapper->update(new Setting([
				'id' => $setting['id'],
				'name' => $setting['name'],
				'value' => is_array($setting['value']) ? json_encode($setting['value']) : $setting['value'],
				'displayName' => $setting['display_name'],
				'description' => $setting['description'],
			])));
		}
		return [
			'success' => count($updated) === count($settings), 
			'updated_settings' => $updated,
		];
	}

}
