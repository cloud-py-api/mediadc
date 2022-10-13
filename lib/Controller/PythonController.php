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

namespace OCA\MediaDC\Controller;

use OCP\IRequest;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;

use OCA\MediaDC\AppInfo\Application;
use OCA\MediaDC\Service\PythonService;


class PythonController extends Controller
{

	/** @var PythonService */
	private $service;

	public function __construct(IRequest $request, PythonService $service)
	{
		parent::__construct(Application::APP_ID, $request);

		$this->service = $service;
	}

	/**
	 * @NoCSRFRequired
	 *
	 * @return JSONResponse
	 */
	public function check()
	{
		return new JSONResponse($this->service->checkInstallation(), Http::STATUS_OK);
	}

	/**
	 * @NoCSRFRequired
	 *
	 * @return JSONResponse
	 */
	public function install()
	{
		return new JSONResponse($this->service->installDependencies(), Http::STATUS_OK);
	}

	/**
	 * @NoCSRFRequired
	 *
	 * @param string $listName python dependecies list name
	 *
	 * @return JSONResponse
	 */
	public function installDepsList($listName = '')
	{
		return new JSONResponse($this->service->installDependencies($listName), Http::STATUS_OK);
	}

	/**
	 * @NoCSRFRequired
	 *
	 * @param array $packagesList python packages names list
	 *
	 * @return JSONResponse
	 */
	public function updateDepsList($packagesList = [])
	{
		return new JSONResponse($this->service->updateDependencies($packagesList), Http::STATUS_OK);
	}

	/**
	 * @NoCSRFRequired
	 *
	 * @param array $packagesList python packages names list
	 *
	 * @return JSONResponse
	 */
	public function deleteDepsList(array $packagesList = [])
	{
		return new JSONResponse($this->service->deleteDependencies($packagesList), Http::STATUS_OK);
	}
}
