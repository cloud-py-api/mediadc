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
	setResolvedPhotos(state, photos) {
		state[state.selectedType].data = photos
	},
	setResolvedVideos(state, videos) {
		state[state.selectedType].data = videos
	},
	setSelectedType(state, selectedType) {
		if (['photos', 'videos'].includes(selectedType)) {
			state.selectedType = selectedType
		}
	},
	updatePage(state, value) {
		state[state.selectedType].page = value
	},
}

const getters = {
	resolved: state => {
		if (state.selectedType === 'photos') {
			return state.photos.data
		} else if (state.selectedType === 'videos') {
			return state.videos.data
		}
	},
	page: state => state[state.selectedType].page,
	pageSize: state => state.pageSize,
	selectedType: state => state.selectedType,
	resolvedStatus: state => state.status,
}

const actions = {
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
