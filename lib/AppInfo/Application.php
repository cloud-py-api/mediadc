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

namespace OCA\MediaDC\AppInfo;

use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\Notification\IManager;

use OCA\MediaDC\Dashboard\RecentTasksWidget;

class Application extends App implements IBootstrap
{

	public const APP_ID = 'mediadc';

	/** @var IManager */
	private $notificationManager;

	public function __construct()
	{
		parent::__construct(self::APP_ID);

		$this->notificationManager = \OC::$server->get(\OCP\Notification\IManager::class);
		$eventDispatcher = \OC::$server->get(\OCP\EventDispatcher\IEventDispatcher::class);
		$eventDispatcher->addListener(\OCA\Files\Event\LoadAdditionalScriptsEvent::class, function () {
			\OCP\Util::addScript(self::APP_ID, Application::APP_ID . '-filesplugin');
		});
	}

	public function register(IRegistrationContext $context): void
	{
		$context->registerDashboardWidget(RecentTasksWidget::class);
		$this->notificationManager->registerNotifierService(\OCA\MediaDC\Notification\Notifier::class);
	}

	public function boot(IBootContext $context): void
	{
	}
}
