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

namespace OCA\MediaDC\Dashboard;

use OCP\IL10N;
use OCP\AppFramework\Services\IInitialState;
use OCP\Dashboard\IWidget;
use OCP\IURLGenerator;
use OCP\Util;

use OCA\MediaDC\AppInfo\Application;
use OCA\MediaDC\Service\CollectorService;


class RecentTasksWidget implements IWidget {

	/** @var IL10N */
	protected $il10n;

	/** @var IInitialState */

	/** @var IURLGenerator */
	private $urlGenerator;

	/** @var CollectorService */
	private $collectorService;

	public function __construct(IInitialState $initialState, IL10N $il10n,
								IURLGenerator $urlGenerator, CollectorService $collectorService)
	{
		$this->initialState = $initialState;
		$this->il10n = $il10n;
		$this->urlGenerator = $urlGenerator;
		$this->collectorService = $collectorService;
	}

	/**
	 * @return string Unique id that identifies the widget, e.g. the app id
	 * @since 20.0.0
	 */
	public function getId(): string {
		return 'mediadc-tasks';
	}

	/**
	 * @return string User facing title of the widget
	 * @since 20.0.0
	 */
	public function getTitle(): string {
		return $this->il10n->t('MediaDC Tasks');
	}

	/**
	 * @return int Initial order for widget sorting
	 *   in the range of 10-100, 0-9 are reserved for shipped apps
	 * @since 20.0.0
	 */
	public function getOrder(): int {
		return 10;
	}

	/**
	 * @return string css class that displays an icon next to the widget title
	 * @since 20.0.0
	 */
	public function getIconClass(): string {
		return 'icon-category-organization';
	}

	/**
	 * @return string|null The absolute url to the apps own view
	 * @since 20.0.0
	 */
	public function getUrl(): ?string {
		return $this->urlGenerator->linkToRouteAbsolute('mediadc.page.index');
	}

	/**
	 * Execute widget bootstrap code like loading scripts and providing initial state
	 */
	public function load(): void {
		Util::addScript(Application::APP_ID, Application::APP_ID . '-dashboard');
		$this->initialState->provideInitialState(
			'mediadc-recent-tasks',
			$this->collectorService->getUserRecentTasks(7)
		);
	}

}
