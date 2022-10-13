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

import tasksStore from '../../../../src/store/tasks'

jest.mock('@nextcloud/l10n', () => ({
	translate: jest.fn((app, msg) => msg),
	translatePlural: jest.fn((app, msgS, msgN, len) => msgS),
	getLanguage: () => 'en',
	getLocale: () => 'en',
}))
jest.mock('vue')

const task1 = {
	id: 124,
	type: "manual",
	owner: "admin",
	target_directory_ids: "[\"958\"]","exclude_list":"{\"user\": {\"mask\": [], \"fileid\": [977, 9225]}, \"admin\": {\"mask\": [\"__MACOSX\"], \"fileid\": []}}",
	collector_settings: "{\"hash_size\": 8, \"target_mtype\": 1, \"hashing_algorithm\": \"dhash\", \"finish_notification\": true, \"similarity_threshold\": 95}",
	files_scanned: 8,
	files_total: 8,
	files_total_size: 31704288,
	deleted_files_count: 0,
	deleted_files_size: 0,
	created_time: 1664706674,
	finished_time: 1664706687,
	updated_time: 1664706687,
	py_pid: 0,
	errors: ""
}

const task2 = {
	id: 125,
	type: "manual",
	owner: "admin",
	target_directory_ids: "[\"958\"]","exclude_list":"{\"user\": {\"mask\": [], \"fileid\": [977, 9225]}, \"admin\": {\"mask\": [\"__MACOSX\"], \"fileid\": []}}",
	collector_settings: "{\"hash_size\": 8, \"target_mtype\": 1, \"hashing_algorithm\": \"dhash\", \"finish_notification\": true, \"similarity_threshold\": 95}",
	files_scanned: 8,
	files_total: 8,
	files_total_size: 31704288,
	deleted_files_count: 0,
	deleted_files_size: 0,
	created_time: 1664706774,
	finished_time: 1664706687,
	updated_time: 1664706687,
	py_pid: 0,
	errors: ""
}

const task1Duplicated = {
	id: 127,
	type: "manual",
	owner: "admin",
	target_directory_ids: "[\"958\"]","exclude_list":"{\"user\": {\"mask\": [], \"fileid\": [977, 9225]}, \"admin\": {\"mask\": [\"__MACOSX\"], \"fileid\": []}}",
	collector_settings: "{\"hash_size\": 8, \"target_mtype\": 1, \"hashing_algorithm\": \"dhash\", \"finish_notification\": true, \"similarity_threshold\": 95, \"duplicated\":true}",
	files_scanned: 0,
	files_total: 8,
	files_total_size: 31704288,
	deleted_files_count: 0,
	deleted_files_size: 0,
	created_time: 1665136384,
	finished_time: null,
	updated_time: null,
	py_pid: 0,
	errors: ""
}

let url = ''
let axiosError = false
const urlsData = {
	get: {
		'/apps/mediadc/api/v1/tasks?recent=true': [task1, task2],
		'/apps/mediadc/api/v1/tasks?recent=false': [task1, task2],
	},
	post: {
		'/apps/mediadc/api/v1/tasks/run': { limit: false, success: true },
		'/apps/mediadc/api/v1/tasks/:id/terminate': { success: true, terminatedTask: task1 },
		'/apps/mediadc/api/v1/tasks/:id/duplicate': { success: true, duplicatedTask: task1Duplicated },
		'/apps/mediadc/api/v1/tasks/restart': { success: true, restartedTask: task2 },
	},
	delete: {
		'/apps/mediadc/api/v1/tasks/:id': { success: true, deletedTask: task2 },
	}
}

jest.mock('@nextcloud/axios', () => {
	const urlsData = {
		get: {
			'/apps/mediadc/api/v1/tasks?recent=true': [task1, task2],
			'/apps/mediadc/api/v1/tasks?recent=false': [task1, task2],
		},
		post: {
			'/apps/mediadc/api/v1/tasks/run': { limit: false, success: true },
			'/apps/mediadc/api/v1/tasks/:id/terminate': { success: true, terminatedTask: task1 },
			'/apps/mediadc/api/v1/tasks/:id/duplicate': { success: true, duplicatedTask: task1Duplicated },
			'/apps/mediadc/api/v1/tasks/restart': { success: true, restartedTask: task2 },
		},
		delete: {
			'/apps/mediadc/api/v1/tasks/:id': { success: true, deletedTask: task2 },
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
		post: (_url, _data) => {
			return new Promise((resolve) => {
				if (axiosError)
					throw Error()

				url = _url
				if (_url in urlsData.post)
					resolve({ data: urlsData.post[_url] })
				else
					resolve({ data: null })
			})
		},
		delete: (_url, _data) => {
			return new Promise((resolve) => {
				if (axiosError)
					throw Error()

				url = _url
				if (_url in urlsData.delete)
					resolve({ data: urlsData.delete[_url] })
				else
					resolve({ data: null })
			})
		},
	}
})

jest.mock('@nextcloud/router', () => ({
	generateUrl: (url) => url,
}))

describe('store/tasks tests', () => {

	it('should provide default state', () => {
		expect(tasksStore.state.tasks).toEqual([])
	})

	describe('mutations tests', () => {
		it('should provide mutation to set tasks (with sorting)', () => {

			const state = {
				tasks: [],
			}
			tasksStore.mutations.setTasks(state, [task1, task2])
			expect(state.tasks).toEqual([task2, task1])

		})

		it('should provide update mutations to the task', () => {

			const task = task1
			task.py_pid = 23435
	
			const state = {
				tasks: [task],
			}
	
			const taskUpdated = task1
			taskUpdated.py_pid = 0
	
			tasksStore.mutations.updateTask(state, taskUpdated)
	
			expect(state.tasks[0]).toBe(taskUpdated)
		})

		it('should provide delete mutation to the task', () => {

			const state = {
				tasks: [task1, task2],
			}

			tasksStore.mutations.deleteTask(state, task2)

			expect(state.tasks.length).toBe(1)
			expect(state.tasks[0]).toBe(task1)
		})
	})

	describe('getters tests' , () => {

		it('should provide correct data with getters', () => {

			const state = {
				tasks: [],
			}

			tasksStore.mutations.setTasks(state, [task1, task2])
	
			const tasks = tasksStore.getters.tasks(state)
			const taskById = tasksStore.getters.taskById(state)(task2.id)
	
			expect(tasks).toEqual([task2, task1])
			expect(taskById).toEqual(task2)
		})

	})

	describe('actions tests', () => {

		describe('getTasks action test', () => {
			it('should peform getTasks request', async () => {
				const commit = jest.fn()
				const recent = false
				const testUrl = `/apps/mediadc/api/v1/tasks?recent=${recent}`
	
				await tasksStore.actions.getTasks({ commit }, recent)
	
				expect(url).toBe(testUrl)
				expect(commit).toHaveBeenCalledWith('setTasks', [task1, task2])
			})
		})

		describe('runTask action test', () => {
			it('should perform runTask request', async () => {
				const params = {"targetDirectoryIds":"[\"958\"]","excludeList":{"user":{"mask":[],"fileid":[]},"admin":{"mask":["__MACOSX"],"fileid":[]}},"collectorSettings":{"hashing_algorithm":"dhash","similarity_threshold":"95","hash_size":"8","target_mtype":0,"finish_notification":true}}
				const testUrl = '/apps/mediadc/api/v1/tasks/run'
	
				const res = await tasksStore.actions.runTask(jest.fn(), params)
	
				expect(url).toBe(testUrl)
				expect(res.data).toEqual(urlsData.post[url])
			})
		})

		describe('terminateTask action test', () => {
			it('should perform terminateTask request', async () => {
	
				const commit = jest.fn()
				const testUrl = '/apps/mediadc/api/v1/tasks/:id/terminate'
	
				await tasksStore.actions.terminateTask({ commit }, ':id')
				
				expect(url).toBe(testUrl)
				expect(commit).toHaveBeenCalledWith('updateTask', urlsData.post[url].terminatedTask)
			})
		})

		describe('deleteTask action test', () => {
			it('should peform deleteTask request', async () => {

				const commit = jest.fn()
				const testUrl = `/apps/mediadc/api/v1/tasks/:id`

				await tasksStore.actions.deleteTask({ commit }, { id: ':id' })

				expect(url).toBe(testUrl)
				expect(commit).toHaveBeenCalledWith('deleteTask', urlsData.delete[url].deletedTask)
			})
		})

		describe('duplicateTask action test', () => {

			it('should perform duplicateTask request', async () => {

				const testUrl = '/apps/mediadc/api/v1/tasks/:id/duplicate'
				const dispatch = jest.fn((name) => new Promise((resolve) => resolve()))

				await tasksStore.actions.duplicateTask({ dispatch }, { id: ':id' }).then((res) => {
					expect(url).toBe(testUrl)
					expect(res.data.duplicatedTask).toEqual(urlsData.post[url].duplicatedTask)
					expect(dispatch).toHaveBeenCalledWith('getTasks', true)
				})

			})

		})

		describe('restartTask action test', () => {

			it('should perform restartTask request', async () => {

				const testUrl = '/apps/mediadc/api/v1/tasks/restart'
				const settings = [
					{
						"name": "hashing_algorithm",
						"value": JSON.stringify("dhash"),
						"displayName": "Hashing algorithm",
						"description": "Hashing algorithm used by Python background script"
					},
					{
						"name": "similarity_threshold",
						"value": 90,
						"displayName": "Similarity threshold",
						"description": "Hashing algorithm threshold (precision)"
					},
					{
						"name": "hash_size",
						"value": 16,
						"displayName": "Hash size",
						"description": "Computed hash size (8, 16, 32, 64)"
					},
					{
						"name": "python_limit",
						"value": 1,
						"displayName": "Running tasks limit",
						"description": "Maximum number of python background scripts running"
					},
					{
						"name": "exclude_list",
						"value": JSON.stringify({mask: [],fileid: []}),
						"displayName": "Exclude list",
						"description": "Global administrator's exclude list that applies to each task"
					},
					{
						"name": "installed",
						"value": JSON.stringify({
							"status": false,
							"installed_list": {},
							"not_installed_list": {},
							"video_required": [],
							"available_algorithms": []
						}),
						"displayName": "MediaDC installed flag",
						"description": "Installation data with current MediaDC configuration"
					},
					{
						"name": "python_command",
						"value": JSON.stringify("/usr/bin/python3"),
						"displayName": "Full path to python interpreter",
						"description": "Absolute path to the python runnable (e.g. \"/usr/bin/python3\"). Can be obtained by `which python3` command."
					},
					{
						"name": "remote_filesize_limit",
						"value": 536870912,
						"displayName": "Remote/Encrypted file size limit to process",
						"description": "Maximum file size for requesting from php core. Used when file hosts on remote NC instance or have encrypted flag. Must be less then total available RAM size."
					},
					{
						"name": "php_path",
						"value": JSON.stringify("/usr/bin/php"),
						"displayName": "Full path to PHP interpreter",
						"description": "Absolute path to the PHP executable (e.g. \"/usr/bin/php7.4\"). Can be obtained by `which php` or `which php7.4` command"
					},
				]
				const context = {
					commit: jest.fn(),
					rootGetters: {
						settingByName: (name) => settings.find(s => s.name === name),
					},
				}
				const ncAxios = require('@nextcloud/axios')
				const axiosPostSpy = jest.spyOn(ncAxios, 'post')

				await tasksStore.actions.restartTask(context, task2).then(() => {
					expect(url).toBe(testUrl)
					expect(axiosPostSpy).toHaveBeenCalled()
					expect(context.commit).toHaveBeenCalledWith('updateTask', urlsData.post[url].restartedTask)
				})

			})

		})

	})

})