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

namespace OCA\MediaDC\Tests\Integration\Service;

use OCP\AppFramework\App;
use OCP\AppFramework\Http\JSONResponse;

use PHPUnit\Framework\TestCase;

use OCA\MediaDC\Controller\SettingsController;
use OCA\MediaDC\Db\Setting;
use OCA\MediaDC\Db\SettingMapper;

class SettingsControllerIntegrationTest extends TestCase {
	/** @var SettingsController */
	private $controller;

	/** @var string */
	private $userId = 'admin';

	/** @var SettingsMapper */
	private $settingMapper;

	public function setUp(): void {
		$app = new App('mediadc');
		$container = $app->getContainer();

		$container->registerService('userId', function () {
			return $this->userId;
		});

		$container->registerService(\OCP\IRequest::class, function () {
			return $this->createMock(\OCP\IRequest::class);
		});

		$container->registerService(\OCA\MediaDC\Service\UtilsService::class, function () {
			return $this->createMock(\OCA\MediaDC\Service\UtilsService::class);
		});

		$this->controller = $container->get(SettingsController::class);
		$this->settingMapper = $container->get(SettingMapper::class);
	}

	public function testUpdateSetting(): void {
		$setting = new Setting();
		$setting->setName('old_name');
		$setting->setValue(json_encode('old_value'));
		$setting->setDisplayName('old_display_name');
		$setting->setDescription('old_description');
		$id = $this->settingMapper->insert($setting)->getId();

		$updatedSetting = Setting::fromRow([
			'id' => $id,
			'name' => 'old_name',
			'display_name' => 'old_display_name',
			'description' => 'old_description'
		]);
		$updatedSetting->setValue(json_encode('updated_value'));

		$result = $this->controller->updateSetting($updatedSetting);

		$this->assertTrue($result instanceof JSONResponse);
		$this->assertTrue(isset($result->getData()['success']), 'Should be successfully updated');
		$this->assertEquals($updatedSetting->jsonSerialize(), $result->getData()['updated_setting']->jsonSerialize());
		$this->settingMapper->delete($result->getData()['updated_setting']);
	}
}
