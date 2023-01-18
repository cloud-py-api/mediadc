<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2022-2023 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @copyright Copyright (c) 2022-2023 Alexander Piskun <bigcat88@icloud.com>
 *
 * @author 2022-2023 Andrey Borysenko <andrey18106x@gmail.com>
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

namespace OCA\MediaDC\Tests\Unit\Service;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject;

use OCP\Files\NotFoundException;
use OCP\Files\NotPermittedException;

use OCA\MediaDC\Service\AppDataService;

class AppDataServiceTest extends TestCase {
	/** @var AppDataService */
	private $appDataService;

	/** @var \OCP\Files\IAppData|MockObject */
	private $iAppData;

	/** @var \OCP\IConfig|MockObject */
	private $iConfig;

	public function setUp(): void {
		$this->iAppData = $this->createMock(\OCP\Files\IAppData::class);
		$this->iConfig = $this->createMock(\OCP\IConfig::class);
		$this->appDataService = new AppDataService(
			$this->iAppData,
			$this->iConfig
		);
	}

	/**
	 * @dataProvider provideFolderNamesData
	 */
	public function testCreateAppDataFolder(string $folderName, bool $expected): void {
		$result = $this->appDataService->createAppDataFolder($folderName);
		$this->assertEquals($expected, $result);
	}

	public function provideFolderNamesData() {
		return [
			'should create binaries app data folder' => ['binaries', true],
			'should create logs app data folder' => ['logs', true]
		];
	}

	/**
	 * @dataProvider provideFolderNamesData
	 */
	public function testCreateAppDataFolderNotPermitted(string $folderName): void {
		$this->iAppData->expects($this->any())
			->method('newFolder')
			->with($folderName)
			->will($this->throwException(new NotPermittedException()));
		$result = $this->appDataService->createAppDataFolder($folderName);
		$this->assertFalse($result);
	}

	/**
	 * @dataProvider provideGetFolderNamesData
	 */
	public function testGetAppDataFolder(string $folderName, array $expected): void {
		$result = $this->appDataService->getAppDataFolder($folderName);
		$this->assertEquals($result['success'], $expected['success']);
	}

	public function provideGetFolderNamesData() {
		return [
			'should return binaries app data folder' => ['binaries', ['success' => false]],
			'should return logs app data folder' => ['logs', ['success' => false]]
		];
	}

	/**
	 * @dataProvider provideGetFolderNamesData
	 */
	public function testGetAppDataFolderNotFound(string $folderName): void {
		$this->iAppData->expects($this->any())
			->method('getFolder')
			->with($folderName)
			->will($this->throwException(new NotFoundException()));
		$result = $this->appDataService->getAppDataFolder($folderName);
		$this->assertFalse($result['success']);
	}
}
