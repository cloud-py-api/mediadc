<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2022 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @copyright Copyright (c) 2022 Alexander Piskun <bigcat88@icloud.com>
 *
 * @author 2022 Andrey Borysenko <andrey18106x@gmail.com>
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

namespace OCA\MediaDC\Tests\Unit\Controller;

use OCP\AppFramework\Http\TemplateResponse;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject;

use OCA\MediaDC\Controller\PageController;

class PageControllerTest extends TestCase {
	/** @var PageController */
	private PageController $controller;

	/** @var \OCP\IRequest|MockObject */
	private $request;

	/** @var \OCP\EventDispatcher\IEventDispatcher|MockObject */
	private $eventDispatcher;

	public function setUp(): void {
		$this->request = $this->createMock(\OCP\IRequest::class);
		$this->eventDispatcher = $this->createMock(\OCP\EventDispatcher\IEventDispatcher::class);
		$this->controller = new PageController($this->request, $this->eventDispatcher);
	}

	public function testIndex(): void {
		$result = $this->controller->index();

		$this->assertEquals('main', $result->getTemplateName());
		$this->assertTrue($result instanceof TemplateResponse);
	}
}
