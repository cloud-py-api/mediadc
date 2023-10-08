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
	<div v-if="!loading" class="container">
		<TasksEdit v-if="editingTask" :opened.sync="editingTask" />
		<DetailsExport v-if="exporting" :opened.sync="exporting" :task="task" />
		<div class="task-details">
			<div class="task-details-heading">
				<h2>
					{{ rootTitle }}
					<NcButton v-if="isValidUser"
						v-tooltip="{content: !collapsedStatus
							? t('mediadc', 'Collapse task status')
							: t('mediadc', 'Show task status'), placement: 'bottom-end'}"
						type="tertiary"
						:aria-label="t('mediadc', 'Collapse task status')"
						style="margin: 0 10px;"
						@click="collapseTaskStatus">
						<template #icon>
							<span :class="!collapsedStatus ? 'icon-triangle-n' : 'icon-triangle-s'" />
						</template>
					</NcButton>
				</h2>
				<Transition name="fade" appear>
					<div v-if="isValidUser" v-show="!collapsedStatus" class="task-details-description">
						<p>
							{{ t('mediadc', 'Here you can view task details, manage task (stop or restart), delete found duplicated photos and videos.') }}
						</p>
						<p>
							{{ t('mediadc', 'Deleted files are placed in the trashbin, so that they can be restored in case of need.') }}
						</p>
					</div>
				</Transition>
			</div>
			<Transition name="fade" appear>
				<div v-if="isValidUser" v-show="!collapsedStatus" class="task-status-row">
					<div class="task-status-wrapper" style="display: flex; flex-direction: column; margin: 20px;">
						<div class="task-status">
							<span :class="'badge ' + getStatusBadge(task)">{{ getStatusBadge(task) }}</span>
							<div style="display: flex; flex-direction: column;">
								<span v-if="task.name !== null && task.name !== ''"><b>{{ task.name }}</b><br></span>
								<span>
									<b>{{ parseTargetMtype(task) }}</b> {{ task.files_scanned !== task.files_total ? `${task.files_scanned}/` : '' }}{{ task.files_total }} {{ n('mediadc', 'file', 'files', task.files_total) }}
									({{ formatBytes(Number(task.files_total_size)) }})
									({{ task !== null && 'collector_settings' in task ? t('mediadc', 'precision: ') + JSON.parse(task.collector_settings).similarity_threshold + '%' : '' }})
									<br>
									<b>{{ t('mediadc', 'Deleted: ') }} </b>
									{{ task.deleted_files_count }} {{ n('mediadc', 'file', 'files', task.deleted_files_count) }}
									({{ formatBytes(Number(task.deleted_files_size)) }})
								</span>
								<span>
									{{ parseUnixTimestamp(task.created_time) }}
									{{ Number(task.finished_time) > 0 ? ' - ' + parseUnixTimestamp(task.finished_time) : '' }}
								</span>
							</div>
							<NcActions style="margin: 0 0 0 10px;">
								<NcActionButton v-tooltip="{content: t('mediadc', 'Restart task with current params'), placement: 'left'}"
									icon="icon-history"
									:close-after-click="true"
									@click="restartTask(task)">
									{{ getStatusBadge(task) === 'duplicated' ? t('mediadc', 'Start') : t('mediadc', 'Restart') }}
								</NcActionButton>
								<NcActionButton v-tooltip="{content: t('mediadc', 'Edit task params'), placement: 'left'}"
									icon="icon-rename"
									:close-after-click="true"
									@click="openEditTaskDialog(task)">
									{{ t('mediadc', 'Edit') }}
								</NcActionButton>
								<NcActionButton v-tooltip="{content: t('mediadc', 'Terminate task execution'), placement: 'left'}"
									icon="icon-pause"
									:close-after-click="true"
									@click="_terminateTask(task)">
									{{ t('mediadc', 'Stop') }}
								</NcActionButton>
								<NcActionButton v-if="getStatusBadge(task) === 'finished'"
									v-tooltip="{ content: t('mediadc', 'Export task results'), placement: 'left' }"
									:close-after-click="true"
									@click="openExportResultsDialog(task)">
									<template #default>
										{{ t('mediadc', 'Export') }}
									</template>
									<template #icon>
										<FileExportOutline :size="18" />
									</template>
								</NcActionButton>
								<NcActionButton v-tooltip="{content: t('mediadc', 'Delete task'), placement: 'left'}"
									icon="icon-delete"
									:close-after-click="true"
									@click="deleteTask(task)">
									{{ t('mediadc', 'Delete task') }}
								</NcActionButton>
							</NcActions>
						</div>
						<NcProgressBar :value="Math.round((task.files_scanned / task.files_total) * 100)"
							size="small"
							:error="getStatusBadge(task) === 'error'" />
					</div>
					<div class="task-info">
						<h3>{{ t('mediadc', 'Target directories') }}</h3>
						<div class="target-directories-list">
							<div v-for="dir in taskInfo.target_directories"
								:key="dir.fileid"
								v-tooltip="{content: getDirOwnerToolip(dir), placement: 'bottom'}"
								class="target-directory-row">
								<a :href="filesDirLink(dir)" target="_blank">
									<b>
										{{
											dir.filepath.replace(`/${dir.fileowner}/files`, '').replace(`/${currentUser}/files`, '') !== ''
												? dir.filepath.replace(`/${dir.fileowner}/files`, '').replace(`/${currentUser}/files`, '')
												: '/'
										}}
									</b>
									({{ !dir.hasignoreflag ? formatBytes(dir.filesize) : t('mediadc', 'Ignored') }})
								</a>
							</div>
						</div>
					</div>
				</div>
			</Transition>
			<Transition name="fade" appear>
				<div v-if="isValidUser" class="details-row">
					<DetailsList v-if="getStatusBadge(task) === 'finished'" />
				</div>
				<div v-else>
					<p style="text-align: center;">
						<b>{{ t('mediadc', 'You are not allowed to manage other user\'s tasks.') }}</b>
					</p>
				</div>
			</Transition>
			<div v-if="hasErrors" class="errors">
				<div class="errors-heading" style="display: flex; align-items: center;">
					<h3>{{ t('mediadc', 'Task errors' ) }}</h3>
					<NcButton v-tooltip="t('mediadc', 'Copy to clipboard')"
						type="tertiary-no-background"
						:aria-label="t('mediadc', 'Copy to clipboard')"
						style="margin: 0 10px;"
						@click="copyErrorsToClipboard">
						<template #icon>
							<ContentCopy :size="20" />
						</template>
					</NcButton>
				</div>
				<div v-for="error in task.errors.split('\\n')" :key="error" class="error-row">
					{{ error }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { getCurrentUser } from '@nextcloud/auth'
import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import { showSuccess, showError, showWarning, showMessage } from '@nextcloud/dialogs'
import { generateUrl } from '@nextcloud/router'
import { mapActions, mapGetters } from 'vuex'

import DetailsList from '../components/details/DetailsList.vue'
import Formats from '../mixins/Formats.js'
import TasksEdit from '../components/tasks/TasksEdit.vue'
import DetailsExport from '../components/details/DetailsExport.vue'

import NcActions from '@nextcloud/vue/dist/Components/NcActions.js'
import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton.js'
import NcProgressBar from '@nextcloud/vue/dist/Components/NcProgressBar.js'
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import ContentCopy from 'vue-material-design-icons/ContentCopy.vue'
import FileExportOutline from 'vue-material-design-icons/FileExportOutline.vue'

export default {
	name: 'CollectorDetails',
	components: {
		DetailsList,
		TasksEdit,
		DetailsExport,
		NcActions,
		NcActionButton,
		NcProgressBar,
		NcButton,
		ContentCopy,
		FileExportOutline,
	},
	mixins: [Formats],
	props: {
		rootTitle: {
			type: String,
			required: true,
		},
		loading: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		return {
			tasksUpdater: null,
			collapsedStatus: false,
			editingTask: false,
			exporting: false,
		}
	},
	computed: {
		...mapGetters([
			'task',
			'taskInfo',
			'details',
			'settingByName',
		]),
		isValidUser() {
			return getCurrentUser().uid === this.task?.owner
		},
		currentUser() {
			return getCurrentUser().uid
		},
		hasErrors() {
			return this.task?.errors?.length > 0
		},
	},
	beforeMount() {
		this.$emit('update:loading', true)
		this.tasksUpdater = setInterval(this._getTaskDetails, 3000)
		this.getTaskDetails().then((res) => {
			if (this.getStatusBadge(res.data.collectorTask) === 'finished' || this.getStatusBadge(res.data.collectorTask) === 'duplicated') {
				clearInterval(this.tasksUpdater)
			}
			this.$emit('update:loading', false)
		})
		this.getTaskInfo()
		subscribe('restartTask', this.onRestartTaskEvent)
		subscribe('updateTaskInfo', this.getDetailFilesTotalSize)
	},
	beforeDestroy() {
		clearInterval(this.tasksUpdater)
		unsubscribe('updateTaskInfo', this.getDetailFilesTotalSize)
		unsubscribe('restartTask', this.onRestartTaskEvent)
		this.$store.commit('setTask', {})
		this.$store.commit('setTaskInfo', { exclude_directories: [], target_directories: [] })
		this.$store.commit('setDetails', [])
		this.$store.commit('setDetailsInfo', { filestotal: 0, filessize: 0 })
	},
	methods: {
		...mapActions([
			'getTaskDetails',
			'getTaskInfo',
			'getDetailFilesTotalSize',
			'terminateTask',
			'getSettings',
		]),
		_terminateTask(task) {
			if (this.isValidUser) {
				this.terminateTask(task).then(() => {
					showSuccess(this.t('mediadc', 'Task terminated'))
				})
			} else {
				showWarning(this.t('mediadc', 'You are not allowed to terminate this task'))
			}
		},
		_getTaskDetails() {
			this.getTaskDetails().then(res => {
				if (this.getStatusBadge(res.data.collectorTask) === 'finished' || this.getStatusBadge(res.data.collectorTask) === 'terminated' || this.getStatusBadge(res.data.collectorTask) === 'error') {
					clearInterval(this.tasksUpdater)
				}
			})
		},
		restartTask(task) {
			if (this.isValidUser) {
				clearInterval(this.tasksUpdater)
				this.getSettings().then(() => {
					axios.post(generateUrl('/apps/mediadc/api/v1/tasks/restart'), {
						taskId: task.id,
						targetDirectoryIds: task.target_directory_ids,
						excludeList: {
							user: JSON.parse(task.exclude_list).user,
							admin: JSON.parse(this.settingByName('exclude_list').value),
						},
						collectorSettings: {
							hashing_algorithm: JSON.parse(this.settingByName('hashing_algorithm').value) || 'dhash',
							similarity_threshold: Number(JSON.parse(this.task.collector_settings).similarity_threshold),
							hash_size: Number(this.settingByName('hash_size').value) || 16,
							target_mtype: Number(JSON.parse(this.task.collector_settings).target_mtype),
							finish_notification: JSON.parse(this.task.collector_settings).finish_notification,
						},
					}).then(res => {
						if (res.data.success) {
							this.getTaskDetails()
							this.$store.commit('setDetailsInfo', { filestotal: 0, filessize: 0 })
							this.tasksUpdater = setInterval(this._getTaskDetails, 3000)
							showSuccess(this.t('mediadc', 'Task successfully restarted with previous settings!'))
						} else if (res.data.limit) {
							showWarning(this.t('mediadc', 'Running tasks limit exceed. Try again later.'))
						} else if (res.data.empty) {
							showWarning(this.n('mediadc', 'Target folder has no files or all of them excluded', 'Target folders have no files or all of them excluded', task.target_directory_ids.length))
						} else if (res.data.php_exec_not_enabled) {
							showError(t('mediadc', 'Task run error: PHP `exec` function is not enabled'))
						} else {
							showWarning(this.t('medaidc', 'Some error occurred while running Collector Task. Try again.'))
						}
					}).catch(err => {
						console.debug(err)
						showError('Some error occurred while running Collector Task. Try again.')
					})
				})
			} else {
				showWarning(this.t('mediadc', 'You are not allowed to restart this task'))
			}
		},
		deleteTask(task) {
			if (this.isValidUser) {
				const self = this
				OC.dialogs.confirm(this.t('mediadc', 'Are sure you want to delete this task?'),
					this.t('mediadc', 'Confirm task deletion'),
					function(success) {
						if (success) {
							self.$store.dispatch('deleteTask', task).then(() => {
								self.$router.push({ name: 'collector' })
								showSuccess(self.t('mediadc', 'Task successfully deleted'))
							})
						}
					},
				)
			} else {
				showWarning(this.t('mediadc', 'You are not allowed to delete this task'))
			}
		},
		collapseTaskStatus() {
			this.collapsedStatus = !this.collapsedStatus
		},
		openEditTaskDialog() {
			this.editingTask = true
		},
		openExportResultsDialog(task) {
			if (this.getStatusBadge(task) === 'finished' && this.details.length > 0) {
				this.exporting = true
			} else {
				showMessage(this.t('mediadc', 'No results to export'))
			}
		},
		filesDirLink(dir) {
			if (dir) {
				const path = dir.filepath.replace(`/${dir.fileowner}/files`, '').replace(`/${this.currentUser}/files`, '') !== ''
					? dir.filepath.replace(`/${dir.fileowner}/files`, '').replace(`/${this.currentUser}/files`, '')
					: '/'
				return generateUrl(`/apps/files?dir=${path}`)
			}
			return '#'
		},
		onRestartTaskEvent() {
			this.getTaskInfo()
			this.getTaskDetails()
			this.$store.commit('setDetailsInfo', { filestotal: 0, filessize: 0 })
			clearInterval(this.tasksUpdater)
			this.tasksUpdater = setInterval(this._getTaskDetails, 3000)
		},
		getDirOwnerToolip(dir) {
			return `${this.t('mediadc', 'Owner:')} ${dir.fileowner}`
		},
		copyErrorsToClipboard() {
			navigator.clipboard.writeText(JSON.stringify(Object.assign(this.task.errors.split('\\n')), null, 2))
			showSuccess(this.t('mediadc', 'Copied to clipboard'))
		},
	},
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.container {
	padding: 0 20px;
	width: 100%;
	max-width: 1440px;
	margin: 0 auto;
	max-height: 100%;
}

@media (min-width: 1920px) {
	.container {
		max-width: 80vw;
	}
}

h2 {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	margin: 20px auto 10px;
	text-align: center;
	font-size: 24px;
}

.task-details-heading p {
	text-align: center;
	font-size: 15px;
}

.details-row {
	display: flex;
	flex-direction: column;
	margin: 0 10px 20px;
	position: relative;
}

@media (max-width: 767px) {
	.details-row {
		flex-wrap: wrap;
	}
	.task-details-heading {
		flex-direction: column;
	}
}

.task-status-row {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
}

.task-status-wrapper {
	border: 1px solid var(--color-border-dark);
	border-radius: 16px;
	overflow: hidden;
}

.task-status-wrapper progress {
	margin-top: 5px;
}

.task-status {
	display: inline-flex;
	align-items: center;
	padding: 10px
}

.task-info {
	margin: 20px 0;
	border: 1px solid var(--color-border-dark);
	border-radius: var(--border-radius-large);
	padding: 10px 20px;
	height: 100%;
	min-height: 105px;
	max-height: 105px;
	max-width: 50%;
	overflow-y: scroll;
}

@media (max-width: 767px) {
	.details-row {
		margin: 0 0 20px;
	}

	.task-status {
		flex-direction: column;
		width: 100%;
	}

	.task-info {
		max-width: 100%;
		margin: 0;
	}
}

.task-info h3 {
	margin: 0 0 5px 0;
	font-weight: bold;
}

.target-directory-row {
	white-space: nowrap;
	padding: 7px 0;
}

@media (max-width: 540px) {
	.task-status-row {
		flex-direction: column;
		margin: 20px 0;
	}

	.badge {
		margin-right: 0;
		margin-top: 10px;
		margin-bottom: 10px;
	}
}
</style>
