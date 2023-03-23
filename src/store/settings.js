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
	showFullFilePath: false,
}

const mutations = {

	/**
	 * Set list of settings
	 *
	 * @param {object} state the store data
	 * @param {Array} settings list of settings
	 */
	setSettings(state, settings) {
		state.settings = settings
	},

	/**
	 * Set setting
	 *
	 * @param {object} state the store data
	 * @param {object} setting mediadc setting
	 */
	setSetting(state, setting) {
		const settingIndex = state.settings.findIndex(s => s.name === setting.name)
		const newSettings = state.settings
		newSettings[settingIndex] = setting
		state.settings = newSettings
	},

	/**
	 * Update setting object
	 *
	 * @param {object} state the store data
	 * @param {object} setting mediadc setting
	 */
	updateSetting(state, setting) {
		const settingIndex = state.settings.findIndex(s => s.name === setting.name)
		if (settingIndex !== -1) {
			const settings = state.settings
			settings[settingIndex] = setting
			state.settings = settings
		}
	},

	/**
	 * Set size of details file grid
	 *
	 * @param {object} state the store data
	 * @param {number} size grid size value
	 */
	setDetailsGridSize(state, size) {
		if (state.detailsGridSize !== size) {
			state.detailsGridSize = size
		}
	},

	/**
	 * Set delete file confiration flag
	 *
	 * @param {object} state the store data
	 * @param {boolean} value flag value
	 */
	setDeleteFileConfirmation(state, value) {
		state.deleteFileConfirmation = value
	},

	/**
	 * Set auto open next details list group flag
	 *
	 * @param {object} state the store data
	 * @param {boolean} value flag value
	 */
	setAutoOpenNextGroup(state, value) {
		state.autoOpenNextGroup = value
	},

	/**
	 * Set show full file path flag
	 *
	 * @param {object} state the store data
	 * @param {boolean} value flag value
	 */
	setShowFullFilePath(state, value) {
		state.showFullFilePath = value
	},
}

const getters = {

	/**
	 * Returns list of settings
	 *
	 * @param {object} state the store data
	 * @return {Array}
	 */
	settings: state => state.settings,

	/**
	 * Returns setting object by setting name
	 *
	 * @param {object} state the store data
	 * @return {object}
	 */
	settingByName: state => name => state.settings.find(setting => setting.name === name),

	/**
	 * Returns details grid size setting
	 *
	 * @param {object} state the store data
	 * @return {number}
	 */
	detailsGridSize: state => state.detailsGridSize,

	/**
	 * Returns delete file confirmation setting
	 *
	 * @param {object} state the store data
	 * @return {boolean}
	 */
	deleteFileConfirmation: state => state.deleteFileConfirmation,

	/**
	 * Returns auto open next group setting
	 *
	 * @param {object} state the store data
	 * @return {boolean}
	 */
	autoOpenNextGroup: state => state.autoOpenNextGroup,

	/**
	 * Returns showFullFilePath path setting
	 *
	 * @param {object} state the store data
	 * @return {boolean}
	 */
	showFullFilePath: state => state.showFullFilePath,
}

const actions = {

	/**
	 * Retrieve and commit list of settings
	 *
	 * @param {object} context the store object
	 * @param {object} context.commit the store mutations
	 * @return {Promise<object>}
	 */
	async getSettings({ commit }) {
		return axios.get(generateUrl('/apps/mediadc/api/v1/settings')).then(res => {
			commit('setSettings', res.data)
			return res.data
		}).catch(err => {
			console.debug(err)
		})
	},

	/**
	 * Retrieve and commit certain setting by name
	 *
	 * @param {object} context the store object
	 * @param {object} context.commit the store mutations
	 * @param {string} settingName setting name
	 * @return {Promise<object>}
	 */
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
