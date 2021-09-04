<!--
 - @copyright 2021 Andrey Borysenko <andrey18106x@gmail.com>
 - @copyright 2021 Alexander Piskun <bigcat88@icloud.com>
 -
 - @author Andrey Borysenko <andrey18106x@gmail.com>
 -
 - @license GNU AGPL version 3 or any later version
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<template>
	<div class="admin-settings">
		<h2>MediaDC</h2>
		<div v-if="settings.length > 0" class="settings">
			<div class="setting">
				<div v-if="algorithms.length > 0">
					<label for="hashing_algorithm">
						{{ mappedSettings.hashing_algorithm.display_name }}:
					</label>
					<select id="hashing_algorithm"
						v-model="hashing_algorithm"
						name="hashing_algorithm"
						@change="updateHashingAlgorithm">
						<option v-for="algorithm in algorithms"
							:key="algorithm"
							:value="algorithm">
							{{ algorithm }}
						</option>
					</select>
				</div>
				<div v-else>
					<p style="color: #fd3838; margin: 10px 0; display: flex; align-items: center;">
						{{ t('mediadc', 'No available algorithms. Configure application dependencies on Configuration page') }}
						<a :href="getConfigurationPageLink()" style="display: inline-flex; margin: 0 10px;">
							<span class="icon-external" />
						</a>
					</p>
				</div>
				<p class="setting-description">
					{{ mappedSettings.hashing_algorithm.description }}
				</p>
			</div>
			<div class="setting">
				<label for="similarity_threshold">
					{{ mappedSettings.similarity_threshold.display_name }}:
				</label>
				<input id="similarity_threshold"
					v-model="mappedSettings.similarity_threshold.value"
					type="number"
					name="similarity_threshold"
					min="50"
					max="100">
				<p class="setting-description">
					{{ mappedSettings.similarity_threshold.description }}
				</p>
			</div>
			<div class="setting">
				<label for="hash_size">
					{{ mappedSettings.hash_size.display_name }}:
				</label>
				<select id="hash_size"
					v-model="hash_size"
					name="hash_size"
					@change="updateHashSize">
					<option :value="8">
						8
					</option>
					<option :value="16">
						16
					</option>
					<option :value="32">
						32
					</option>
					<option :value="64">
						64
					</option>
				</select>
			</div>
			<div class="setting">
				<h3>{{ mappedSettings.exclude_list.display_name }}</h3>
				<div class="block">
					<div v-if="customExcludeList.length > 0" class="custom-mask-list">
						<div v-for="(mask, index) in customExcludeList" :key="index" class="custom-mask">
							<span>{{ mask }}</span>
							<span class="icon-delete" style="margin: 0 10px; cursor: pointer;" @click="deleteCustomMask(mask)" />
						</div>
					</div>
					<div v-else>
						<span>{{ t('mediadc', 'Not added') }}</span>
					</div>
				</div>
				<div style="display: flex; align-items: center; margin: 10px 0 0;">
					<div v-show="addingCustomMask" style="display: flex; align-items: center;">
						<input id="custom-exclude-mask"
							ref="customExcludeMask"
							v-model="customExcludeMask"
							type="text"
							@keyup.enter="addCustomMask"
							@keyup.esc="cancelAddingCustomMask">
						<span class="icon-checkmark" style="width: 18px; height: 18px; margin: 0 5px; display: inline-block; cursor: pointer;" @click="addCustomMask" />
						<span class="icon-close" style="width: 18px; height: 18px; margin: 0 5px; display: inline-block; cursor: pointer;" @click="cancelAddingCustomMask" />
					</div>
					<button v-if="!addingCustomMask" @click="addNewMask">
						<span class="icon-add" />
						<span>{{ t('mediadc', 'Add mask') }}</span>
					</button>
				</div>
				<button v-if="customExcludeListChanged()" @click="updateExcludeList">
					{{ t('mediadc', 'Save changes') }}
				</button>
			</div>
			<div class="setting">
				<label for="python_limit">
					{{ mappedSettings.python_limit.display_name }}:
				</label>
				<input id="python_limit"
					v-model="mappedSettings.python_limit.value"
					type="number"
					name="python_limit"
					min="1"
					max="10">
				<p class="setting-description">
					{{ mappedSettings.python_limit.description }}
				</p>
			</div>
			<div class="setting">
				<label for="python_command">
					{{ mappedSettings.python_command.display_name }}:
				</label>
				<input id="python_command"
					v-model="mappedSettings.python_command.value"
					type="text"
					name="python_command">
				<p class="setting-description">
					{{ mappedSettings.python_command.description }}
				</p>
			</div>
			<div class="setting">
				<label for="remote_filesize_limit">
					{{ mappedSettings.remote_filesize_limit.display_name }}
					({{ t('mediadc', 'in GBytes') }}):
				</label>
				<input id="remote_filesize_limit"
					v-model="remote_filesize_limit"
					type="number"
					name="remote_filesize_limit"
					min="3"
					step="0.1"
					@input="updateRemoteFilesizeLimit">
				<p class="setting-description">
					{{ mappedSettings.remote_filesize_limit.description }}
				</p>
			</div>
			<button v-if="!updating" style="margin: 10px 0 20px;" @click="saveChanges">
				Save changes
			</button>
			<button v-else style="margin: 10px 0 20px;">
				<span class="icon-loading" />
			</button>
		</div>
		<div v-else>
			<strong>Settings list is empty</strong>
		</div>
	</div>
</template>

<script>
import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { showError, showSuccess, showWarning } from '@nextcloud/dialogs'

export default {
	name: 'AdminSettings',
	data() {
		return {
			settings: [],
			algorithms: [],
			updating: false,
			mappedSettings: {},
			remote_filesize_limit: null,
			hashing_algorithm: null,
			hash_size: null,
			customExcludeList: [],
			customExcludeMask: '',
			addingCustomMask: false,
		}
	},
	beforeMount() {
		this.getSettings()
	},
	methods: {
		async getSettings() {
			axios.get(generateUrl('/apps/mediadc/api/v1/settings')).then(res => {
				this.settings = res.data
				this.settings.forEach(setting => {
					this.mappedSettings[setting.name] = setting
				})
				this.algorithms = JSON.parse(this.mappedSettings.installed.value).available_algorithms
				this.hashing_algorithm = JSON.parse(this.mappedSettings.hashing_algorithm.value)
				this.hash_size = this.mappedSettings.hash_size.value
				this.customExcludeList = JSON.parse(this.mappedSettings.exclude_list.value).mask
				this.remote_filesize_limit = this.fromBytesToGBytes(Number(this.mappedSettings.remote_filesize_limit.value))
			})
		},
		async saveChanges() {
			this.updating = true
			axios.put(generateUrl('/apps/mediadc/api/v1/settings'), { settings: this.settings }).then(res => {
				this.mappedSettings.exclude_list.value = JSON.stringify({
					mask: this.customExcludeList,
					fileid: [],
				})
				this.updating = false
				showSuccess(t('mediadc', 'Settings successfully updated'))
			}).catch(err => {
				console.debug(err)
				this.updating = false
				showError(t('mediadc', 'Some error occured while updating settings'))
			})
		},
		async truncatePhotosAndVideos() {
			return axios.post(generateUrl('/apps/mediadc/api/v1/settings/truncate/all'))
		},
		async updateSetting(name, setting) {
			return axios.put(generateUrl(`/apps/mediadc/api/v1/settings/name/${name}`), { setting })
		},
		fromBytesToGBytes(bytes) {
			return bytes / Math.pow(1024, 3)
		},
		fromGBytesToBytes(GBytes) {
			return GBytes * Math.pow(1024, 3)
		},
		updateRemoteFilesizeLimit() {
			this.mappedSettings.remote_filesize_limit.value = this.fromGBytesToBytes(Number(this.remote_filesize_limit))
		},
		updateHashingAlgorithm() {
			if (confirm(t('mediadc', 'The photo and video hashes would be cleaned before changing hashing_algorithm.\nContinue?'))) {
				this.truncatePhotosAndVideos().then(() => {
					this.mappedSettings.hashing_algorithm.value = JSON.stringify(this.hashing_algorithm)
					this.updateSetting(this.mappedSettings.hashing_algorithm.name, this.mappedSettings.hashing_algorithm).then(res => {
						if (res.data.success) {
							showSuccess(t('mediadc', 'Hashing algorithm successfully updated'))
						} else {
							showError(res.data.message)
						}
					}).catch(err => {
						console.debug(err)
						showError(t('mediadc', 'Some error occured while updateing setting. Try again'))
					})
				}).catch(err => {
					console.debug(err)
					showError(t('mediadc', 'Some error occured while changing hashing algorithm'))
					this.hashing_algorithm = JSON.parse(this.mappedSettings.hashing_algorithm.value)
				})
			} else {
				this.hashing_algorithm = JSON.parse(this.mappedSettings.hashing_algorithm.value)
			}
		},
		updateHashSize() {
			if (confirm(t('mediadc', 'The photo and video hashes would be cleaned before changing hash size.\nContinue?'))) {
				this.truncatePhotosAndVideos().then(() => {
					this.mappedSettings.hash_size.value = JSON.stringify(this.hash_size)
					this.updateSetting(this.mappedSettings.hash_size.name, this.mappedSettings.hash_size).then(res => {
						if (res.data.success) {
							showSuccess(t('mediadc', 'Hash size successfully updated'))
						} else {
							showError(res.data.message)
						}
					}).catch(err => {
						console.debug(err)
						showError(t('mediadc', 'Some error occured while updateing setting. Try again'))
					})
				})
			} else {
				this.hash_size = JSON.parse(this.mappedSettings.hash_size.value)
			}
		},
		updateExcludeList() {
			this.mappedSettings.exclude_list.value = JSON.stringify({
				mask: this.customExcludeList,
				fileid: [],
			})
			this.updateSetting(this.mappedSettings.exclude_list.name, this.mappedSettings.exclude_list).then(() => {
				showSuccess(t('mediadc', 'Setting successfully updated'))
			}).catch(err => {
				console.debug(err)
				showError(t('mediadc', 'Some error occured while updating setting. Try again'))
			})
		},
		getConfigurationPageLink() {
			return generateUrl('/apps/mediadc/configuration')
		},
		addNewMask() {
			this.addingCustomMask = true
			setTimeout(() => {
				this.$refs.customExcludeMask.focus()
			}, 100)
		},
		addCustomMask() {
			if (this.customExcludeMask.length > 0) {
				if (this.customExcludeList.findIndex(mask => mask === this.customExcludeMask) === -1) {
					this.customExcludeList.push(this.customExcludeMask)
					this.customExcludeMask = ''
					this.addingCustomMask = false
				} else {
					showWarning(t('mediadc', 'This mask already exists!'))
				}
			} else {
				showWarning(t('mediadc', 'Enter custom mask!'))
			}
		},
		cancelAddingCustomMask() {
			this.customExcludeMask = ''
			this.addingCustomMask = false
		},
		deleteCustomMask(mask) {
			const maskIndex = this.customExcludeList.findIndex(m => m === mask)
			this.customExcludeList.splice(maskIndex, 1)
		},
		customExcludeListChanged() {
			if (Array.from(this.customExcludeList).length !== JSON.parse(this.mappedSettings.exclude_list.value).mask.length) {
				return true
			} else {
				return !(Array.from(this.customExcludeList).every((value, index) => value === JSON.parse(this.mappedSettings.exclude_list.value).mask[index]))
			}
		},
	},
}
</script>

<style scoped>
.admin-settings {
	margin: 20px;
}

.setting {
	padding: 5px 0 10px;
	border-bottom: 1px solid #dadada;
	margin: 10px 0;
}

body.theme--dark .setting,
body.theme--dark .block,
body.theme--dark .custom-mask {
	border-color: #262626;
}

.setting-description {
	color: #666;
}

.block {
	max-width: 100%;
	height: 100%;
	max-height: 200px;
	overflow-y: scroll;
	padding: 10px 0 10px 10px;
	border-top: 1px solid #dadada;
	border-bottom: 1px solid #dadada;
}

.custom-mask {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 5px 0;
	border-bottom: 1px solid #dadada;
}

.custom-mask-list {
	display: inline-flex;
	flex-direction: column;
}
</style>
