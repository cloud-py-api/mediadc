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

namespace OCA\MediaDC\Command;

use Exception;
use OCA\MediaDC\Service\CleanupService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CollectorCleanupCommand extends Command {
	public function __construct(
		private readonly CleanupService $cleanupService,
	) {
		parent::__construct();
	}

	protected function configure(): void {
		$this->setName('mediadc:collector:cleanup');
		$this->setDescription('Executes Collector database cleanup mechanism');
	}

	protected function execute(InputInterface $input, OutputInterface $output): int {
		try {
			$result = $this->cleanupService->cleanup();
			$output->writeln('Collector cleanup result:');
			$output->writeln('Deleted photos: ' . $result['photosDeleted']);
			$output->writeln('Deleted videos: ' . $result['videosDeleted']);
			return 0;
		} catch (Exception $e) {
			$output->writeln('Collector cleanup failed.');
			$output->writeln($e->getMessage());
			$output->writeln($e->getTraceAsString());
			return 1;
		}
	}
}
