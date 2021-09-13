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
	<div v-if="!loading" class="container">
		<TasksEdit v-if="editingTask" :opened.sync="editingTask" />
		<div class="task-details">
			<div class="task-details-heading">
				<h2>
					{{ rootTitle }}
					<span :class="!collapsedStatus
							? 'icon-triangle-n collapse-task-status-btn'
							: 'icon-triangle-s collapse-task-status-btn'"
						@click="collapseTaskStatus" />
				</h2>
				<div v-show="!collapsedStatus" class="task-details-description">
					<p>
						{{ t('mediadc', 'Here you can view task details, manage task (stop or restart), ' +
							'delete found duplicated photos and videos.') }}
					</p>
					<p>
						{{ t('mediadc', 'Deleted files are placed in the trash, so that they can be restored in case of need.') }}
					</p>
				</div>
			</div>
			<div v-show="!collapsedStatus" class="task-status-row">
				<div class="task-status">
					<span :class="'badge ' + getStatusBadge(task)">{{ getStatusBadge(task) }}</span>
					<div style="display: flex; flex-direction: column;">
						<span>
							<b>{{ parseTargetMtype(task) }}</b> {{ task.files_scanned !== task.files_total ? `${task.files_scanned}/` : '' }}{{ task.files_total }} file(s)
							({{ formatBytes(Number(task.files_total_size)) }})
							({{ task !== null && 'collector_settings' in task ? t('mediadc', 'precision: ') + JSON.parse(task.collector_settings).similarity_threshold + '%' : '' }})
							<br>
							<b>{{ t('mediadc', 'Deleted: ') }} </b>
							{{ task.deleted_files_count }} {{ t('mediadc', 'file(s)') }}
							({{ formatBytes(Number(task.deleted_files_size)) }})
						</span>
						<span>
							{{ parseUnixTimestamp(task.created_time) }}
							{{ Number(task.finished_time) > 0 ? ' - ' + parseUnixTimestamp(task.finished_time) : '' }}
						</span>
					</div>
					<div class="app-content-list-menu" style="margin: 0 0 0 10px; position: relative;">
						<div class="icon-more actions-menu-button" @click="openActionsPopup" />
						<div :class="actionsOpened ? 'popovermenu open' : 'popovermenu'"
							style="right: -1px;">
							<ul>
								<li>
									<a class="icon-history" @click="restartTask(task)">
										<span>{{ t('mediadc', 'Restart') }}</span>
									</a>
								</li>
								<li>
									<a class="icon-rename" @click="openEditTaskDialog(task)">
										<span>{{ t('mediadc', 'Edit') }}</span>
									</a>
								</li>
								<li>
									<a class="icon-pause" @click="terminateTask(task)">
										<span>{{ t('mediadc', 'Stop') }}</span>
									</a>
								</li>
								<li>
									<a class="icon-delete" @click="deleteTask(task)">
										<span>{{ t('mediadc', 'Delete') }}</span>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="task-info">
					<h3>{{ t('mediadc', 'Target directories') }}</h3>
					<div class="target-directories-list">
						<div v-for="dir in taskInfo.target_directories" :key="dir.fileid" class="target-directory-row">
							<b>[{{ dir.fileowner }}] {{ dir.filepath.replace(`/${dir.fileowner}/files`, '') }}</b> ({{ formatBytes(dir.filesize) }})
						</div>
					</div>
				</div>
			</div>
			<div v-if="isValidUser" class="details-row">
				<DetailsList :filessize="filessize" :filestotal="filestotal" />
			</div>
			<div v-else>
				<p style="text-align: center;">
					<b>{{ t('mediadc', 'You are not allowed to manage other user\'s tasks.') }}</b>
				</p>
			</div>
			<div v-if="task.errors !== undefined && task.errors.length > 0" class="errors">
				<h3>{{ t('mediadc', 'Task errors') }}</h3>
				<div v-for="error in task.errors.split('\\n')" :key="error" class="error-row">
					{{ error }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { mapGetters } from 'vuex'
import Formats from '../mixins/Formats'
import { generateUrl } from '@nextcloud/router'
import DetailsList from '../components/details/DetailsList'
import { showSuccess, showError, showWarning } from '@nextcloud/dialogs'
import Configure from '../mixins/Configure'
import { getCurrentUser } from '@nextcloud/auth'
import { subscribe, unsubscribe } from '@nextcloud/event-bus'
import TasksEdit from '../components/tasks/TasksEdit'

export default {
	name: 'CollectorDetails',
	components: {
		DetailsList,
		TasksEdit,
	},
	mixins: [
		Formats,
		Configure,
	],
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
			updater: null,
			statsUpdater: null,
			filessize: 0,
			filestotal: 0,
			actionsOpened: false,
			collapsedStatus: false,
			editingTask: false,
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
			return getCurrentUser().uid === this.task.owner
		},
	},
	beforeMount() {
		this.$emit('update:loading', true)
		this.getTaskDetails()
		this.getTaskInfo()
		subscribe('restartTask', () => {
			this.getTaskInfo()
			this.getTaskDetails()
			this.filessize = 0
			this.filestotal = 0
		})
		subscribe('updateTaskInfo', this.getDetailFilesTotalSize)
		this.updater = setInterval(this.getTaskDetails, 5000)
	},
	beforeDestroy() {
		clearInterval(this.updater)
		unsubscribe('updateTaskInfo', this.getTaskInfo)
		unsubscribe('restartTask')
	},
	methods: {
		terminateTask(task) {
			this.toggleActionsPopup()
			if (this.isValidUser) {
				this.terminating = true
				axios.post(generateUrl(`/apps/mediadc/api/v1/tasks/${task.id}/terminate`)).then(res => {
					showSuccess(t('mediadc', 'Task terminated'))
					this.terminating = false
					this.getTaskDetails()
				})
			} else {
				showWarning(t('mediadc', 'You are not allowed to terminate this task'))
			}
		},
		restartTask(task) {
			this.toggleActionsPopup()
			if (this.isValidUser) {
				this.restarting = true
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
							hash_size: Number(this.settingByName('hash_size').value) || 64,
							target_mtype: Number(JSON.parse(this.task.collector_settings).target_mtype),
						},
					}).then(res => {
						this.restarting = false
						if (res.data.success) {
							showSuccess(t('mediadc', 'Task successfully restarted with previous settings!'))
							this.getTaskDetails()
							this.filessize = 0
							this.filestotal = 0
						} else {
							showError('Some error occured while restarting Collector Task. Try again.')
						}
					}).catch(err => {
						this.restarting = false
						console.debug(err)
						showError('Some error occured while running Collector Task. Try again.')
					})
				})
			} else {
				showWarning(t('mediadc', 'You are not allowed to restart this task'))
			}
		},
		deleteTask(task) {
			this.toggleActionsPopup()
			if (this.isValidUser) {
				if (confirm(t('mediadc', 'Are sure, you want delete this task?'))) {
					this.deleting = true
					axios.delete(generateUrl(`/apps/mediadc/api/v1/tasks/${task.id}`)).then(res => {
						this.$router.push({ name: 'collector' })
						showSuccess(t('mediadc', 'Task successfully deleted'))
						this.deleting = false
					})
				}
			} else {
				showWarning(t('mediadc', 'You are not allowed to delete this task'))
			}
		},
		async getTaskDetails() {
			axios.get(generateUrl(`/apps/mediadc/api/v1/tasks/${this.$route.params.taskId}`)).then(res => {
				if ('success' in res.data && res.data.success) {
					this.$store.dispatch('setTask', res.data.collectorTask)
					this.$store.dispatch('setDetails', res.data.collectorTaskDetails)
					if (this.getStatusBadge(this.task) === 'finished'
						&& this.filestotal === 0 && this.filessize === 0) {
						this.getDetailFilesTotalSize()
					}
				}
				this.$emit('update:loading', false)
			})
		},
		async getTaskInfo() {
			axios.get(generateUrl(`/apps/mediadc/api/v1/tasks/${this.$route.params.taskId}/info`)).then(res => {
				this.$store.dispatch('setTaskInfo', res.data.collectorTaskInfo)
			})
		},
		async getDetailFilesTotalSize() {
			axios.get(generateUrl(`/apps/mediadc/api/v1/tasks/${this.$route.params.taskId}/filestotal`)).then(res => {
				this.filessize = res.data.filessize
				this.filestotal = res.data.filestotal
			})
		},
		openActionsPopup() {
			document.addEventListener('click', this.toggleActionsPopup)
		},
		toggleActionsPopup() {
			if (this.actionsOpened) {
				document.removeEventListener('click', this.toggleActionsPopup)
			}
			this.actionsOpened = !this.actionsOpened
		},
		collapseTaskStatus() {
			this.collapsedStatus = !this.collapsedStatus
		},
		openEditTaskDialog() {
			this.editingTask = true
		},
	},
}
</script>

<style scoped>
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
	margin: 20px auto;
	text-align: center;
}

.collapse-task-status-btn {
	display: inline-flex;
	cursor: pointer;
	width: 16px;
	height: 16px;
	margin: 0 10px;
	padding: 20px;
	border-radius: 50%;
	user-select: none;
}

.task-details-heading p {
	text-align: center;
}

.details-row {
	display: flex;
	margin: 0 10px 20px;
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

.task-status {
	display: inline-flex;
	align-items: center;
	border: 1px solid #dadada;
	border-radius: 5px;
	margin: 20px;
	padding: 10px;
}

.actions-menu-button {
	padding: 20px;
	border-radius: 50%;
	cursor: pointer;
	user-select: none;
}

.actions-menu-button:hover, .collapse-task-status-btn:hover {
	background-color: #eee;
}

.actions-menu-button:active, .collapse-task-status-btn:active {
	background-color: #ddd;
}

body.theme--dark .actions-menu-button:hover, body.theme--dark .collapse-task-status-btn:hover {
	background-color: #727272;
}

body.theme--dark .actions-menu-button:active, body.theme--dark .collapse-task-status-btn:active {
	background-color: #5b5b5b;
}

body.theme--dark .task-status, body.theme--dark .task-info {
	border-color: #717171;
}

.task-info {
	margin: 20px 0;
	border: 1px solid #dadada;
	border-radius: 5px;
	padding: 10px 20px;
	height: 100%;
	max-height: 94px;
	max-width: 50%;
	overflow-y: scroll;
}

@media (max-width: 767px) {
	.details-row {
		margin: 0 0 20px;
	}

	.task-status {
		flex-direction: column;
		margin: 0 0 20px;
		width: 100%;
	}

	.task-info {
		max-width: 100%;
		margin: 0;
	}
}

.task-info h3 {
	margin: 0 0 5px 0;
}

.target-directory-row {
	overflow-x: scroll;
	white-space: nowrap;
}

.badge {
	display: inline-flex;
	padding: 0 10px;
	background-color: #eee;
	border-radius: 20px;
	margin-right: 20px;
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

.badge.finished {
	background-color: #49b382;
	color: #fff;
}

.badge.running, .badge.pending {
	background-color: #dadada;
	color: #000;
}

.badge.error {
	background-color: #bd3f3f;
	color: #fff;
}

.badge.terminated {
	background-color: #f17b1b;
	color: #fff;
}

.errors {
	margin: 20px;
	border: 1px solid #bd3f3f;
	border-radius: 5px;
	padding: 10px;
	max-height: 100vh;
	overflow-y: scroll;
}

.error-row {
	border-bottom: 1px solid #bd3f3f;
	padding: 5px 0;
	max-height: 100%;
	overflow-y: scroll;
}
</style>
