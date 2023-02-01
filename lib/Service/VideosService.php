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

use OCP\Files\File;
use OCP\IPreview;
use OCP\Files\Folder;
use OCP\Files\IRootFolder;
use OCA\MediaDC\Db\Video;
use OCA\MediaDC\Db\VideoMapper;

class VideosService {
	/** @var string */
	private $userId;

	/** @var VideoMapper */
	private $mapper;

	/** @var IRootFolder */
	private $rootFolder;

	/** @var Folder */
	private $userFolder;

	/** @var IPreview */
	private $previewManager;

	public function __construct(
		?string $userId,
		IRootFolder $rootFolder,
		VideoMapper $mapper,
		IPreview $previewManager
	) {
		$this->rootFolder = $rootFolder;
		if ($userId !== null) {
			$this->userId = $userId;
			$this->userFolder = $rootFolder->getUserFolder($this->userId);
		}
		$this->previewManager = $previewManager;
		$this->mapper = $mapper;
	}

	public function get($id): Video {
		return $this->mapper->find($id);
	}

	public function getAllFileids(): array {
		return $this->mapper->findAllFileids();
	}

	public function canBeDeleted($fileid): bool {
		return $this->mapper->inFileCache(intval($fileid));
	}

	public function delete($video): Video {
		return $this->mapper->delete($video);
	}

	public function truncate(): int {
		return $this->mapper->truncate();
	}

	public function resolve(int $fileid, bool $resolved = true): int {
		return $this->mapper->resolve($fileid, $resolved);
	}

	/**
	 * @param string $userId
	 * @param int $limit
	 * @param int $offset
	 *
	 * @return array
	 */
	public function getResolvedVideos(string $userId = '', int $limit = null, int $offset = null): array {
		$result = $this->mapper->findAllResolvedByUser($userId, $limit, $offset);
		$result = array_map(function ($filecache_data) {
			/** @var File[] $node */
			$node = $this->userFolder->getById($filecache_data['fileid']);
			if (count($node) === 1) {
				/** @var File $file */
				$file = $node[0];
				return [
					'fileid' => $file->getId(),
					'fileowner' => $file->getOwner()->getUID(),
					'fileetag' => $file->getEtag(),
					'filename' => $file->getName(),
					'filemtype' => $file->getMimeType(),
					'filempart' => $file->getMimePart(),
					'relfilepath' => $file->getInternalPath(),
					'filepath' => $file->getPath(),
					'filesize' => $file->getSize(),
					'has_preview' => $this->previewManager->isAvailable($file)
				];
			}
			// Get file from root folder (trashbin)
			$rootNode = $this->rootFolder->getById($filecache_data['fileid']);
			if (count($rootNode) === 1 && ($rootNode[0] instanceof File)) {
				/** @var File $file */
				$file = $rootNode[0];
				return [
					'fileid' => $file->getId(),
					'fileowner' => $file->getOwner()->getUID(),
					'fileetag' => $file->getEtag(),
					'filename' => $file->getName(),
					'filemtype' => $file->getMimeType(),
					'filempart' => $file->getMimePart(),
					'relfilepath' => $file->getInternalPath(),
					'filepath' => $file->getPath(),
					'filesize' => $file->getSize(),
					'has_preview' => $this->previewManager->isAvailable($file)
				];
			}
			return [
				'fileid' => $filecache_data['fileid'],
				'filename' => $filecache_data['name'],
				'filepath' => $filecache_data['path'],
				'filesize' => $filecache_data['size'],
				'not_found' => true
			];
		}, $result);
		if (isset($offset)) {
			$total_items = count($this->mapper->findAllResolvedByUser($userId));
			$result = [
				'data' => $result,
				'page' => isset($offset) ? $offset / $limit : 0,
				'total_items' => $total_items,
				'total_pages' => ceil($total_items / $limit),
			];
			return $result;
		}
		return ['data' => $result];
	}
}
