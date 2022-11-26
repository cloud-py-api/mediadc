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

namespace OCA\MediaDC\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

use OCA\MediaDC\Service\AppDataService;
use OCA\MediaDC\Service\UtilsService;

class AppDataFolderCommand extends Command {
	public const ARGUMENT_APP_DATA_ACTION = 'action';
	public const ARGUMENT_APP_DATA_NAME = 'name';

	/** @var AppDataService */
	private $appDataService;

	/** @var UtilsService */
	private $utils;

	public function __construct(AppDataService $appDataService, UtilsService $utils) {
		parent::__construct();

		$this->appDataService = $appDataService;
		$this->utils = $utils;
	}

	protected function configure(): void {
		$this->setName("mediadc:appdata");
		$this->setDescription("AppData folder actions command");
		$this->addArgument(self::ARGUMENT_APP_DATA_ACTION, InputArgument::REQUIRED);
		$this->addArgument(self::ARGUMENT_APP_DATA_NAME, InputArgument::REQUIRED);
	}

	protected function execute(InputInterface $input, OutputInterface $output): int {
		$output->writeln(json_encode($this->utils->isMusliLinux()));
		$output->writeln(json_encode($this->utils->getOsArch()));
		$output->writeln(json_encode($this->appDataService->getBinaryName()));
		$output->writeln(json_encode($this->appDataService->downloadPythonBinary()));
		$action = $input->getArgument(self::ARGUMENT_APP_DATA_ACTION);
		$name = $input->getArgument(self::ARGUMENT_APP_DATA_NAME);
		if ($action === 'create') {
			$result = $this->appDataService->createAppDataFolder($name);
		} elseif ($action === 'get') {
			$result = $this->appDataService->getAppDataFolder($name);
		}
		$output->writeln('[AppData - ' . $action . '] Result: ' . json_encode($result));
		return 0;
	}
}
