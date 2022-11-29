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

namespace OCA\MediaDC\Tests\Unit\Service;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject;

use OCA\MediaDC\Service\AppDataService;

class AppDataServiceTest extends TestCase {
	/** @var AppDataService */
	private $appDataService;

	/** @var \OCP\Files\IAppData|MockObject */
	private $iAppData;

	/** @var \OCP\IConfig|MockObject */
	private $iConfig;

	/** @var \OCA\MediaDC\Service\UtilsService|MockObject */
	private $utils;

	/** @var \OCA\MediaDC\Service\PythonService|MockObject */
	private $pythonService;

	public function setUp(): void {
		$this->iAppData = $this->createMock(\OCP\Files\IAppData::class);
		$this->iConfig = $this->createMock(\OCP\IConfig::class);
		$this->utils = $this->createMock(\OCA\MediaDC\Service\UtilsService::class);
		$this->pythonService = $this->createMock(\OCA\MediaDC\Service\PythonService::class);
		$this->appDataService = new AppDataService(
			$this->iAppData,
			$this->iConfig,
			$this->utils,
			$this->pythonService
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
			'should create logs app data folder' => ['logs', true],
			'should create python app data folder' => ['python', true]
		];
	}
}
