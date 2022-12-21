<!--
 - @copyright Copyright (c) 2021-2022 Andrey Borysenko <andrey18106x@gmail.com>
 -
 - @copyright Copyright (c) 2021-2022 Alexander Piskun <bigcat88@icloud.com>
 -
 - @author 2021-2022 Andrey Borysenko <andrey18106x@gmail.com>
 -
 - @license AGPL-3.0-or-later
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
		<h2 style="padding: 30px 30px 0 30px; font-size: 24px;">
			{{ t('mediadc', 'MediaDC settings') }}
		</h2>
		<div v-if="settings.length > 0" class="settings">
			<NcSettingsSection :title="t('mediadc', mappedSettings.hashing_algorithm.display_name)"
				:description="t('mediadc', mappedSettings.hashing_algorithm.description)">
				<select v-if="algorithms.length > 0"
					id="hashing_algorithm"
					v-model="hashing_algorithm"
					name="hashing_algorithm"
					@change="updateHashingAlgorithm">
					<option v-for="algorithm in algorithms"
						:key="algorithm"
						:value="algorithm">
						{{ algorithm }}
					</option>
				</select>
			</NcSettingsSection>
			<NcSettingsSection :title="t('mediadc', mappedSettings.similarity_threshold.display_name)"
				:description="t('mediadc', mappedSettings.similarity_threshold.description)">
				<input id="similarity_threshold"
					v-model="mappedSettings.similarity_threshold.value"
					type="number"
					name="similarity_threshold"
					min="50"
					max="100"
					@change="saveChanges">
			</NcSettingsSection>
			<NcSettingsSection :title="t('mediadc',mappedSettings.hash_size.display_name)"
				:description="t('mediadc', mappedSettings.hash_size.description)">
				<select id="hash_size"
					v-model.number="hash_size"
					name="hash_size"
					@change="updateHashSize">
					<option v-for="hashSize in hashSizeValues" :key="hashSize" :value="hashSize">
						{{ hashSize }}
					</option>
				</select>
			</NcSettingsSection>
			<NcSettingsSection :title="t('mediadc', mappedSettings.exclude_list.display_name)"
				:description="t('mediadc', mappedSettings.exclude_list.description)">
				<template #default>
					<ul v-if="customExcludeList.length > 0" style="width: 100%; max-width: 350px; max-height: 290px; overflow-y: scroll;">
						<NcListItem v-for="(mask, index) in customExcludeList"
							:key="index"
							:force-display-actions="true"
							:title="mask">
							<template #icon>
								<span class="icon-filter" />
							</template>
							<template #actions>
								<NcActionButton v-tooltip="{ content: t('mediadc', 'Remove'), placement: 'left'}"
									icon="icon-delete"
									:close-after-click="true"
									@click="deleteCustomMask(mask)">
									{{ t('mediadc', 'Remove') }}
								</NcActionButton>
							</template>
						</NcListItem>
					</ul>
					<div v-else>
						<span>{{ t('mediadc', 'Not added') }}</span>
					</div>
					<div style="display: flex; align-items: center; margin: 20px 0 0;">
						<div v-show="addingCustomMask" style="display: flex; align-items: center;">
							<input id="custom-exclude-mask"
								ref="customExcludeMask"
								v-model="customExcludeMask"
								type="text"
								@keyup.enter="addCustomMask"
								@keyup.esc="cancelAddingCustomMask">
							<NcButton v-tooltip="t('mediadc', 'Confirm')"
								type="tertiary"
								@click="addCustomMask">
								<template #icon>
									<span class="icon-checkmark" />
								</template>
							</NcButton>
							<NcButton v-tooltip="t('mediadc', 'Decline')"
								type="tertiary"
								@click="cancelAddingCustomMask">
								<template #icon>
									<span class="icon-close" />
								</template>
							</NcButton>
						</div>
						<NcButton v-if="!addingCustomMask"
							type="secondary"
							class="mediadc-button-vue"
							@click="addNewMask">
							{{ t('mediadc', 'Add mask') }}
							<template #icon>
								<PlusThick :size="16" />
							</template>
						</NcButton>
					</div>
				</template>
			</NcSettingsSection>
			<NcSettingsSection :title="t('mediadc', mappedSettings.python_limit.display_name)"
				:description="t('mediadc', mappedSettings.python_limit.description)">
				<input id="python_limit"
					v-model.number="mappedSettings.python_limit.value"
					type="number"
					name="python_limit"
					min="1"
					max="10"
					@change="saveChanges">
			</NcSettingsSection>
			<NcSettingsSection :title="t('mediadc', mappedSettings.python_binary.display_name)"
				:description="t('mediadc', mappedSettings.python_binary.description)">
				<NcCheckboxRadioSwitch :checked.sync="python_binary" @update:checked="updatePythonBinary">
					{{ t('mediadc', 'Use pre-compiled Python binaries') }}
				</NcCheckboxRadioSwitch>
			</NcSettingsSection>
		</div>
		<div v-else>
			<NcSettingsSection :title="t('mediadc', 'Error')">
				<NcEmptyContent style="margin-top: 0;"
					:title="t('mediadc', 'Settings list is empty')"
					:description="t('mediadc', 'Seems like database not initialized properly. Try to re-enable the app')">
					<template #icon>
						<AlertCircleOutline />
					</template>
				</NcEmptyContent>
			</NcSettingsSection>
		</div>
		<NcSettingsSection :title="t('mediadc', 'Bug report')">
			<BugReport />
		</NcSettingsSection>
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import { showError, showSuccess, showWarning } from '@nextcloud/dialogs'

import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton.js'
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import NcEmptyContent from '@nextcloud/vue/dist/Components/NcEmptyContent.js'
import NcListItem from '@nextcloud/vue/dist/Components/NcListItem.js'
import NcSettingsSection from '@nextcloud/vue/dist/Components/NcSettingsSection.js'
import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch.js'

import PlusThick from 'vue-material-design-icons/PlusThick.vue'
import AlertCircleOutline from 'vue-material-design-icons/AlertCircleOutline.vue'

import BugReport from './BugReport.vue'

export default {
	name: 'AdminSettings',
	components: {
		NcActionButton,
		BugReport,
		NcButton,
		NcEmptyContent,
		NcListItem,
		PlusThick,
		NcSettingsSection,
		NcCheckboxRadioSwitch,
		AlertCircleOutline,
	},
	data() {
		return {
			settings: [],
			algorithms: [],
			mappedSettings: {},
			hashing_algorithm: null,
			hash_size: null,
			customExcludeList: [],
			customExcludeMask: '',
			addingCustomMask: false,
			hashSizeValues: [8, 16, 32, 64],
			python_binary: true,
		}
	},
	beforeMount() {
		this.getSettings()
	},
	methods: {
		getSettings() {
			axios.get(generateUrl('/apps/mediadc/api/v1/settings')).then(res => {
				this.settings = res.data
				this.settings.forEach(setting => {
					this.mappedSettings[setting.name] = setting
				})
				this.algorithms = ['average', 'dhash', 'phash', 'whash']
				this.hashing_algorithm = JSON.parse(this.mappedSettings.hashing_algorithm.value)
				this.hash_size = this.mappedSettings.hash_size.value
				this.customExcludeList = JSON.parse(this.mappedSettings.exclude_list.value).mask
				this.python_binary = JSON.parse(this.mappedSettings.python_binary.value)
			})
		},
		saveChanges() {
			axios.put(generateUrl('/apps/mediadc/api/v1/settings'), { settings: this.settings })
				.then(res => {
					if (res.data.success) {
						showSuccess(this.t('mediadc', 'Settings successfully updated'))
					}
				})
				.catch(err => {
					console.debug(err)
					showError(this.t('mediadc', 'Some error occurred while updating settings'))
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
		updatePythonBinary() {
			this.mappedSettings.python_binary.value = JSON.stringify(this.python_binary)
			this.saveChanges()
		},
		updateHashingAlgorithm() {
			if (confirm(this.t('mediadc', 'The photo and video hashes will be cleaned before hashing algorithm is changed.\nContinue?'))) {
				this.truncatePhotosAndVideos().then(() => {
					this.mappedSettings.hashing_algorithm.value = JSON.stringify(this.hashing_algorithm)
					this.updateSetting(this.mappedSettings.hashing_algorithm.name, this.mappedSettings.hashing_algorithm).then(res => {
						if (res.data.success) {
							showSuccess(this.t('mediadc', 'Hashing algorithm successfully updated'))
							this.saveChanges()
						} else {
							showError(res.data.message)
						}
					}).catch(err => {
						console.debug(err)
						showError(this.t('mediadc', 'An error occurred while updating setting. Try again'))
					})
				}).catch(err => {
					console.debug(err)
					showError(this.t('mediadc', 'Some error occurred while changing hashing algorithm'))
					this.hashing_algorithm = JSON.parse(this.mappedSettings.hashing_algorithm.value)
				})
			} else {
				this.hashing_algorithm = JSON.parse(this.mappedSettings.hashing_algorithm.value) || 'dhash'
			}
		},
		updateHashSize() {
			if (confirm(this.t('mediadc', 'The photo and video hashes would be cleaned before changing hash size.\nContinue?'))) {
				this.truncatePhotosAndVideos().then(() => {
					this.mappedSettings.hash_size.value = JSON.stringify(this.hash_size)
					this.updateSetting(this.mappedSettings.hash_size.name, this.mappedSettings.hash_size).then(res => {
						if (res.data.success) {
							showSuccess(this.t('mediadc', 'Hash size successfully updated'))
							this.saveChanges()
						} else {
							showError(res.data.message)
						}
					}).catch(err => {
						console.debug(err)
						showError(this.t('mediadc', 'An error occurred when updating the setting. Try again'))
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
			this.updateSetting(this.mappedSettings.exclude_list.name, this.mappedSettings.exclude_list)
				.catch(err => {
					console.debug(err)
					showError(this.t('mediadc', 'Some error occurred while updating setting. Try again'))
				})
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
					this.updateExcludeList()
				} else {
					showWarning(this.t('mediadc', 'This mask already exists!'))
				}
			} else {
				showWarning(this.t('mediadc', 'Enter custom mask!'))
			}
		},
		cancelAddingCustomMask() {
			this.customExcludeMask = ''
			this.addingCustomMask = false
		},
		deleteCustomMask(mask) {
			const maskIndex = this.customExcludeList.findIndex(m => m === mask)
			this.customExcludeList.splice(maskIndex, 1)
			this.updateExcludeList()
		},
	},
}
</script>
