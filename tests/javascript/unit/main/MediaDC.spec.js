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

import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import MediaDC from '../../../../src/MediaDC.vue'

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

let axiosError = false

jest.mock('@nextcloud/axios', () => {
	const urlsData = {
		'/apps/mediadc/api/v1/tasks?recent=true': [task1, task2],
		'/apps/mediadc/api/v1/tasks?recent=false': [task1, task2],
		'/apps/mediadc/api/v1/tasks/run': { limit: false, success: true },
		'/apps/mediadc/api/v1/tasks/:id/terminate': { success: true, terminatedTask: task1 },
	}
	return {
		get: (_url) => {
			return new Promise((resolve) => {
				if (axiosError)
					throw Error()
	
				if (_url in urlsData)
					resolve({ data: urlsData[_url] })
				else
					resolve({ data: null })
			})
		},
		post: (_url, _data) => {
			return new Promise((resolve) => {
				if (axiosError)
					throw Error()
	
				if (_url in urlsData)
					resolve({ data: urlsData[_url] })
				else
					resolve({ data: null })
			})
		},
		delete: (_url, _data) => {
			return new Promise((resolve) => {
				if (axiosError)
					throw Error()
	
				if (_url in urlsData)
					resolve({ data: urlsData[_url] })
				else
					resolve({ data: null })
			})
		},
	}
})
jest.mock('@nextcloud/dialogs', () => ({
	showSuccess: (msg) => console.log(`[Success] ${msg}`),
	showWarning: (msg) => console.log(`[Warning] ${msg}`),
	showError: (msg) => console.log(`[Error] ${msg}`),
	showInfo: (msg) => console.log(`[Info] ${msg}`),
}))
jest.mock('@nextcloud/event-bus')
jest.mock('@nextcloud/l10n', () => ({
	translate: jest.fn((app, msg) => msg),
	translatePlural: jest.fn((app, msgS, msgN, len) => msgS),
	getLanguage: () => 'en',
	getLocale: () => 'en',
}))
jest.mock('@nextcloud/router', () => ({
	generateUrl: (url) => url,
}))

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const Collector = () => import('../../../../src/views/Collector.vue')
const CollectorDetails = () => import('../../../../src/views/CollectorDetails.vue')
const Resolved = () => import('../../../../src/views/Resolved.vue')
const Configuration = () => import('../../../../src/views/Configuration.vue')
const routes = [
	{
		path: '/',
		component: Collector,
		name: 'collector',
		props: (route) => ({
			rootTitle: 'MediaDC',
		}),
	},
	{
		path: '/tasks/:taskId',
		component: CollectorDetails,
		name: 'collectorDetails',
		props: (route) => ({
			rootTitle: 'MediaDC Task Details',
			taskId: route.params.taskId,
		}),
	},
	{
		path: '/configuration',
		component: Configuration,
		name: 'configuration',
		props: (route) => ({
			rootTitle: 'MediaDC Configuration',
		}),
	},
	{
		path: '/resolved',
		component: Resolved,
		name: 'resolved',
		props: (route) => ({
			rootTitle: 'MediaDC Resolved files',
		}),
	},
]

const router = new VueRouter({ routes: routes })

describe('MediaDC.vue test', () => {
	let wrapper
	let store
	let mutations
	let actions
	let getters

	beforeEach(() => {
		mutations = {
			setSettings: jest.fn(),
			setSetting: jest.fn(),
			updateSetting: jest.fn(),
			setDetailsGridSize: jest.fn(),
			setDeleteFileConfirmation: jest.fn(),
			setAutoOpenNextGroup: jest.fn(),
		}
		actions = {
			getTasks: jest.fn(),
			getSettings: jest.fn(),
			getSettingByName: jest.fn()
		}
		getters = {
			settings: jest.fn(),
			settingByName: jest.fn(),
			detailsGridSize: jest.fn(),
			deleteFileConfirmation: jest.fn(),
			autoOpenNextGroup: jest.fn()
		}
		store = new Vuex.Store({
			mutations,
			actions,
			getters
		})

		wrapper = mount(MediaDC, {
			localVue,
			store,
			router,
			mocks: {
				t: (app, msg) => msg,
			},
			stubs: ['router-link', 'router-view']
		})
	})

	it('MediaDC component is a Vue instance', () => {
		expect(wrapper.isVueInstance).toBeTruthy()
	})

	it('MediaDC route name is correct', () => {
		expect(wrapper.vm.$route.name).toBe('collector')
	})

	it('MediaDC Vue component rendered correctly', () => {
		expect(wrapper.find('.app-navigation').exists()).toBe(true)
		expect(wrapper.find('#app-settings').exists()).toBe(true)
		expect(wrapper.find('.app-content').exists()).toBe(true)
		expect(wrapper.find('router-view-stub').exists()).toBe(true)
	})

})