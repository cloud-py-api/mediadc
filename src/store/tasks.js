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
import { showError, showSuccess, showWarning } from '@nextcloud/dialogs'

import { translate as t } from '@nextcloud/l10n'
import Formats from '../mixins/Formats.js'

const state = {
	tasks: [],
}

const mutations = {

	/**
	 * Set list of tasks
	 *
	 * @param {object} state the store data
	 * @param {object[]} tasks list of tasks
	 */
	setTasks(state, tasks) {
		state.tasks = tasks.sort((a, b) => b.created_time - a.created_time)
	},

	/**
	 * Update task data in the list
	 *
	 * @param {object} state the store data
	 * @param {object} task updated task object
	 */
	updateTask(state, task) {
		const taskIndex = state.tasks.findIndex(t => t.id === task.id)
		const updatedTasks = state.tasks
		updatedTasks[taskIndex] = task
		state.tasks = updatedTasks
	},

	/**
	 * Remove deleted task from the list
	 *
	 * @param {object} state the store data
	 * @param {object} task deleted task to remove
	 */
	deleteTask(state, task) {
		const taskIndex = state.tasks.findIndex(t => t.id === task.id)
		const updatedTasks = state.tasks
		updatedTasks.splice(taskIndex, 1)
		state.tasks = updatedTasks
	},
}

const getters = {

	/**
	 * List of created tasks
	 *
	 * @param {object} state the store data
	 * @return {Array}
	 */
	tasks: state => state.tasks,

	/**
	 *
	 * @param {object} state the store data
	 * @return {object}
	 */
	taskById: state => id => state.tasks.find(task => task.id === id),
}

const actions = {

	/**
	 * Retrieve and commit list of tasks
	 *
	 * @param {object} context the store object
	 * @param {object} context.commit the store mutations
	 * @param {boolean} recent boolean flag for recent sorted tasks
	 * @return {Promise<object>} request results
	 */
	async getTasks({ commit }, recent = false) {
		return axios.get(generateUrl(`/apps/mediadc/api/v1/tasks?recent=${recent}`)).then(res => {
			commit('setTasks', res.data)
			return res.data
		})
	},

	/**
	 * Perform request to run the task
	 *
	 * @param {object} context the store mutations
	 * @param {object} data request data
	 * @return {Promise}
	 */
	async runTask(context, data) {
		return axios.post(generateUrl('/apps/mediadc/api/v1/tasks/run'), data)
	},

	/**
	 * Perform terminate task request
	 *
	 * @param {object} context the store object
	 * @param {object} context.commit the store mutations
	 * @param {number} taskId task id
	 * @return {Promise<object>}
	 */
	async terminateTask({ commit }, taskId) {
		return axios.post(generateUrl(`/apps/mediadc/api/v1/tasks/${taskId}/terminate`)).then(res => {
			if (res.data.success) {
				commit('updateTask', res.data.terminatedTask)
				showSuccess(t('mediadc', 'Task terminated'))
			}
			return res
		}).catch(err => {
			console.debug(err)
			showError(t('mediadc', 'Some error occurred while terminating task'))
		})
	},

	/**
	 * Perform delete task request
	 *
	 * @param {object} context the store object
	 * @param {object} context.commit the store mutations
	 * @param {object} task target task
	 * @return {Promise<object>}
	 */
	async deleteTask({ commit }, task) {
		return axios.delete(generateUrl(`/apps/mediadc/api/v1/tasks/${task.id}`)).then(res => {
			if (res.data.success) {
				commit('deleteTask', res.data.deletedTask)
			}
			return res
		}).catch(err => {
			console.debug(err)
			showError(t('mediadc', 'An error occurred while deleting task'))
		})
	},

	/**
	 * Perform duplicate task request
	 *
	 * @param {object} context the store object
	 * @param {object} context.dispatch the store actions
	 * @param {object} task target task
	 * @return {Promise<object>}
	 */
	async duplicateTask({ dispatch }, task) {
		return axios.post(generateUrl(`/apps/mediadc/api/v1/tasks/${task.id}/duplicate`)).then(res => {
			if (res.data.success) {
				dispatch('getTasks', true).then(() => {
					showSuccess(t('mediadc', 'Task successfully duplicated'))
				})
			}
			return res
		}).catch(err => {
			console.debug(err)
		})
	},

	/**
	 * Perform restart task request
	 *
	 * @param {object} context the store object
	 * @param {object} context.commit the store mutations
	 * @param {object} context.rootGetters context.rootGetters the store root getters
	 * @param {object} task target task
	 * @return {Promise<object>}
	 */
	async restartTask({ commit, rootGetters }, task) {
		return axios.post(generateUrl('/apps/mediadc/api/v1/tasks/restart'), {
			taskId: task.id,
			targetDirectoryIds: task.target_directory_ids,
			excludeList: {
				user: JSON.parse(task.exclude_list).user,
				admin: JSON.parse(rootGetters.settingByName('exclude_list').value),
			},
			collectorSettings: {
				hashing_algorithm: JSON.parse(rootGetters.settingByName('hashing_algorithm').value) || 'dhash',
				similarity_threshold: Number(JSON.parse(task.collector_settings).similarity_threshold),
				hash_size: Number(rootGetters.settingByName('hash_size').value) || 16,
				target_mtype: Number(JSON.parse(task.collector_settings).target_mtype),
				finish_notification: JSON.parse(task.collector_settings).finish_notification,
			},
		}).then(res => {
			if (res.data.success) {
				commit('updateTask', res.data.restartedTask)
				if (Formats.methods.getStatusBadge(task) !== 'duplicated') {
					showSuccess(t('mediadc', 'Task successfully restarted with previous settings!'))
				} else {
					showSuccess(t('mediadc', 'Task successfully started with duplicated settings!'))
				}
			} else if (res.data.limit) {
				showWarning(t('mediadc', 'Running tasks limit exceed. Try again later.'))
			} else {
				showWarning(t('medaidc', 'Some error occurred while running Collector Task. Try again.'))
			}
			return res
		}).catch(err => {
			console.debug(err)
			showError(t('mediadc', 'Some error occurred while running Collector Task. Try again.'))
		})
	},
}

export default { state, mutations, getters, actions }
