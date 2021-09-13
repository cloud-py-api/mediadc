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

import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { showError, showSuccess } from '@nextcloud/dialogs'

export default {
	created() {
		this.$emit('update:loading', true)
		this.getSettings()
		if (this.$route.name !== 'configuration') {
			this.$emit('update:loading', true)
		}
		this.getInstalledSetting()
	},
	data() {
		return {
			installed_setting: null,
			installed: false,
			installing: false,
			checking: false,
			updating: false,
			installed_packages_list: {},
			available_algorithms: [],
			video_required: [],
			packages_list: [],
			errors: [],
			warnings: [],
		}
	},
	methods: {
		async getSettings() {
			return axios.get(generateUrl('/apps/mediadc/api/v1/settings')).then(res => {
				this.$store.dispatch('setSettings', res.data)
				this.$emit('update:loading', false)
			})
		},
		async getInstalledSetting() {
			axios.get(generateUrl('/apps/mediadc/api/v1/settings/name/installed')).then(res => {
				if (res.data.success) {
					this.$store.dispatch('updateSetting', res.data.setting)
					this.installed_setting = res.data.setting
					this.installed_setting.value = JSON.parse(this.installed_setting.value)
					this.installed = res.data.setting.value.status
					this.packages_list = this.installed_setting.value.list
					this.installed_packages_list = {
						required: this.installed_setting.value.installed_list.required,
						optional: this.installed_setting.value.installed_list.optional,
						boost: this.installed_setting.value.installed_list.boost,
					}
					this.available_algorithms = this.installed_setting.value.available_algorithms
					this.video_required = this.installed_setting.value.video_required
					if (!this.installed && this.$route.name !== 'configuration') {
						this.$router.push({ name: 'configuration' })
					} else {
						this.$emit('update:loading', false)
					}
				}
			})
		},
		async install() {
			this.installing = true
			axios.get(generateUrl('/apps/mediadc/api/v1/python/install')).then(res => {
				if (res.data.success) {
					this.installed = true
					this.parsePythonResponseData(res)
					this.updateInstalledSetting().then(() => {
						this.installing = false
						showSuccess(t('mediadc', 'Installation successfully finished!'))
					}).catch(() => {
						this.installing = false
						showError(t('mediadc', 'Installation failed. Try again.'))
					})
				} else {
					this.installing = false
				}
			})
		},
		async updateInstalledSetting() {
			return axios.put(generateUrl('/apps/mediadc/api/v1/settings/name/installed'), { setting: this.installed_setting })
		},
		async installDepsList(listName) {
			this.updating = true
			axios.post(generateUrl(`/apps/mediadc/api/v1/python/install/${listName}`)).then(res => {
				this.parsePythonResponseData(res)
				this.updateInstalledSetting().then(() => {
					this.updating = false
					showSuccess(t('mediadc', 'Package list successfully installed'))
				}).catch(() => {
					this.updating = false
					showError(t('mediadc', 'Package list installation failed'))
				})
			})
		},
		async deleteDepsList(listName) {
			this.updating = true
			axios.post(generateUrl('/apps/mediadc/api/v1/python/delete'),
				{ packagesList: Object.values(this.packages_list[listName]).filter(item => item.location !== 'global').map(item => item.package) }).then(res => {
				this.updating = false
				this.parsePythonResponseData(res)
				this.updateInstalledSetting()
			})
		},
		async updateDepsList(listName) {
			this.updating = true
			axios.post(generateUrl('/apps/mediadc/api/v1/python/update'),
				{ packagesList: Object.values(this.packages_list[listName]).filter(item => item.location !== 'global').map(item => item.package) }).then(res => {
				this.updating = false
				this.parsePythonResponseData(res)
				this.updateInstalledSetting()
				showSuccess(t('mediadc', 'Packages successfully updated'))
			}).catch(err => {
				console.debug(err)
				showError(t('mediadc', 'Packages update failed'))
			})
		},
		async check() {
			this.checking = true
			axios.get(generateUrl('/apps/mediadc/api/v1/python/check')).then(res => {
				this.checking = false
				this.parsePythonResponseData(res)
				this.updateInstalledSetting()
			}).catch(err => {
				console.debug(err)
				showError(t('mediadc', 'Dependencies checking failed. Try again.'))
				this.checking = false
			})
		},
		parsePythonResponseData(res) {
			this.installed = res.data.installed
			this.installed_setting.value.status = res.data.installed
			this.installed_setting.value.list = res.data.list
			this.installed_setting.value.installed_list = {
				required: res.data.required,
				optional: res.data.optional,
				boost: res.data.boost,
			}
			this.installed_setting.value.available_algorithms = res.data.available_algorithms
			this.installed_setting.value.video_required = res.data.video_required
			this.$store.dispatch('setSetting', this.installed_setting)
			this.packages_list = res.data.list
			this.installed_packages_list = {
				required: res.data.required,
				optional: res.data.optional,
				boost: res.data.boost,
			}
			this.available_algorithms = res.data.available_algorithms
			this.video_required = res.data.video_required
			this.errors = res.data.errors
			this.warnings = res.data.warnings
		},
		finishConfiguration() {
			this.$emit('update:loading', true)
			this.$router.push({ name: 'collector' })
		},
	},
}
