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

namespace OCA\MediaDC\Command;

use OCA\MediaDC\AppInfo\Application;
use OCA\MediaDC\Db\CollectorTask;
use OCA\MediaDC\Db\CollectorTaskDetail;
use OCA\MediaDC\Db\CollectorTaskDetailMapper;
use OCA\MediaDC\Service\CollectorService;
use OCP\IURLGenerator;
use OCP\Notification\IManager;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;


class CollectorTaskNotificationCommand extends Command {

	public const ARGUMENT_TASK_ID = 'task_id';
	public const ARGUMENT_TASK_STATUS = 'status';

	/** @var CollectorService */
	private $collectorService;

	/** @var IManager */
	private $notificationManager;

	/** @var CollectorTaskDetailMapper */
	private $taskDetailsMapper;

	public function __construct(CollectorService $collectorService,
								CollectorTaskDetailMapper $taskDetailsMapper,
								IManager $notificationManager, IURLGenerator $urlGenerator) {
		parent::__construct();

		$this->collectorService = $collectorService;
		$this->taskDetailsMapper = $taskDetailsMapper;
		$this->notificationManager = $notificationManager;
		$this->url = $urlGenerator;
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
		/** @var CollectorTask */
		$collectorTask = $this->collectorService->get(intval($taskId));
		$collectorDetails = $this->taskDetailsMapper->findAllById(intval($taskId));
		$duplicates = 0;
		/** @var CollectorTaskDetail */
		foreach ($collectorDetails as $detail) {
			$duplicates += count(json_decode($detail->getGroupFilesIds()));
		}
		$notification = $this->notificationManager->createNotification();

		$notification->setApp(Application::APP_ID)
			->setUser($collectorTask->getOwner())
			->setDateTime(new \DateTime())
			->setObject('mediadc-task', $taskId)
			->setSubject('mediadc-task-alert', [
				'status' => $status,
				'duplicate-groups' => count($collectorDetails),
				'duplicates' => $duplicates,
			]);
		$this->notificationManager->notify($notification);
		return 0;
	}

}
