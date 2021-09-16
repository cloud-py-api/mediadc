<!--
 - @copyright Copyright (c) 2021 Andrey Borysenko <andrey18106x@gmail.com>
 -
 - @copyright Copyright (c) 2021 Alexander Piskun <bigcat88@icloud.com>
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
	<div v-show="opened" class="blackout">
		<div class="edit-task-block">
			<span class="icon-close close-edit-button" @click="closeEditTaskDialog" />
			<h2>{{ t('mediadc', 'Edit task') }}</h2>
			<div class="selection-container">
				<div class="block target-directories-block">
					<h3>{{ t('mediadc', 'Target directories') }}</h3>
					<div v-if="targetDirectoriesIds.length > 0">
						<div v-for="fileid in targetDirectoriesIds" :key="fileid" class="selected-target-directories-list">
							<div class="target-directory">
								<span style="overflow-y: scroll; white-space: nowrap;">{{ targetDirectoriesPaths[fileid] }}</span>
								<span class="delete-button icon-delete" @click="removeTargetDirectory(fileid)" />
							</div>
						</div>
					</div>
					<div v-else>
						<span>{{ t('mediadc', 'Not selected') }}</span>
					</div>
					<br>
					<button @click="openDirectoriesExplorer">
						<span class="icon-add" />
						{{ t('mediadc', 'Select') }}
					</button>
				</div>
				<div class="block">
					<h3>{{ t('mediadc', 'Exclude directories') }}</h3>
					<div v-if="excludeDirectoriesPaths.length > 0">
						<div v-for="fileid in Object.keys(excludeFileIds)" :key="fileid" class="selected-excluded-directories-list">
							<div class="target-directory">
								<span style="overflow-y: scroll;">{{ excludeFileIds[fileid] }}</span>
								<span class="delete-button icon-delete" @click="removeExcludeDirectory(fileid)" />
							</div>
						</div>
					</div>
					<div v-else>
						<span>{{ t('mediadc', 'Not selected') }}</span>
					</div>
					<br>
					<button @click="openExcludeExplorer">
						<span class="icon-add" />
						{{ t('mediadc', 'Select') }}
					</button>
				</div>
			</div>
			<div class="selection-container">
				<div class="block">
					<h3>{{ t('mediadc', 'Custom exclude mask') }}</h3>
					<div v-if="customExcludeList.length > 0" class="custom-masks-list">
						<div v-for="(mask, index) in customExcludeList" :key="index" class="custom-mask">
							<span>{{ mask }}</span>
							<span class="icon-delete" style="cursor: pointer;" @click="deleteCustomMask(mask)" />
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
						<span class="icon-checkmark" style="width: 18px; height: 18px; margin: 0 5px; display: inline-block; cursor: pointer;" @click="addCustomMask" />
						<span class="icon-close" style="width: 18px; height: 18px; margin: 0 5px; display: inline-block; cursor: pointer;" @click="cancelAddingCustomMask" />
					</div>
					<div style="display: flex; align-items: center; margin: 20px 0;">
						<button @click="addNewMask">
							<span class="icon-add" />
							<span>{{ t('mediadc', 'Add mask') }}</span>
						</button>
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
			<button v-if="!runningTask"
				style="margin: 10px 5px 0"
				:disabled="Object.keys(targetDirectoriesPaths).length === 0"
				@click="restartTask">
				{{ t('mediadc', 'Restart task') }}
			</button>
			<button v-else disabled>
				<span class="icon-loading" />
			</button>
		</div>
	</div>
</template>

<script>
import { generateUrl } from '@nextcloud/router'
import { getFilePickerBuilder, showWarning, showSuccess } from '@nextcloud/dialogs'
import axios from '@nextcloud/axios'
import { requestFileInfo, getFileId } from '../../utils/files'
import { mapGetters } from 'vuex'
import { getCurrentUser } from '@nextcloud/auth'
import { emit } from '@nextcloud/event-bus'

export default {
	name: 'TasksEdit',
	props: {
		opened: {
			type: Boolean,
			required: true,
		},
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
		this.parseTaskSettings()
	},
	methods: {
		parseTaskSettings() {
			if (this.taskInfo !== null && 'target_directories' in this.taskInfo) {
				this.taskInfo.target_directories.forEach(dir => {
					this.targetDirectoriesIds.push(dir.fileid.toString())
					this.targetDirectoriesPaths[dir.fileid.toString()] = dir.filepath.replace(`/${getCurrentUser().uid}/files`, '')
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
			this.getDirectoriesPicker(t('mediadc', 'Choose target directory')).pick().then(dir => {
				if (dir.startsWith('/')) {
					requestFileInfo(dir).then(res => {
						const fileid = getFileId(res.data)
						if (fileid !== -1) {
							if (!(fileid in this.targetDirectoriesPaths)) {
								this.targetDirectoriesIds.push(fileid)
								this.targetDirectoriesPaths[fileid.toString()] = dir
							} else {
								showWarning(t('mediadc', 'This directory already selected'))
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
								showWarning(t('mediadc', 'This directory already selected'))
							}
						}
					})
					this.targetDirectoriesPaths.push('/')
				}
			})
		},
		openExcludeExplorer() {
			this.getDirectoriesPicker(t('mediadc', 'Choose directory to exclude')).pick().then(dir => {
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
					showWarning(t('mediadc', 'This directory already excluded'))
				}
			})
		},
		restartTask() {
			this.runningTask = true
			this.getSettings().then(res => {
				this.$store.dispatch('setSettings', res.data)
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
						hash_size: Number(this.settingByName('hash_size').value) || 64,
						target_mtype: this.targetMimeType,
					},
				}).then(res => {
					this.runningTask = false
					if (res.data.success) {
						this.runningTask = false
						this.closeEditTaskDialog()
						emit('restartTask')
						showSuccess(t('mediadc', 'Task successfully restarted!'))
					} else {
						showWarning('Some error occured while running Collector Task. Try again.')
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
		removeExcludeFileid(fileid) {
			delete this.excludeFileIds[fileid]
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
		async getTasks() {
			axios.get(generateUrl('/apps/mediadc/api/v1/tasks')).then(res => {
				this.$store.dispatch('setTasks', res.data)
				this.$emit('update:loading', false)
			})
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
		},
		closeEditTaskDialog() {
			this.$emit('update:opened', false)
		},
		async getSettings() {
			return axios.get(generateUrl('/apps/mediadc/api/v1/settings'))
		},
	},
}
</script>

<style scoped>
.blackout {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.3);
	z-index: 999;
}

.edit-task-block {
	border: 1px solid #dadada;
	border-radius: 5px;
	box-shadow: 0 0 4px 0 rgba(0, 0, 0, .05);
	padding: 20px;
	width: 100%;
	max-width: 600px;
	position: absolute;
	background-color: #fff;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.selection-container {
	width: 100%;
	display: flex;
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
		top: calc(50% + calc(100% - 96vh));
	}
}

.block {
	width: 100%;
	height: 100%;
	max-height: 200px;
	overflow-y: scroll;
	padding: 10px 15px;
	margin: 5px 10px;
	border: 1px solid #dadada;
	border-radius: 5px;
}

.block:hover {
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, .05)
}

.target-directory, .custom-mask {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 5px 0;
	border-bottom: 1px solid #dadada;
}

.delete-button {
	display: inline-flex;
	width: 15px;
	height: 15px;
	cursor: pointer;
	margin: 0 10px;
}

.close-edit-button {
	position: absolute;
	top: 15px;
	right: 15px;
	padding: 20px;
	border-radius: 50%;
	cursor: pointer;
	opacity: 0.5;
}

.close-edit-button:hover, .close-edit-button:active {
	opacity: 1;
}

body.theme--dark .actions-menu-button:hover {
	background-color: #727272;
}

body.theme--dark .close-edit-button:active {
	background-color: #5b5b5b;
}

body.theme--dark .edit-task-block, body.theme--dark .block {
	border-color: #717171;
}

body.theme--dark .edit-task-block {
	background-color: #111;
}
</style>
