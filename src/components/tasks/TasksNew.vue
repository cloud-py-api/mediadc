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
	<div class="new-task-block">
		<h2>{{ t('mediadc', 'Create a new Task') }}</h2>
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
			@click="runCollectorTask">
			{{ t('mediadc', 'Run new Task') }}
		</button>
		<button v-else disabled>
			<span class="icon-loading" />
		</button>
	</div>
</template>

<script>
import { generateUrl } from '@nextcloud/router'
import { getFilePickerBuilder, showWarning, showSuccess } from '@nextcloud/dialogs'
import axios from '@nextcloud/axios'
import { requestFileInfo, getFileId } from '../../utils/files'
import { mapGetters } from 'vuex'

export default {
	name: 'TasksNew',
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
		]),
	},
	beforeMount() {
		this.similarity_threshold = this.settingByName('similarity_threshold') !== undefined
			? this.settingByName('similarity_threshold').value
			: 90
	},
	methods: {
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
		runCollectorTask() {
			this.runningTask = true
			axios.post(generateUrl('/apps/mediadc/api/v1/tasks/run'), {
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
					similarity_threshold: this.similarity_threshold,
					hash_size: this.settingByName('hash_size').value || 16,
					target_mtype: this.targetMimeType,
				},
			}).then(res => {
				this.runningTask = false
				if (res.data.success) {
					this.$emit('update:loading', true)
					this.getTasks()
					this.resetForm()
					showSuccess(t('mediadc', 'New task successfully created!'))
				} else if (res.data.limit) {
					showWarning(t('mediadc', 'Running tasks limit exceed. Try again later.'))
				} else {
					showWarning(t('medaidc', 'Some error occured while running Collector Task. Try again.'))
				}
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
			this.excludeDirectoriesPaths = []
			this.excludeFileIds = {}
			this.targetMimeType = 0
			this.similarity_threshold = this.settingByName('similarity_threshold') !== undefined
				? this.settingByName('similarity_threshold').value
				: 90
			this.customExcludeList = []
			this.runningTask = false
		},
	},
}
</script>

<style scoped>
.new-task-block {
	border: 1px solid #dadada;
	border-radius: 5px;
	box-shadow: 0 0 4px 0 rgba(0, 0, 0, .05);
	padding: 20px;
	margin: 10px;
	width: 100%;
	max-width: 600px;
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

body.theme--dark .new-task-block, body.theme--dark .block {
	border-color: #717171;
}
</style>
