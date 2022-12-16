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

namespace OCA\MediaDC\Tests\Unit\Controller;

use OCP\AppFramework\Http\JSONResponse;
use OCA\MediaDC\Controller\SettingsController;
use OCA\MediaDC\Service\PhotosService;
use OCA\MediaDC\Service\SettingsService;
use OCA\MediaDC\Service\UtilsService;
use OCA\MediaDC\Service\VideosService;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject;

class SettingsControllerTest extends TestCase {
	/** @var SettingsController|MockObject */
	private $controller;

	/** @var SettingsService|MockObject */
	private $settingsService;

	/** @var PhotosService|MockObject */
	private $photosService;

	/** @var VideosService|MockObject */
	private $videosService;

	/** @var UtilsService|MockObject */
	private $utilsService;

	public function setUp(): void {
		/** @var \OCP\IRequest|\PHPUnit\Framework\MockObject $request */
		$request = $this->getMockBuilder(\OCP\IRequest::class)->getMock();
		$this->settingsService = $this->createMock(\OCA\MediaDC\Service\SettingsService::class);
		$this->photosService = $this->createMock(\OCA\MediaDC\Service\PhotosService::class);
		$this->videosService = $this->createMock(\OCA\MediaDC\Service\VideosService::class);
		$this->utilsService = $this->createMock(\OCA\MediaDC\Service\UtilsService::class);
		$this->controller = new SettingsController($request, $this->settingsService, $this->photosService, $this->videosService, $this->utilsService);
	}

	public function testIndex(): void {
		$this->settingsService->expects($this->once())
			->method('getSettings')
			->will($this->returnValue([
				['name' => 'setting1'],
				['name' => 'setting2'],
				['name' => 'setting3'],
			]));
		$result = $this->controller->index();

		$this->assertTrue($result instanceof JSONResponse);
		$this->assertCount(3, $result->getData());
	}
}
