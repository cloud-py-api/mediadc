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

namespace OCA\MediaDC\Notification;

use OCA\MediaDC\AppInfo\Application;
use OCP\IURLGenerator;
use OCP\L10N\IFactory;
use OCP\Notification\INotification;
use OCP\Notification\INotifier;

class Notifier implements INotifier {
	/** @var IFactory */
	private $factory;

	/** @var IURLGenerator */
	private $url;

	public function __construct(IFactory $factory, IURLGenerator $urlGenerator) {
		$this->factory = $factory;
		$this->url = $urlGenerator;
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
				->setIcon($this->url->getAbsoluteURL($this->url->imagePath(Application::APP_ID, 'app-dark.svg')));

			$parameters = $notification->getSubjectParameters();
			if ($parameters['status'] === 'finished') {
				if (isset($parameters['name']) && $parameters['name'] !== '') {
					$message = $l->t('Task "%s" successfully finished.', [$parameters['name']]);
				} else {
					$message = $l->t('Task successfully finished.');
				}
				$filesMessage = $l->n('%n file', '%n files', $parameters['duplicates']);
				$message .= ' ' . $l->n('Found %n duplicate group', 'Found %n duplicate groups', $parameters['duplicate-groups']) . ' (' . $filesMessage . ')';
				$notification->setRichSubject($message);
			} else {
				$notification->setRichSubject($l->t('Task finished with status {status}', ['status' => $parameters['status']]));
			}
			$notification->setRichMessage($l->t('Task finished, check out results'));
			$notification->setParsedSubject($l->t('Task finished, check out results'));
			return $notification;
		}

		throw new \InvalidArgumentException();
	}
}
