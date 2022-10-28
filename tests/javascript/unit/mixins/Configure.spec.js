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

import MockComponent from '../stubs/MockComponent.vue'
import { createLocalVue, mount } from '@vue/test-utils'
import Configure from '../../../../src/mixins/Configure'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

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


let url = ''
let axiosError = false
const installed = {"success":true,"installed":true,"required":[],"video_required":[],"optional":[],"boost":[],"available_algorithms":["average","dhash","phash","whash"],"installed_list":{"required":{"numpy":{"package":"numpy","location":"local","version":"1.23.3"},"PIL":{"package":"pillow","location":"local","version":"9.2.0"}},"optional":{"scipy":{"package":"scipy","location":"local","version":"1.9.0"},"pywt":{"package":"pywavelets","location":"local","version":"1.3.0"},"pillow_heif":{"package":"pillow_heif","location":"local","version":"0.6.0"},"cryptography":{"package":"cryptography","location":"global","version":"3.4.8"},"nacl":{"package":"pynacl","location":"global","version":"1.5.0"}},"boost":{"hexhamming":{"package":"hexhamming","location":"local","version":"2.2.3"}}},"errors":[],"warnings":[]}
const urlsData = {
	get: {
		'/apps/mediadc/api/v1/python/install': installed,
		'/apps/mediadc/api/v1/python/check': installed,
	},
	post: {
		'/apps/mediadc/api/v1/python/install': installed,
		'/apps/mediadc/api/v1/python/delete': installed,
		'/apps/mediadc/api/v1/python/update': installed,
	},
	put: {
		'/apps/mediadc/api/v1/settings/name/installed': { success: true, updated_setting: {} },
	},
}

jest.mock('@nextcloud/axios', () => {
	const urlsData = {
		get: {
			'/apps/mediadc/api/v1/python/install': installed,
			'/apps/mediadc/api/v1/python/check': installed,
		},
		post: {
			'/apps/mediadc/api/v1/python/install': installed,
			'/apps/mediadc/api/v1/python/delete': installed,
			'/apps/mediadc/api/v1/python/update': installed,
		},
		put: {
			'/apps/mediadc/api/v1/settings/name/installed': { success: true, updated_setting: {} },
		},
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
		put: (_url, _data) => {
			return new Promise((resolve) => {
				if (axiosError)
					throw Error()

				url = _url
				if (_url in urlsData.put)
					resolve({ data: urlsData.put[_url] })
				else
					resolve({ data: null })
			})
		},
	}
})

jest.mock('../store/__mocks__')
import settingsData from '../store/__mocks__/settings'

describe('mixins/Configure test', () => {

	const wrapper = mount(MockComponent, {
		localVue,
		router,
		mixins: [Configure],
		methods: {
			getSettings: jest.fn().mockReturnValue(settingsData),
			getSettingByName: jest.fn((name) => settingsData.find(s => s.name === name)),
		},
	})
	router.push({ name: 'configuration' })

	it('should be true', () => {
		expect(wrapper.isVueInstance).toBeTruthy()
		expect(wrapper.emitted()['update:loading']).toBeTruthy()
		expect(wrapper.emitted()['update:loading'].length).toBe(2)
		expect(wrapper.emitted()['update:loading'][1][0]).toBe(true)
		wrapper.vm.$emit('update:loading', false)
		expect(wrapper.emitted()['update:loading'].length).toBe(3)
		expect(wrapper.emitted()['update:loading'][2][0]).toBe(false)
		expect(router.currentRoute.name).toBe('configuration')
	})

	it('should perform install request', async () => {
		const ncAxios = require('@nextcloud/axios')
		const ncAxiosGetSpy = jest.spyOn(ncAxios, 'get')
		const testUrl = '/apps/mediadc/api/v1/python/install'
		const parsePythonResponseDataSpy = jest.spyOn(wrapper.vm, 'parsePythonResponseData')
		await wrapper.vm.install().then(() => {
			expect(url).toBe(testUrl)
			expect(wrapper.vm.installing).toBe(true)
			expect(ncAxiosGetSpy).toHaveBeenCalled()
			expect(ncAxiosGetSpy).toHaveBeenCalledWith('/apps/mediadc/api/v1/python/install')
			expect(parsePythonResponseDataSpy).toHaveBeenCalled()
			expect(parsePythonResponseDataSpy).toHaveBeenCalledWith({ data: urlsData.get[url] })
		})
	})

	it('should perform updateInstalledSetting request', async () => {
		const ncAxios = require('@nextcloud/axios')
		const ncAxiosPutSpy = jest.spyOn(ncAxios, 'put')
		await wrapper.vm.updateInstalledSetting().then(() => {
			expect(ncAxiosPutSpy).toHaveBeenCalled()
			expect(ncAxiosPutSpy).toHaveBeenCalledWith('/apps/mediadc/api/v1/settings/name/installed', { setting: null })
		})
	})
})