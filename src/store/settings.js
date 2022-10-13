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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'

const state = {
	settings: [],
	detailsGridSize: 192,
	deleteFileConfirmation: true,
	autoOpenNextGroup: true,
}

const mutations = {
	setSettings(state, settings) {
		state.settings = settings
	},
	setSetting(state, setting) {
		const settingIndex = state.settings.findIndex(s => s.name === setting.name)
		const newSettings = state.settings
		newSettings[settingIndex] = setting
		state.settings = newSettings
	},
	updateSetting(state, setting) {
		const settingIndex = state.settings.findIndex(s => s.name === setting.name)
		if (settingIndex !== -1) {
			const settings = state.settings
			settings[settingIndex] = setting
			state.settings = settings
		}
	},
	setDetailsGridSize(state, size) {
		if (state.detailsGridSize !== size) {
			state.detailsGridSize = size
		}
	},
	setDeleteFileConfirmation(state, value) {
		state.deleteFileConfirmation = value
	},
	setAutoOpenNextGroup(state, value) {
		state.autoOpenNextGroup = value
	},
}

const getters = {
	settings: state => state.settings,
	settingByName: state => name => state.settings.find(setting => setting.name === name),
	detailsGridSize: state => state.detailsGridSize,
	deleteFileConfirmation: state => state.deleteFileConfirmation,
	autoOpenNextGroup: state => state.autoOpenNextGroup,
}

const actions = {
	async getSettings({ commit }) {
		return axios.get(generateUrl('/apps/mediadc/api/v1/settings')).then(res => {
			commit('setSettings', res.data)
			return res.data
		}).catch(err => {
			console.debug(err)
		})
	},
	async getSettingByName({ commit }, settingName) {
		return axios.get(generateUrl(`/apps/mediadc/api/v1/settings/name/${settingName}`)).then(res => {
			if (res.data?.success) {
				commit('updateSetting', res.data.setting)
			}
			return res
		})
	},
}

export default { state, mutations, getters, actions }
