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

import Formats from '../mixins/Formats.js'

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

/**
 * Paginate list of items
 *
 * @param {Array<object>} details list of items
 * @param {number} itemsPerPage items per page setting
 * @return {Array<Array<object>>}
 */
function paginate(details, itemsPerPage) {
	const paginated = []
	for (let i = 0; i < details.length; i++) {
		const last = paginated[paginated.length - 1]
		if (!last || last.length === itemsPerPage) {
			paginated.push([Object.freeze(details[i])])
		} else {
			last.push(Object.freeze(details[i]))
		}
	}
	return paginated
}

const mutations = {

	/**
	 * Set current collectorTask
	 *
	 * @param {object} state the store data
	 * @param {object} task collectorTask
	 */
	setTask(state, task) {
		state.task = task
	},

	/**
	 * Set current task info
	 *
	 * @param {object} state the store data
	 * @param {object} taskInfo target/exclude directories info object
	 */
	setTaskInfo(state, taskInfo) {
		state.taskInfo = taskInfo
	},

	/**
	 * Set task details info
	 *
	 * @param {object} state the store data
	 * @param {object} data task detail info (filestotal, filessize) object
	 */
	setDetailsInfo(state, data) {
		state.detailsInfo.filessize = data.filessize
		state.detailsInfo.filestotal = data.filestotal
	},

	/**
	 * Set list of details
	 *
	 * @param {object} state the store data
	 * @param {Array} details list of task details
	 */
	setDetails(state, details) {
		state.details = details
		state.paginatedDetails = paginate(details, state.itemsPerPage)
		const sortedDetails = details.sort((a, b) => state.sorted ? b.files.length - a.files.length : a.files.length - b.files.length)
		state.sortedDetails = sortedDetails
		state.paginatedSortedDetails = paginate(sortedDetails, state.itemsPerPage)
	},

	/**
	 * Delete task detail from list and update paginated objects
	 *
	 * @param {object} state the store data
	 * @param {object} detail target detail to delete from list
	 */
	deleteDetail(state, detail) {
		const newDetails = [...state.details]
		const detailIndex = newDetails.findIndex(d => d.group_id === detail.group_id)
		newDetails.splice(detailIndex, 1)
		state.details = newDetails
		state.paginatedDetails = paginate(newDetails, state.itemsPerPage)
		const sortedDetails = newDetails.sort((a, b) => state.sorted ? b.files.length - a.files.length : a.files.length - b.files.length)
		state.sortedDetails = sortedDetails
		state.paginatedSortedDetails = paginate(sortedDetails, state.itemsPerPage)
	},

	/**
	 * Set item per details list page setting and update paginated objects
	 *
	 * @param {object} state the store data
	 * @param {number} itemsPerPage items per page setting
	 */
	setDetailsListItemsPerPage(state, itemsPerPage) {
		state.itemsPerPage = Number(itemsPerPage)
		state.paginatedDetails = paginate(state.details, Number(itemsPerPage))
		state.paginatedSortedDetails = paginate(state.sortedDetails, Number(itemsPerPage))
	},

	/**
	 * Set item per duplicate group page setting
	 *
	 * @param {object} state the store data
	 * @param {number} itemsPerPage items per page setting
	 */
	setGroupItemsPerPage(state, itemsPerPage) {
		state.groupItemsPerPage = Number(itemsPerPage)
	},

	/**
	 * Set asc/desc sorting flag
	 *
	 * @param {object} state the store data
	 * @param {boolean} sorted if true - desc, false - asc
	 */
	setSorted(state, sorted) {
		const sortedDetails = state.details.sort((a, b) => sorted ? b.files.length - a.files.length : a.files.length - b.files.length)
		state.sortedDetails = sortedDetails
		if (state.detailsFiltered.length > 0) {
			const sortedDetailsFiltered = state.detailsFiltered.sort((a, b) => state.sorted ? b.files.length - a.files.length : a.files.length - b.files.length)
			state.detailsFilteredSorted = sortedDetailsFiltered
			state.paginatedDetailsFilteredSorted = paginate(sortedDetailsFiltered, state.itemsPerPage)
		}
		state.paginatedSortedDetails = paginate(sortedDetails, state.itemsPerPage)
		state.sorted = sorted
	},

	/**
	 * Set perform groups sorting flag
	 *
	 * @param {object} state the store data
	 * @param {boolean} sortGroups sort groups flag
	 */
	setSortGroups(state, sortGroups) {
		state.sortGroups = sortGroups
	},

	/**
	 * Set filtered details list
	 *
	 * @param {object} state the store data
	 * @param {*} detailsFiltered filtered details list
	 */
	setDetailsFiltered(state, detailsFiltered) {
		state.detailsFiltered = detailsFiltered.sort((a, b) => a.group_id - b.group_id)
		state.paginatedDetailsFiltered = paginate(detailsFiltered, state.itemsPerPage)
		const sortedDetailsFiltered = detailsFiltered.sort((a, b) => state.sorted ? b.files.length - a.files.length : a.files.length - b.files.length)
		state.detailsFilteredSorted = sortedDetailsFiltered
		state.paginatedDetailsFilteredSorted = paginate(sortedDetailsFiltered, state.itemsPerPage)
	},
}

const getters = {

	/**
	 * Currently opened task
	 *
	 * @param {object} state the store data
	 * @return {object} CollectorTask object
	 */
	task: state => state.task,

	/**
	 * Current task info (target&exclude directories)
	 *
	 * @param {object} state the store data
	 * @return {object}
	 */
	taskInfo: state => state.taskInfo,

	/**
	 * List of task details
	 *
	 * @param {object} state the store data
	 * @return {Array} CollectorTaskDetails
	 */
	details: state => state.details,

	/**
	 * Task details info (filescount, filestotal)
	 *
	 * @param {object} state the store data
	 * @return {object}
	 */
	detailsInfo: state => state.detailsInfo,

	/**
	 * List of sorted task details
	 *
	 * @param {object} state the store data
	 * @return {Array}
	 */
	sortedDetails: state => state.sortedDetails,

	/**
	 * List of filtered task details
	 *
	 * @param {object} state the store data
	 * @return {Array}
	 */
	detailsFiltered: state => state.detailsFiltered,

	/**
	 * List of sorted filtered task details
	 *
	 * @param {object} state the store data
	 * @return {Array}
	 */
	detailsFilteredSorted: state => state.detailsFilteredSorted,

	/**
	 * List of paginated task details
	 *
	 * @param {object} state the store data
	 * @return {Array}
	 */
	paginatedDetails: state => state.paginatedDetails,

	/**
	 * List of paginated sorted task details
	 *
	 * @param {object} state the store data
	 * @return {Array}
	 */
	paginatedSortedDetails: state => state.paginatedSortedDetails,

	/**
	 * List of paginated filtered task details
	 *
	 * @param {object} state the store data
	 * @return {Array}
	 */
	paginatedDetailsFiltered: state => state.paginatedDetailsFiltered,

	/**
	 * List of paginated, filtered and sorted task details
	 *
	 * @param {object} state the store data
	 * @return {Array}
	 */
	paginatedDetailsFilteredSorted: state => state.paginatedDetailsFilteredSorted,

	/**
	 * Items per details list page setting
	 *
	 * @param {object} state the store data
	 * @return {number}
	 */
	itemsPerPage: state => state.itemsPerPage,

	/**
	 * Items per detail group items per page
	 *
	 * @param {object} state the store data
	 * @return {number}
	 */
	groupItemsPerPage: state => state.groupItemsPerPage,

	/**
	 * Is groups asc/desc sorted flag
	 *
	 * @param {object} state the store data
	 * @return {boolean}
	 */
	sorted: state => state.sorted,

	/**
	 * Is groups sorted
	 *
	 * @param {object} state the store data
	 * @return {boolean}
	 */
	sortGroups: state => state.sortGroups,
}

const actions = {

	/**
	 * Retrieve and commit list of task details
	 *
	 * @param {object} context the store object
	 * @return {Promise<object>} request data (collectorTask, collectorTaskDetails)
	 */
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
			return res
		})
	},

	/**
	 * Retrieve and commit task info
	 *
	 * @param {object} context the store object
	 * @return {Promise<object>} request data (collectorTaskInfo: target/exclude directories info)
	 */
	async getTaskInfo(context) {
		return axios.get(generateUrl(`/apps/mediadc/api/v1/tasks/${context.rootState.route.params.taskId}/info`)).then(res => {
			context.commit('setTaskInfo', res.data.collectorTaskInfo)
			return res
		})
	},

	/**
	 * Retrieve and commit task details info
	 *
	 * @param {object} context the store object
	 * @return {Promise<object>} request data (task details filessize and filestotal)
	 */
	async getDetailFilesTotalSize(context) {
		const taskId = context.rootState.route.params.taskId
		return axios.get(generateUrl(`/apps/mediadc/api/v1/tasks/${taskId}/filestotal`)).then(res => {
			context.commit('setDetailsInfo', { filessize: res.data.filessize, filestotal: res.data.filestotal })
			return res
		})
	},

	/**
	 * Perform termination of the task execution request
	 *
	 * @param {object} context the store object
	 * @param {object} task the collectorTask object
	 * @return {Promise<object>} request data
	 */
	async terminateTask(context, task) {
		return axios.post(generateUrl(`/apps/mediadc/api/v1/tasks/${task.id}/terminate`)).then(res => {
			context.dispatch('getTaskDetails')
			return res
		})
	},
}

export default { state, mutations, getters, actions }
