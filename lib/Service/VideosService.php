<?php

declare(strict_types=1);

/**
 * @copyright 2021 Andrey Borysenko <andrey18106x@gmail.com>
 * @copyright 2021 Alexander Piskun <bigcat88@icloud.com>
 *
 * @author 2021 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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
 */

namespace OCA\MediaDC\Service;

use OCA\MediaDC\Db\Video;
use OCA\MediaDC\Db\VideoMapper;


class VideosService {

	/** @var VideoMapper */
	private $mapper;

	public function __construct(VideoMapper $mapper)
	{
		$this->mapper = $mapper;
	}

	public function get($id): Video {
		return $this->mapper->find($id);
	}

	public function getAll(): array {
		return $this->mapper->findAll();
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

}
