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

import settingsStore from '../../../../src/store/settings'

jest.mock('@nextcloud/l10n', () => ({
	translate: jest.fn((app, msg) => msg),
	translatePlural: jest.fn((app, msgS, msgN, len) => msgS),
	getLanguage: () => 'en',
	getLocale: () => 'en',
}))
jest.mock('vue')

jest.mock('@nextcloud/router', () => ({
	generateUrl: (url) => url,
}))
jest.mock('@nextcloud/dialogs', () => ({
	showSuccess: (msg) => console.log(`[Success] ${msg}`),
	showWarning: (msg) => console.log(`[Warning] ${msg}`),
	showError: (msg) => console.log(`[Error] ${msg}`),
	showInfo: (msg) => console.log(`[Info] ${msg}`),
}))


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

const settingsData = [
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


let url = ''
let axiosError = false
const urlsData = {
	get: {
		'/apps/mediadc/api/v1/settings': settingsData,
		'/apps/mediadc/api/v1/settings/name/python_command': { success: true, setting: setting7 }
	}
}

jest.mock('@nextcloud/axios', () => {
	const urlsData = {
		get: {
			'/apps/mediadc/api/v1/settings': [
				setting1,
				setting2,
				setting3,
				setting4,
				setting5,
				setting6,
				setting7,
				setting8,
				setting9,
			],
			'/apps/mediadc/api/v1/settings/name/python_command': { success: true, setting: setting7 }
		}
	}
	return {
		get: (_url) => {
			return new Promise((resolve) => {
				if (axiosError)
					throw Error()
	
				url = _url
				if (_url in urlsData.get)
					resolve({ data: urlsData.get[_url] })
				else
					resolve({ data: null })
			})
		},
	}
})

const state = {
	settings: [],
	detailsGridSize: 192,
	deleteFileConfirmation: true,
	autoOpenNextGroup: true,
}

describe('store/settings tests', () => {

	it('should provide default state', () => {
		expect(settingsStore.state).toEqual(state)
	})

	describe('actions tests', () => {

		describe('getSettings action test', () => {

			it('should perform getSettings request', async () => {
				const commit = jest.fn()
				const testUrl = '/apps/mediadc/api/v1/settings'

				await settingsStore.actions.getSettings({ commit })

				expect(url).toBe(testUrl)
				expect(commit).toHaveBeenCalledWith('setSettings', settingsData)
			})

		})

		describe('getSettingByName action test', () => {

			it('should perform getSettingByName request', async () => {
				const commit = jest.fn()
				const testUrl = '/apps/mediadc/api/v1/settings/name/python_command'

				await settingsStore.actions.getSettingByName({ commit }, 'python_command').then((res) => {
					expect(url).toBe(testUrl)
					expect(res.data.success).toBe(true)
					expect(commit).toHaveBeenCalledWith('updateSetting', urlsData.get[url].setting)
				})
			})

		})

	})
})