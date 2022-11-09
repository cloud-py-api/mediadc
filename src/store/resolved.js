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

import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import { showError } from '@nextcloud/dialogs'

import { translate as t } from '@nextcloud/l10n'

const state = {
	photos: {
		page: 0,
		data: {},
	},
	videos: {
		page: 0,
		data: {},
	},
	selectedType: 'photos',
	pageSize: 10,
}

const mutations = {

	/**
	 * Set list of resolved photos
	 *
	 * @param {object} state the store data
	 * @param {Array} photos list of resolved photos
	 */
	setResolvedPhotos(state, photos) {
		state[state.selectedType].data = photos
	},

	/**
	 * Set list of resolved videos
	 *
	 * @param {object} state the store data
	 * @param {Array} videos list of revolved videos
	 */
	setResolvedVideos(state, videos) {
		state[state.selectedType].data = videos
	},

	/**
	 * Set type of list to show
	 *
	 * @param {object} state the store data
	 * @param {string} selectedType type of media to show
	 */
	setSelectedType(state, selectedType) {
		if (['photos', 'videos'].includes(selectedType)) {
			state.selectedType = selectedType
		}
	},

	/**
	 * Set current page number
	 *
	 * @param {object} state the store data
	 * @param {number} value page number
	 */
	updatePage(state, value) {
		state[state.selectedType].page = value
	},
}

const getters = {
	/**
	 * Returns current list of selectedType
	 *
	 * @param {object} state the store data
	 * @return {Array} list of resolved photos or videos
	 */
	resolved: state => ['photos', 'videos'].includes(state.selectedType) ? state[state.selectedType].data : null,

	/**
	 * Returns current pagination page within selected type
	 *
	 * @param {object} state the store data
	 * @return {number}
	 */
	page: state => state[state.selectedType].page,

	/**
	 * Returns page size (items per page)
	 *
	 * @param {object} state the store data
	 * @return {number}
	 */
	pageSize: state => state.pageSize,

	/**
	 * Return current selected type of resolved list (photos or videos)
	 *
	 * @param {object} state the store data
	 * @return {Array}
	 */
	selectedType: state => state.selectedType,
}

const actions = {

	/**
	 * Retrieve and commit list of selected type of resolved items
	 *
	 * @param {object} context the store object
	 * @return {Promise<object>}
	 */
	async getResolved(context) {
		return axios.get(generateUrl(`/apps/mediadc/api/v1/resolved?type=${context.state.selectedType}&limit=${context.state.pageSize}&offset=${context.state[context.state.selectedType].page * 10}`)).then(res => {
			if (res.data.success) {
				if (context.state.selectedType === 'photos') {
					context.commit('setResolvedPhotos', res.data.resolved.photos)
				} else if (context.state.selectedType === 'videos') {
					context.commit('setResolvedVideos', res.data.resolved.videos)
				} else if (context.state.selectedType === 'all') {
					context.commit('setResolvedPhotos', res.data.resolved.photos)
					context.commit('setResolvedVideos', res.data.resolved.videos)
				}
			}
			return res
		}).catch(err => {
			console.debug(err)
		})
	},

	/**
	 * Perform resolveFile request (mark or unmark resolved)
	 *
	 * @param {object} context the store object
	 * @param {object} params method params
	 * @return {Promise<object>}
	 */
	async resolveFile(context, params) {
		return axios.post(generateUrl(`/apps/mediadc/api/v1/resolved/mark/${params.fileid}`), { type: context.state.selectedType, resolved: params.resolved }).then(res => {
			return res
		}).catch(err => {
			console.debug(err)
			showError(t('mediadc', 'Some server error occured'))
		})
	},
}

export default { state, mutations, getters, actions }
