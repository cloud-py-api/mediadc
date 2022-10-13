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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

const setting1 = {
	"name": "hashing_algorithm",
	"value": "dhash",
	"displayName": "Hashing algorithm",
	"description": "Hashing algorithm used by Python background script"
}
const setting2 = {
	"name": "similarity_threshold",
	"value": 90,
	"displayName": "Similarity threshold",
	"description": "Hashing algorithm threshold (precision)"
}
const setting3 = {
	"name": "hash_size",
	"value": 16,
	"displayName": "Hash size",
	"description": "Computed hash size (8, 16, 32, 64)"
}
const setting4 = {
	"name": "python_limit",
	"value": 1,
	"displayName": "Running tasks limit",
	"description": "Maximum number of python background scripts running"
}
const setting5 = {
	"name": "exclude_list",
	"value": {
		"mask": [],
		"fileid": []
	},
	"displayName": "Exclude list",
	"description": "Global administrator's exclude list that applies to each task"
}
const setting6 = {
	"name": "installed",
	"value": {
		"status": false,
		"installed_list": {},
		"not_installed_list": {},
		"video_required": [],
		"available_algorithms": []
	},
	"displayName": "MediaDC installed flag",
	"description": "Installation data with current MediaDC configuration"
}
const setting7 = {
	"name": "python_command",
	"value": "/usr/bin/python3",
	"displayName": "Full path to python interpreter",
	"description": "Absolute path to the python runnable (e.g. \"/usr/bin/python3\"). Can be obtained by `which python3` command."
}
const setting8 = {
	"name": "remote_filesize_limit",
	"value": 536870912,
	"displayName": "Remote/Encrypted file size limit to process",
	"description": "Maximum file size for requesting from php core. Used when file hosts on remote NC instance or have encrypted flag. Must be less then total available RAM size."
}
const setting9 = {
	"name": "php_path",
	"value": "/usr/bin/php",
	"displayName": "Full path to PHP interpreter",
	"description": "Absolute path to the PHP executable (e.g. \"/usr/bin/php7.4\"). Can be obtained by `which php` or `which php7.4` command"
}

export const settingsData = [
	setting1,
	setting2,
	setting3,
	setting4,
	setting5,
	setting6,
	setting7,
	setting8,
	setting9,
]

const state = {
	settings: settingsData,
	detailGridSize: 192,
	deleteFileConfirmation: true,
	autoOpenNextGroup: true,
}

const mutations = {
	setSettings: jest.fn(),
	setSetting: jest.fn(),
	updateSetting: jest.fn(),
	setDetailsGridSize: jest.fn(),
	setDeleteFileConfirmation: jest.fn(),
	setAutoOpenNextGroup: jest.fn(),
}

const getters = {
	settings: jest.fn(),
	settingByName: jest.fn(),
	detailsGridSize: jest.fn(),
	deleteFileConfirmation: jest.fn(),
	autoOpenNextGroup: jest.fn(),
}

const actions = {
	getSettings: jest.fn(),
	getSettingByName: jest.fn()
}

export default { state, mutations, getters, actions }
