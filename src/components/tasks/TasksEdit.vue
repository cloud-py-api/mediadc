<!--
 - @copyright Copyright (c) 2021-2022 Andrey Borysenko <andrey18106x@gmail.com>
 -
 - @copyright Copyright (c) 2021-2022 Alexander Piskun <bigcat88@icloud.com>
 -
 - @author Andrey Borysenko <andrey18106x@gmail.com>
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
	<transition name="fade">
		<div class="block-wrapper">
			<div class="edit-task-block">
				<div class="edit-task-close" @click="closeEditTaskDialog()" />
				<h2>{{ t('mediadc', 'Edit task') }}</h2>
				<div class="selection-container">
					<div class="block target-directories-block">
						<h3>{{ t('mediadc', 'Target directories') }}</h3>
						<div v-if="targetDirectoriesIds.length > 0">
							<div v-for="fileid in targetDirectoriesIds" :key="fileid" class="selected-target-directories-list">
								<div class="target-directory">
									<span style="overflow-y: scroll; white-space: nowrap;">{{ targetDirectoriesPaths[fileid] }}</span>
									<Button v-tooltip="{ content: t('mediadc', 'Remove'), placement: 'left'}"
										type="tertiary"
										@click="removeTargetDirectory(fileid)">
										<template #icon>
											<span class="icon-delete" />
										</template>
									</Button>
								</div>
							</div>
						</div>
						<div v-else>
							<span>{{ t('mediadc', 'Not selected') }}</span>
						</div>
						<br>
						<Button class="mediadc-button-vue"
							:aria-label="t('mediadc', 'Select target directory')"
							@click="openDirectoriesExplorer">
							<template #icon>
								<PlusThick :size="16" />
							</template>
							{{ t('mediadc', 'Select') }}
						</Button>
					</div>
					<div class="block">
						<h3>{{ t('mediadc', 'Exclude directories') }}</h3>
						<div v-if="excludeDirectoriesPaths.length > 0">
							<div v-for="fileid in Object.keys(excludeFileIds)" :key="fileid" class="selected-excluded-directories-list">
								<div class="target-directory">
									<span style="overflow-y: scroll; white-space: nowrap;">{{ excludeFileIds[fileid] }}</span>
									<Button v-tooltip="{ content: t('mediadc', 'Remove'), placement: 'left'}"
										type="tertiary"
										@click="removeExcludeDirectory(fileid)">
										<template #icon>
											<span class="icon-delete" />
										</template>
									</Button>
								</div>
							</div>
						</div>
						<div v-else>
							<span>{{ t('mediadc', 'Not selected') }}</span>
						</div>
						<br>
						<Button class="mediadc-button-vue"
							:aria-label="t('mediadc', 'Select exclude directory')"
							@click="openExcludeExplorer">
							<template #icon>
								<PlusThick :size="16" />
							</template>
							{{ t('mediadc', 'Select') }}
						</Button>
					</div>
				</div>
				<div class="selection-container">
					<div class="block">
						<h3>{{ t('mediadc', 'Custom exclude mask') }}</h3>
						<div v-if="customExcludeList.length > 0" class="custom-masks-list">
							<div v-for="(mask, index) in customExcludeList" :key="index" class="custom-mask">
								<span>{{ mask }}</span>
								<Button v-tooltip="{ content: t('mediadc', 'Remove'), placement: 'left'}"
									type="tertiary"
									@click="deleteCustomMask(mask)">
									<template #icon>
										<span class="icon-delete" />
									</template>
								</Button>
							</div>
						</div>
						<div v-else>
							<span>{{ t('mediadc', 'Not added') }}</span>
						</div>
						<div v-if="addingCustomMask" style="display: flex; align-items: center;">
							<input id="custom-exclude-mask"
								ref="customExcludeMask"
								v-model="customExcludeMask"
								type="text"
								@keyup.enter="addCustomMask"
								@keyup.esc="cancelAddingCustomMask">
							<Button v-tooltip="t('mediadc', 'Confirm')"
								type="tertiary"
								@click="addCustomMask">
								<template #icon>
									<span class="icon-checkmark" />
								</template>
							</Button>
							<Button v-tooltip="t('mediadc', 'Decline')"
								type="tertiary"
								@click="cancelAddingCustomMask">
								<template #icon>
									<span class="icon-close" />
								</template>
							</Button>
						</div>
						<div style="display: flex; align-items: center; margin: 20px 0;">
							<Button class="mediadc-button-vue" @click="addNewMask">
								<template #icon>
									<PlusThick :size="16" />
								</template>
								<span>{{ t('mediadc', 'Add mask') }}</span>
							</Button>
						</div>
					</div>
					<div class="block">
						<h3 style="margin: 5px 0;">
							{{ t('mediadc', 'Target Mime Type') }}
						</h3>
						<select id="target_mtype"
							v-model="targetMimeType"
							name="target_mtype">
							<option :value="0">
								{{ t('mediadc', 'Photos') }}
							</option>
							<option :value="1">
								{{ t('mediadc', 'Videos') }}
							</option>
							<option :value="2">
								{{ t('mediadc', 'Photos and Videos') }}
							</option>
						</select>
						<h3 style="margin: 5px 0;">
							{{ t('mediadc', 'Similarity threshold') }}
						</h3>
						<input v-model="similarity_threshold"
							type="number"
							min="50"
							max="100"
							style="margin: 0 0 10px;">
					</div>
				</div>
				<div class="create-task-actions">
					<Button class="mediadc-button-vue"
						:aria-label="t('mediadc', 'Create and Run new Task')"
						:disabled="runningTask || Object.keys(targetDirectoriesPaths).length === 0"
						@click="restartTask">
						<template #default>
							{{ t('mediadc', 'Restart task') }}
						</template>
						<template v-if="runningTask" #icon>
							<span class="icon-loading" />
						</template>
					</Button>
					<CheckboxRadioSwitch :checked.sync="finishNotification">
						{{ t('mediadc', 'Finish notification') }}
					</CheckboxRadioSwitch>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import axios from '@nextcloud/axios'
import { getCurrentUser } from '@nextcloud/auth'
import { generateUrl } from '@nextcloud/router'
import { getFilePickerBuilder, showWarning, showSuccess } from '@nextcloud/dialogs'
import { emit } from '@nextcloud/event-bus'

import CheckboxRadioSwitch from '@nextcloud/vue/dist/Components/CheckboxRadioSwitch.js'
import Button from '@nextcloud/vue/dist/Components/Button.js'
import PlusThick from 'vue-material-design-icons/PlusThick.vue'

import { mapGetters } from 'vuex'

import { requestFileInfo, getFileId } from '../../utils/files.js'

export default {
	name: 'TasksEdit',
	components: {
		Button, // eslint-disable-line vue/no-reserved-component-names
		CheckboxRadioSwitch,
		PlusThick,
	},
	data() {
		return {
			targetDirectoriesPaths: {},
			targetDirectoriesIds: [],
			excludeDirectoriesPaths: [],
			excludeFileIds: {},
			targetMimeType: 0,
			similarity_threshold: 90,
			customExcludeList: [],
			customExcludeMask: '',
			addingCustomMask: false,
			runningTask: false,
			finishNotification: true,
		}
	},
	computed: {
		...mapGetters([
			'settings',
			'settingByName',
			'tasks',
			'task',
			'taskInfo',
		]),
	},
	beforeMount() {
		this.similarity_threshold = this.settingByName('similarity_threshold') !== undefined
			? this.settingByName('similarity_threshold').value
			: 90
		this.targetMimeType = JSON.parse(this.task.collector_settings).target_mtype
		this.similarity_threshold = JSON.parse(this.task.collector_settings).similarity_threshold
		this.finishNotification = JSON.parse(this.task.collector_settings).finish_notification
		this.parseTaskSettings()
	},
	methods: {
		parseTaskSettings() {
			if (this.taskInfo !== null && 'target_directories' in this.taskInfo) {
				this.taskInfo.target_directories.forEach(dir => {
					this.targetDirectoriesIds.push(dir.fileid.toString())
					this.targetDirectoriesPaths[dir.fileid.toString()] = dir.filepath.replace(`/${getCurrentUser().uid}/files`, '') !== '' ? dir.filepath.replace(`/${getCurrentUser().uid}/files`, '') : '/'
				})
			}
			if (this.taskInfo !== null && 'exclude_directories' in this.taskInfo) {
				this.taskInfo.exclude_directories.forEach(dir => {
					this.excludeDirectoriesPaths.push(dir.filepath.replace())
					this.excludeFileIds[dir.fileid.toString()] = dir.filepath.replace(`/${getCurrentUser().uid}/files`, '')
				})
				this.customExcludeList = JSON.parse(this.task.exclude_list).user.mask
			}
		},
		getDirectoriesPicker(title) {
			return getFilePickerBuilder(title)
				.setMultiSelect(false)
				.addMimeTypeFilter('httpd/unix-directory')
				.setModal(true)
				.setType(1)
				.allowDirectories(true)
				.build()
		},
		getFilesPicker(title) {
			return getFilePickerBuilder(title)
				.setMultiSelect(false)
				.setModal(true)
				.setType(1)
				.allowDirectories(true)
				.build()
		},
		openDirectoriesExplorer() {
			this.getDirectoriesPicker(this.t('mediadc', 'Choose target directory')).pick().then(dir => {
				if (dir.startsWith('/')) {
					requestFileInfo(dir).then(res => {
						const fileid = getFileId(res.data)
						if (fileid !== -1) {
							if (!(fileid in this.targetDirectoriesPaths)) {
								this.targetDirectoriesIds.push(fileid)
								this.targetDirectoriesPaths[fileid.toString()] = dir
							} else {
								showWarning(this.t('mediadc', 'This directory already selected'))
							}
						}
					})
				} else {
					requestFileInfo('/').then(res => {
						const fileid = getFileId(res.data)
						if (fileid !== -1) {
							if (!(fileid in this.targetDirectoriesPaths)) {
								this.targetDirectoriesIds.push(fileid)
								this.targetDirectoriesPaths[fileid.toString()] = '/'
							} else {
								showWarning(this.t('mediadc', 'This directory already selected'))
							}
						}
					})
				}
			})
		},
		openExcludeExplorer() {
			this.getDirectoriesPicker(this.t('mediadc', 'Choose directory to exclude')).pick().then(dir => {
				if (Object.values(this.excludeFileIds).findIndex(targetDir => targetDir === dir) === -1) {
					if (dir.startsWith('/')) {
						requestFileInfo(dir).then(res => {
							const fileid = getFileId(res.data)
							if (fileid !== -1) {
								this.excludeDirectoriesPaths.push(dir)
								this.excludeFileIds[fileid.toString()] = dir
							}
						})
					} else {
						requestFileInfo('/').then(res => {
							const fileid = getFileId(res.data)
							if (fileid !== -1) {
								this.excludeDirectoriesPaths.push(dir)
								this.excludeFileIds[fileid.toString()] = '/'
							}
						})
					}
				} else {
					showWarning(this.t('mediadc', 'This directory already excluded'))
				}
			})
		},
		restartTask() {
			this.runningTask = true
			this.$store.dispatch('getSettings').then(() => {
				axios.post(generateUrl('/apps/mediadc/api/v1/tasks/restart'), {
					taskId: this.task.id,
					targetDirectoryIds: JSON.stringify(this.targetDirectoriesIds),
					excludeList: {
						user: {
							mask: this.customExcludeList,
							fileid: Object.keys(this.excludeFileIds).map(item => Number(item)),
						},
						admin: JSON.parse(this.settingByName('exclude_list').value) || { mask: [], fileid: [] },
					},
					collectorSettings: {
						hashing_algorithm: JSON.parse(this.settingByName('hashing_algorithm').value) || 'dhash',
						similarity_threshold: Number(this.similarity_threshold),
						hash_size: Number(this.settingByName('hash_size').value) || 16,
						target_mtype: this.targetMimeType,
						finish_notification: this.finishNotification,
					},
				}).then(res => {
					this.runningTask = false
					if (res.data.success) {
						this.runningTask = false
						this.closeEditTaskDialog()
						emit('restartTask')
						showSuccess(this.t('mediadc', 'Task successfully restarted!'))
					} else if (res.data.limit) {
						showWarning(this.t('mediadc', 'Running tasks limit exceed. Try again later.'))
					} else if (res.data.empty) {
						showWarning(this.n('mediadc', 'Target folder has no files or all of them excluded', 'Target folders have no files or all of them excluded', this.targetDirectoriesIds.length))
					} else {
						showWarning(t('medaidc', 'Some error occured while running Collector Task. Try again.'))
					}
				})
			})
		},
		removeTargetDirectory(fileid) {
			delete this.targetDirectoriesPaths[fileid]
			const fileidIndex = this.targetDirectoriesIds.findIndex(id => id === fileid)
			this.targetDirectoriesIds.splice(fileidIndex, 1)
		},
		removeExcludeDirectory(fileid) {
			if (fileid in this.excludeFileIds) {
				const dirIndex = this.excludeDirectoriesPaths.findIndex(dir => dir === this.excludeFileIds[fileid])
				this.excludeDirectoriesPaths.splice(dirIndex, 1)
				delete this.excludeFileIds[fileid]
			}
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
		},
		resetForm() {
			this.targetDirectoriesPaths = {}
			this.targetDirectoriesIds = []
			this.excludeDirectoriesNames = []
			this.excludeFileIds = {}
			this.targetMimeType = 0
			this.similarity_threshold = this.settingByName('similarity_threshold') !== undefined
				? this.settingByName('similarity_threshold').value
				: 90
			this.customExcludeList = []
			this.runningTask = false
			this.finishNotification = true
		},
		closeEditTaskDialog() {
			this.$emit('update:opened', false)
		},
	},
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 250ms;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.fade-visibility-enter,
.fade-visibility-leave-to {
	visibility: hidden;
	opacity: 0;
}

.block-wrapper {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;

}

.edit-task-block {
	position: relative;
	border: 1px solid var(--color-border-dark);
	border-radius: var(--border-radius-large);
	box-shadow: 0 0 30px var(--color-box-shadow);
	padding: 20px 20px 10px;
	width: 100%;
	max-width: 600px;
	margin: auto;
	background-color: var(--color-main-background);
}

.edit-task-close {
	position: absolute;
	top: 10px;
	right: 5px;
	padding: 25px;
	background: var(--icon-close-000) no-repeat center;
	opacity: .5;
	cursor: pointer;
}

.edit-task-close:hover {
	opacity: 1;
}

@media (max-width: 767px) {
	.selection-container {
		flex-wrap: wrap;
	}
}

@media (max-width: 540px) {
	.edit-task-block {
		width: 90vw;
		height: 80vh;
		overflow-y: scroll;
		top: calc(100% - 96vh);
	}
}

.delete-button {
	display: inline-flex;
	width: 15px;
	height: 15px;
	cursor: pointer;
	margin: 0 10px;
}

.create-task-actions {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 5px;
	padding: 0 10px;
}
</style>
