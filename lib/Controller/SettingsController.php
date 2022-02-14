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

namespace OCA\MediaDC\Controller;

use OCP\IRequest;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;

use OCA\MediaDC\AppInfo\Application;
use OCA\MediaDC\Service\PhotosService;
use OCA\MediaDC\Service\SettingsService;
use OCA\MediaDC\Service\UtilsService;
use OCA\MediaDC\Service\VideosService;


class SettingsController extends Controller {

	/** @var SettingsService */
	private $service;

	/** @var PhotosService */
	private $photosService;

	/** @var VideosService */
	private $videosService;

	/** @var UtilsService */
	private $utils;

	public function __construct(IRequest $request, SettingsService $service,
								PhotosService $photosService, VideosService $videosService,
								UtilsService $utils) {
		parent::__construct(Application::APP_ID, $request);

		$this->service = $service;
		$this->photosService = $photosService;
		$this->videosService = $videosService;
		$this->utils = $utils;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 * 
	 * @return JSONResponse array of all settings
	 */
	public function index() {
		return new JSONResponse($this->service->getSettings(), Http::STATUS_OK);
	}

	/**
	 * @NoCSRFRequired
	 * 
	 * @param array $settings
	 * 
	 * @return JSONResponse
	 */
	public function update($settings) {
		return new JSONResponse($this->service->updateSettings($settings), Http::STATUS_OK);
	}

	/**
	 * @NoCSRFRequired
	 * 
	 * @param array $setting
	 * 
	 * @return JSONResponse
	 */
	public function updateSetting($setting) {
		return new JSONResponse($this->service->updateSetting($setting), Http::STATUS_OK);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param int $id
	 */
	public function getSettingById($id): JSONResponse {
		return new JSONResponse($this->service->getSettingById($id), Http::STATUS_OK);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param string $name
	 */
	public function getSettingByName($name): JSONResponse {
		return new JSONResponse($this->service->getSettingByName($name), Http::STATUS_OK);
	}

	/**
	 * @NoCSRFRequired
	 *
	 * @param string $name table name
	 */
	public function truncate($name): JSONResponse {
		if ($name === 'photos') {
			return new JSONResponse(['rows_deleted' => $this->photosService->truncate()], Http::STATUS_OK);
		}
		if ($name === 'videos') {
			return new JSONResponse(['rows_deleted' => $this->videosService->truncate()], Http::STATUS_OK);
		}
		if ($name === 'all') {
			return new JSONResponse([
				'photos' => $this->photosService->truncate(),
				'videos' => $this->videosService->truncate()
			], Http::STATUS_OK);
		}
	}

	/**
	 * @NoCSRFRequired
	 *
	 * @return JSONResponse
	 */
	public function systemInfo(): JSONResponse {
		return new JSONResponse($this->utils->getSystemInfo(), Http::STATUS_OK);
	}

}
