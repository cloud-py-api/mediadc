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

namespace OCA\MediaDC\Settings;

use OCA\MediaDC\AppInfo\Application;
use OCA\MediaDC\Db\SettingMapper;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\Settings\ISettings;

class AdminSettings implements ISettings {
	public function __construct(
		private readonly IInitialState $initialState,
		private readonly SettingMapper $settingMapper
	) {
	}

	/**
	 * @return TemplateResponse
	 */
	public function getForm() {
		$settings = $this->settingMapper->findAll();
		$this->initialState->provideInitialState('settings', $settings);

		return new TemplateResponse(Application::APP_ID, 'admin');
	}

	public function getSection() {
		return Application::APP_ID;
	}

	public function getPriority() {
		return 50;
	}
}
