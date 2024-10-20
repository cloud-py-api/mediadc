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

use OCP\Files\SimpleFS\ISimpleFolder;
use Psr\Log\LoggerInterface;

class CleanupService {
	public function __construct(
		private readonly AppDataService $appDataService,
		private readonly PhotosService $photosService,
		private readonly VideosService $videosService,
		private readonly LoggerInterface $logger,
	) {
	}

	public function deleteAppLogs() {
		$appDataLogsFolder = $this->appDataService->getAppDataFolder('logs');
		if (isset($appDataLogsFolder['folder'])
			&& $appDataLogsFolder['folder'] instanceof ISimpleFolder) {
			$appDataLogsFolder['folder']->delete();
		}
	}

	/**
	 * Clean up Collector job (remove deleted photos&vidoes hashes from database)
	 *
	 * @return array Collector cleanup job results
	 */
	public function cleanup(): array {
		$this->logger->info('[' . self::class . '] cleanup job executed.');
		$photos = $this->photosService->getAllFileids();
		$photosDeleted = 0;
		foreach ($photos as $photo) {
			if ($this->photosService->canBeDeleted($photo->getFileid())) {
				$this->photosService->delete($photo);
				$photosDeleted += 1;
			}
		}
		$videosDeleted = 0;
		$videos = $this->videosService->getAllFileids();
		foreach ($videos as $video) {
			if ($this->videosService->canBeDeleted($video->getFileid())) {
				$this->videosService->delete($video);
				$videosDeleted += 1;
			}
		}
		$result = [
			'photosDeleted' => $photosDeleted,
			'videosDeleted' => $videosDeleted
		];
		$this->logger->info('[' . self::class . '] cleanup job finished. Results: '
			. json_encode($result));
		return $result;
	}
}
