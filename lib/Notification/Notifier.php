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

namespace OCA\MediaDC\Notification;

use OCA\MediaDC\AppInfo\Application;
use OCP\IURLGenerator;
use OCP\L10N\IFactory;
use OCP\Notification\INotification;
use OCP\Notification\INotifier;
use Psr\Log\LoggerInterface;


class Notifier implements INotifier {

	/** @var IFactory */
	private $factory;

	/** @var IURLGenerator */
	private $url;

	public function __construct(IFactory $factory, IURLGenerator $urlGenerator,
								LoggerInterface $logger) {
		$this->factory = $factory;
		$this->url = $urlGenerator;
		$this->logger = $logger;
	}

	public function getID(): string {
		return Application::APP_ID;
	}

	public function getName(): string {
		return $this->factory->get(Application::APP_ID)->t('Task finished alert');
	}

	public function prepare(INotification $notification, string $languageCode): INotification {
		if ($notification->getApp() !== Application::APP_ID) {
			throw new \InvalidArgumentException();
		}

		$l = $this->factory->get(Application::APP_ID, $languageCode);

		if ($notification->getSubject() === 'mediadc-task-alert') {
			$notification
				->setLink($this->url->linkToRouteAbsolute('mediadc.page.index') . 'tasks/' . $notification->getObjectId())
				->setIcon($this->url->getAbsoluteURL($this->url->imagePath(Application::APP_ID, 'settings.svg')));

			$parameters = $notification->getSubjectParameters();
			if ($parameters['status'] === 'finished') {
				$notification->setRichSubject($l->t('Task successfully finished, found ' . $parameters['duplicate-groups'] . ' duplicate group(s) (' . $parameters['duplicates'] .  ' file(s))'));
			} else {
				$notification->setRichSubject($l->t('Task finished with status "' . $parameters['status'] . '".'));
			}
			$notification->setRichMessage($l->t('Task finished, check out results'));
			$notification->setParsedSubject($l->t('Task finished, check out results'));
			return $notification;
		}

		throw new \InvalidArgumentException();
	}

}
