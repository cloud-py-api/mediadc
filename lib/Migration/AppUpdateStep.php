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

use OCA\MediaDC\Migration\data\AppInitialData;
use OCA\MediaDC\Service\AppDataService;
use OCA\MediaDC\Service\UtilsService;

class AppUpdateStep implements IRepairStep {
	/** @var AppInitialData */
	private $appInitialData;

	/** @var UtilsService */
	private $utils;

	/** @var AppDataService */
	private $appDataService;

	public function __construct(
		AppInitialData $appInitialData,
		UtilsService $utils,
		AppDataService $appDataService
	) {
		$this->appInitialData = $appInitialData;
		$this->utils = $utils;
		$this->appDataService = $appDataService;
	}

	public function getName(): string {
		return "Update settings and binaries along with MediaDC";
	}

	public function run(IOutput $output) {
		$output->startProgress(2);
		$output->advance(1, 'Sync settings changes');
		$this->utils->checkForSettingsUpdates($this->appInitialData->getAppInitialData());
		$output->advance(2, 'Update binaries');
		$this->appDataService->createAppDataFolder('binaries');
		$this->appDataService->createAppDataFolder('logs');
		$this->appDataService->downloadPythonBinary(true);
		$output->finishProgress();
	}
}
