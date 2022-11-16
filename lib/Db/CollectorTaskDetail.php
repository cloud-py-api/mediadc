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

namespace OCA\MediaDC\Db;

use JsonSerializable;
use OCP\AppFramework\Db\Entity;


/**
 * Class CollectorTaskDetail
 *
 * @package OCA\MediaDC\Db
 *
 * @method int getTaskId()
 * @method int getGroupId()
 * @method int getFileid()
 * @method void setTaskId(int $taskId)
 * @method void setGroupId(int $groupId)
 * @method void setFileid(int $fileid)
 */
class CollectorTaskDetail extends Entity implements JsonSerializable
{

	protected $taskId;
	protected $groupId;
	protected $fileid;

	/**
	 * @param array $params
	 */
	public function __construct(array $params = [])
	{
		if (isset($params['id'])) {
			$this->setId($params['id']);
		}
		if (isset($params['taskId'])) {
			$this->setTaskId($params['taskId']);
		}
		if (isset($params['groupId'])) {
			$this->setGroupId($params['groupId']);
		}
		if (isset($params['fileid'])) {
			$this->setFileid($params['filid']);
		}
	}

	public function jsonSerialize(): array
	{
		return [
			'id' => $this->getId(),
			'task_id' => $this->getTaskId(),
			'group_id' => $this->getGroupId(),
			'fileid' => $this->getFileid(),
		];
	}
}
