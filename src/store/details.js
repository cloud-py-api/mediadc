/**
 * @copyright 2021 Andrey Borysenko <andrey18106x@gmail.com>
 * @copyright 2021 Alexander Piskun <bigcat88@icloud.com>
 *
 * @author Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @license GNU AGPL version 3 or any later version
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
	paginatedDetails: [],
	itemsPerPage: 5,
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
	},
	deleteDetail(state, detail) {
		const detailIndex = state.details.findIndex(d => d.id === detail.id)
		const newDetails = state.details
		state.details.splice(detailIndex, 1)
		Vue.set(state, 'details', paginate(newDetails, state.itemsPerPage))
	},
	setDetailsListItemsPerPage(state, itemsPerPage) {
		Vue.set(state, 'itemsPerPage', Number(itemsPerPage))
		Vue.set(state, 'paginatedDetails', paginate(state.details, Number(itemsPerPage)))
	},
}

const getters = {
	task: state => state.task,
	taskInfo: state => state.taskInfo,
	details: state => state.details,
	paginatedDetails: state => state.paginatedDetails,
	itemsPerPage: state => state.itemsPerPage,
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
}

export default { state, mutations, getters, actions }
