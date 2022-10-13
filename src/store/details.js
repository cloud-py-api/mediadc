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

import Formats from '../mixins/Formats'

const state = {
	task: {},
	taskInfo: {
		exclude_directories: [],
		target_directories: [],
	},
	details: [],
	detailsInfo: {
		filessize: 0,
		filestotal: 0,
	},
	sortedDetails: [],
	detailsFiltered: [],
	detailsFilteredSorted: [],
	paginatedDetails: [],
	paginatedSortedDetails: [],
	paginatedDetailsFiltered: [],
	paginatedDetailsFilteredSorted: [],
	itemsPerPage: 5,
	groupItemsPerPage: 10,
	sorted: false,
	sortGroups: true,
}

function paginate(details, itemsPerPage) {
	const paginated = []
	for (let i = 0; i < details.length; i++) {
		const last = paginated[paginated.length - 1]
		if (!last || last.length === itemsPerPage) {
			paginated.push([details[i]])
		} else {
			last.push(details[i])
		}
	}
	return paginated
}

const mutations = {
	setTask(state, task) {
		state.task = task
	},
	setTaskInfo(state, taskInfo) {
		state.taskInfo = taskInfo
	},
	setDetailsInfo(state, data) {
		state.detailsInfo.filessize = data.filessize
		state.detailsInfo.filestotal = data.filestotal
	},
	setDetails(state, details) {
		state.details = details.map((v, i) => { v.virtualId = i + 1; v.state = { checked: false, opened: false }; return v; })
		state.paginatedDetails = paginate(details, state.itemsPerPage)
		const sortedDetails = details.sort((a, b) => state.sorted ? JSON.parse(b.group_files_ids).length - JSON.parse(a.group_files_ids).length : JSON.parse(a.group_files_ids).length - JSON.parse(b.group_files_ids).length)
		state.sortedDetails = sortedDetails
		state.paginatedSortedDetails = paginate(sortedDetails, state.itemsPerPage)
	},
	deleteDetail(state, detail) {
		const newDetails = [...state.details]
		const detailIndex = newDetails.findIndex(d => d.id === detail.id)
		newDetails.splice(detailIndex, 1)
		state.details = newDetails
		state.paginatedDetails = paginate(newDetails, state.itemsPerPage)
		const sortedDetails = newDetails.sort((a, b) => state.sorted ? JSON.parse(b.group_files_ids).length - JSON.parse(a.group_files_ids).length : JSON.parse(a.group_files_ids).length - JSON.parse(b.group_files_ids).length)
		state.sortedDetails = sortedDetails
		state.paginatedSortedDetails = paginate(sortedDetails, state.itemsPerPage)
	},
	setDetailsListItemsPerPage(state, itemsPerPage) {
		state.itemsPerPage = Number(itemsPerPage)
		state.paginatedDetails = paginate(state.details, Number(itemsPerPage))
		state.paginatedSortedDetails = paginate(state.sortedDetails, Number(itemsPerPage))
	},
	setGroupItemsPerPage(state, itemsPerPage) {
		state.groupItemsPerPage = Number(itemsPerPage)
	},
	setSorted(state, sorted) {
		const sortedDetails = state.details.sort((a, b) => sorted ? JSON.parse(b.group_files_ids).length - JSON.parse(a.group_files_ids).length : JSON.parse(a.group_files_ids).length - JSON.parse(b.group_files_ids).length)
		state.sortedDetails = sortedDetails
		if (state.detailsFiltered.length > 0) {
			const sortedDetailsFiltered = state.detailsFiltered.sort((a, b) => state.sorted ? JSON.parse(b.group_files_ids).length - JSON.parse(a.group_files_ids).length : JSON.parse(a.group_files_ids).length - JSON.parse(b.group_files_ids).length)
			state.detailsFilteredSorted = sortedDetailsFiltered
			state.paginatedDetailsFilteredSorted = paginate(sortedDetailsFiltered, state.itemsPerPage)
		}
		state.paginatedSortedDetails = paginate(sortedDetails, state.itemsPerPage)
		state.sorted = sorted
	},
	setSortGroups(state, sortGroups) {
		state.sortGroups = sortGroups
	},
	setDetailsFiltered(state, detailsFiltered) {
		state.detailsFiltered = detailsFiltered
		state.paginatedDetailsFiltered = paginate(detailsFiltered, state.itemsPerPage)
		const sortedDetailsFiltered = detailsFiltered.sort((a, b) => state.sorted ? JSON.parse(b.group_files_ids).length - JSON.parse(a.group_files_ids).length : JSON.parse(a.group_files_ids).length - JSON.parse(b.group_files_ids).length)
		state.detailsFilteredSorted = sortedDetailsFiltered
		state.paginatedDetailsFilteredSorted = paginate(sortedDetailsFiltered, state.itemsPerPage)
	},
}

const getters = {
	task: state => state.task,
	taskInfo: state => state.taskInfo,
	details: state => state.details,
	detailsInfo: state => state.detailsInfo,
	sortedDetails: state => state.sortedDetails,
	detailsFiltered: state => state.detailsFiltered,
	detailsFilteredSorted: state => state.detailsFilteredSorted,
	paginatedDetails: state => state.paginatedDetails,
	paginatedSortedDetails: state => state.paginatedSortedDetails,
	paginatedDetailsFiltered: state => state.paginatedDetailsFiltered,
	paginatedDetailsFilteredSorted: state => state.paginatedDetailsFilteredSorted,
	itemsPerPage: state => state.itemsPerPage,
	groupItemsPerPage: state => state.groupItemsPerPage,
	sorted: state => state.sorted,
	sortGroups: state => state.sortGroups,
}

const actions = {
	async getTaskDetails(context) {
		return axios.get(generateUrl(`/apps/mediadc/api/v1/tasks/${context.rootState.route.params.taskId}`)).then(res => {
			if ('success' in res.data && res.data.success) {
				context.commit('setTask', res.data.collectorTask)
				context.commit('setDetails', res.data.collectorTaskDetails)

				if (Formats.methods.getStatusBadge(context.state.task) === 'finished'
					&& context.state.detailsInfo.filestotal === 0 && context.state.detailsInfo.filessize === 0) {
					context.dispatch('getDetailFilesTotalSize')
				}
			}
		})
	},
	async getTaskInfo(context) {
		return axios.get(generateUrl(`/apps/mediadc/api/v1/tasks/${context.rootState.route.params.taskId}/info`)).then(res => {
			context.commit('setTaskInfo', res.data.collectorTaskInfo)
			return res
		})
	},
	async getDetailFilesTotalSize(context) {
		const taskId = context.rootState.route.params.taskId
		return axios.get(generateUrl(`/apps/mediadc/api/v1/tasks/${taskId}/filestotal`)).then(res => {
			context.commit('setDetailsInfo', { taskId: taskId, filessize: res.data.filessize, filestotal: res.data.filestotal })
			return res
		})
	},
}

export default { state, mutations, getters, actions }
