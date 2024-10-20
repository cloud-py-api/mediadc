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

use OCP\Notification\IManager;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

use OCA\MediaDC\AppInfo\Application;
use OCA\MediaDC\Db\CollectorTask;
use OCA\MediaDC\Db\CollectorTaskDetailMapper;
use OCA\MediaDC\Db\CollectorTaskMapper;

class CollectorTaskNotificationCommand extends Command {
	public const ARGUMENT_TASK_ID = 'task_id';
	public const ARGUMENT_TASK_STATUS = 'status';

	public function __construct(
		private readonly CollectorTaskMapper $tasksMapper,
		private readonly CollectorTaskDetailMapper $tasksDetailsMapper,
		private readonly IManager $notificationManager,
	) {
		parent::__construct();
	}

	protected function configure(): void {
		$this->setName("mediadc:collector:tasks:notify");
		$this->setDescription("Sends task finished notification to the user");
		$this->addArgument(self::ARGUMENT_TASK_ID, InputArgument::REQUIRED);
		$this->addArgument(self::ARGUMENT_TASK_STATUS, InputArgument::REQUIRED);
	}

	protected function execute(InputInterface $input, OutputInterface $output): int {
		$taskId = $input->getArgument(self::ARGUMENT_TASK_ID);
		$status = $input->getArgument(self::ARGUMENT_TASK_STATUS);
		/** @var CollectorTask $collectorTask */
		$collectorTask = $this->tasksMapper->find(intval($taskId));
		$detailGroups = array_map(function ($d) {
			$d['files'] = explode(',', $d['files']);
			$d['filessizes'] = explode(',', $d['filessizes']);
			for ($i = 0; $i < count($d['files']); $i++) {
				$fileid = $d['files'][$i];
				$d['files'][$i] = [
					'fileid' => intval($fileid),
					'filesize' => intval($d['filessizes'][$i])
				];
			}
			unset($d['filessizes']);
			return $d;
		}, $this->tasksDetailsMapper->findAllByIdGroupped(intval($taskId)));
		$duplicates = 0;
		foreach ($detailGroups as $group) {
			$duplicates += count($group['files']);
		}
		$notification = $this->notificationManager->createNotification();

		$notification->setApp(Application::APP_ID)
			->setUser($collectorTask->getOwner())
			->setDateTime(new \DateTime())
			->setObject('mediadc-task', $taskId)
			->setSubject('mediadc-task-alert', [
				'status' => $status,
				'duplicate-groups' => count($detailGroups),
				'duplicates' => $duplicates,
				'name' => $collectorTask->getName(),
			]);
		$this->notificationManager->notify($notification);
		return 0;
	}
}
