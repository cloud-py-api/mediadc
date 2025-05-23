<?php

declare(strict_types=1);

/**
 * @copyright Сopyright (c) 2021-2022 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @copyright Сopyright (c) 2021-2022 Alexander Piskun <bigcat88@icloud.com>
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

use OCA\MediaDC\Db\Photo;
use OCA\MediaDC\Db\PhotoMapper;
use OCP\Files\File;
use OCP\Files\Folder;

use OCP\Files\IRootFolder;
use OCP\IPreview;

class PhotosService {
	private string $userId;
	private Folder $userFolder;

	public function __construct(
		?string $userId,
		private readonly IRootFolder $rootFolder,
		private readonly PhotoMapper $mapper,
		private readonly IPreview $previewManager,
	) {
		if ($userId !== null) {
			$this->userId = $userId;
			$this->userFolder = $this->rootFolder->getUserFolder($this->userId);
		}
	}

	public function get($id): Photo {
		return $this->mapper->find($id);
	}

	public function getAllFileids(): array {
		return $this->mapper->findAllFileids();
	}

	public function canBeDeleted($fileid): bool {
		return $this->mapper->inFileCache(intval($fileid));
	}

	public function delete($photo): Photo {
		return $this->mapper->delete($photo);
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
	public function getResolvedPhotos(string $userId = '', ?int $limit = null, ?int $offset = null): array {
		$result = $this->mapper->findAllResolvedByUser($userId, $limit, $offset);
		$result = array_map(function ($filecache_data) {
			/** @var File $file */
			$file = null;
			/** @var File[] $node */
			$node = $this->userFolder->getById($filecache_data['fileid']);
			if (count($node) === 1 && ($node[0] instanceof File)) {
				/** @var File $file */
				$file = $node[0];
			} else {
				// Get file from root folder (trashbin)
				/** @var File[] $rootNode */
				$rootNode = $this->rootFolder->getById($filecache_data['fileid']);
				if (count($rootNode) === 1 && ($rootNode[0] instanceof File)) {
					/** @var File $file */
					$file = $rootNode[0];
				}
			}
			if (isset($file) && $file instanceof File) {
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

	public function cleanupResolved(string $userId): int {
		$resolvedFileIdsByUser = array_map(function (array $filecache_data) {
			return $filecache_data['fileid'];
		}, $this->mapper->findAllResolvedByUser($userId));
		return $this->mapper->cleanupResolved($resolvedFileIdsByUser);
	}
}
