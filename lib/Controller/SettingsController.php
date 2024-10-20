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

use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\IRequest;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;

use OCA\Cloud_Py_API\Service\UtilsService;

use OCA\MediaDC\AppInfo\Application;
use OCA\MediaDC\Service\PhotosService;
use OCA\MediaDC\Service\SettingsService;
use OCA\MediaDC\Service\VideosService;

class SettingsController extends Controller {
	public function __construct(
		IRequest $request,
		private readonly SettingsService $service,
		private readonly PhotosService $photosService,
		private readonly VideosService $videosService,
		private readonly UtilsService $cpaUtils
	) {
		parent::__construct(Application::APP_ID, $request);
	}

	#[NoAdminRequired]
	#[NoCSRFRequired]
	public function index(): JSONResponse {
		return new JSONResponse($this->service->getSettings(), Http::STATUS_OK);
	}

	#[NoCSRFRequired]
	public function update(array $settings): JSONResponse {
		return new JSONResponse($this->service->updateSettings($settings), Http::STATUS_OK);
	}

	#[NoCSRFRequired]
	public function updateSetting(array $setting): JSONResponse {
		return new JSONResponse($this->service->updateSetting($setting), Http::STATUS_OK);
	}

	#[NoCSRFRequired]
	#[NoAdminRequired]
	public function getSettingById(int $id): JSONResponse {
		return new JSONResponse($this->service->getSettingById($id), Http::STATUS_OK);
	}

	#[NoAdminRequired]
	#[NoCSRFRequired]
	public function getSettingByName(string $name): JSONResponse {
		return new JSONResponse($this->service->getSettingByName($name), Http::STATUS_OK);
	}

	#[NoCSRFRequired]
	public function truncate(string $name): JSONResponse {
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
		return new JSONResponse([], Http::STATUS_BAD_REQUEST);
	}

	#[NoCSRFRequired]
	public function systemInfo(): JSONResponse {
		return new JSONResponse($this->cpaUtils->getSystemInfo(Application::APP_ID), Http::STATUS_OK);
	}
}
