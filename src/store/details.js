/**
 * @copyright Copyright (c) 2021 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @copyright Copyright (c) 2021 Alexander Piskun <bigcat88@icloud.com>
 *
 * @author Andrey Borysenko <andrey18106x@gmail.com>
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

import Vue from 'vue'

const state = {
	task: {},
	taskInfo: [],
	details: [],
	sortedDetails: [],
	detailsFiltered: [],
	paginatedDetails: [],
	paginatedSortedDetails: [],
	itemsPerPage: 5,
	groupItemsPerPage: 10,
	sorted: false,
	sortGroups: true,
}

const paginate = (details, itemsPerPage) => {
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
		Vue.set(state, 'task', task)
	},
	setTaskInfo(state, taskInfo) {
		Vue.set(state, 'taskInfo', taskInfo)
	},
	setDetails(state, details) {
		Vue.set(state, 'details', details)
		Vue.set(state, 'paginatedDetails', paginate(details, state.itemsPerPage))
		const sortedDetails = details.sort((a, b) => state.sorted ? JSON.parse(b.group_files_ids).length - JSON.parse(a.group_files_ids).length : JSON.parse(a.group_files_ids).length - JSON.parse(b.group_files_ids).length)
		Vue.set(state, 'sortedDetails', sortedDetails)
		Vue.set(state, 'paginatedSortedDetails', paginate(sortedDetails, state.itemsPerPage))
	},
	deleteDetail(state, detail) {
		const newDetails = [...state.details]
		const detailIndex = newDetails.findIndex(d => d.id === detail.id)
		newDetails.splice(detailIndex, 1)
		Vue.set(state, 'details', newDetails)
		Vue.set(state, 'paginatedDetails', paginate(newDetails, state.itemsPerPage))
		const sortedDetails = newDetails.sort((a, b) => state.sorted ? JSON.parse(b.group_files_ids).length - JSON.parse(a.group_files_ids).length : JSON.parse(a.group_files_ids).length - JSON.parse(b.group_files_ids).length)
		Vue.set(state, 'sortedDetails', sortedDetails)
		Vue.set(state, 'paginatedSortedDetails', paginate(sortedDetails, state.itemsPerPage))
	},
	setDetailsListItemsPerPage(state, itemsPerPage) {
		Vue.set(state, 'itemsPerPage', Number(itemsPerPage))
		Vue.set(state, 'paginatedDetails', paginate(state.details, Number(itemsPerPage)))
	},
	setGroupItemsPerPage(state, itemsPerPage) {
		Vue.set(state, 'groupItemsPerPage', Number(itemsPerPage))
	},
	setSorted(state, sorted) {
		const sortedDetails = state.details.sort((a, b) => sorted ? JSON.parse(b.group_files_ids).length - JSON.parse(a.group_files_ids).length : JSON.parse(a.group_files_ids).length - JSON.parse(b.group_files_ids).length)
		Vue.set(state, 'sortedDetails', sortedDetails)
		Vue.set(state, 'paginatedSortedDetails', paginate(sortedDetails, state.itemsPerPage))
		Vue.set(state, 'sorted', sorted)
	},
	setSortGroups(state, sortGroups) {
		Vue.set(state, 'sortGroups', sortGroups)
	},
	setDetailsFiltered(state, detailFiltered) {
		Vue.set(state, 'detailsFiltered', detailFiltered)
	},
}

const getters = {
	task: state => state.task,
	taskInfo: state => state.taskInfo,
	details: state => state.details,
	sortedDetails: state => state.sortedDetails,
	detailsFiltered: state => state.detailsFiltered,
	paginatedDetails: state => state.paginatedDetails,
	paginatedSortedDetails: state => state.paginatedSortedDetails,
	itemsPerPage: state => state.itemsPerPage,
	groupItemsPerPage: state => state.groupItemsPerPage,
	sorted: state => state.sorted,
	sortGroups: state => state.sortGroups,
}

const actions = {
	setTask(context, task) {
		context.commit('setTask', task)
	},
	setTaskInfo(context, taskInfo) {
		context.commit('setTaskInfo', taskInfo)
	},
	setDetails(context, details) {
		context.commit('setDetails', details)
	},
	deleteDetail(context, detail) {
		context.commit('deleteDetail', detail)
	},
	setDetailsListItemsPerPage(context, itemsPerPage) {
		context.commit('setDetailsListItemsPerPage', itemsPerPage)
	},
	setGroupItemsPerPage(context, itemsPerPage) {
		context.commit('setGroupItemsPerPage', itemsPerPage)
	},
	setSorted(context, sorted) {
		context.commit('setSorted', sorted)
	},
	setDetailsFiltered(context, detailFiltered) {
		context.commit('setDetailsFiltered', detailFiltered)
	},
	setSortGroups(context, sortGroups) {
		context.commit('setSortGroups', sortGroups)
	},
}

export default { state, mutations, getters, actions }
