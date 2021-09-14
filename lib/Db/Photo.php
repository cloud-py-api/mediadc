<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2021 Andrey Borysenko <andrey18106x@gmail.com>
 * 
 * @copyright Copyright (c) 2021 Alexander Piskun <bigcat88@icloud.com>
 * 
 * @author 2021 Andrey Borysenko <andrey18106x@gmail.com>
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

namespace OCA\MediaDC\Db;

use JsonSerializable;
use OCP\AppFramework\Db\Entity;


/**
 * Class MediaDCPhoto
 *
 * @package OCA\MediaDC\Db
 *
 * @method int getFileid()
 * @method string getHash()
 * @method int getMtime()
 * @method int getSkipped()
 * @method void setFileid(int $fileid)
 * @method void setHash(string $hash)
 * @method void setMtime(int $mtime)
 * @method void setSkipped(int $skipped)
 */
class Photo extends Entity implements JsonSerializable {

	protected $fileid;
	protected $hash;
	protected $mtime;
	protected $skipped;

	/**
	 * @param array $params
	 */
	public function __construct(array $params = []) {
		if (isset($params['id'])) {
			$this->setId($params['id']);
		}
		if (isset($params['fileid'])) {
			$this->setFileid($params['fileid']);
		}
		if (isset($params['hash'])) {
			$this->setHash($params['hash']);
		}
		if (isset($params['mtime'])) {
			$this->setMtime($params['mtime']);
		}
		if (isset($params['skipped'])) {
			$this->setSkipped($params['skipped']);
		}
	}

	public function jsonSerialize(): array
	{
		return [
			'id' => $this->getId(),
			'fileid' => $this->getFileid(),
			'hash' => $this->getHash(),
			'mtime' => $this->getMtime(),
			'skipped' => $this->getSkipped(),
		];
	}
}
