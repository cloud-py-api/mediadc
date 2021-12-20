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
	<div class="details-list-item">
		<div v-show="updating" class="action-blackout">
			<span class="icon-loading" />
		</div>
		<div class="details-list-item-title">
			<CheckboxRadioSwitch class="batch-checkbox" :checked.sync="checked" />
			<span class="group-info" @click="openDetailFiles(detail)">
				<span class="icon-projects" style="margin: 0 10px 0 10px;" />
				{{ t('mediadc', 'Duplicate group') }} #{{ detail.id }} ({{ JSON.parse(detail.group_files_ids).length }}
				{{ translatePlural('mediadc', 'file', 'files', JSON.parse(detail.group_files_ids).length) }}{{ Array.isArray(files) && files.length > 0 ? ' - ' + formatBytes(groupFilesSize) : '' }})
				<span :class="!opened ? 'icon-triangle-s open-details-btn' : 'icon-triangle-n open-details-btn'" />
			</span>
			<span class="icon-delete delete-group-btn"
				:title="t('mediadc', 'Remove group without deleting files')"
				@click="removeTaskDetail(detail)" />
		</div>
		<div v-if="opened && JSON.parse(detail.group_files_ids).length > groupItemsPerPage" class="pagination">
			<span class="icon-view-previous pagination-button"
				@click="openPrevDetailFiles(detail)" />
			<span>{{ t('mediadc', 'Page:') }}&nbsp;</span>
			<span>{{ page + 1 }}/{{ Math.ceil(JSON.parse(detail.group_files_ids).length / groupItemsPerPage) }}</span>
			<span class="icon-view-next pagination-button"
				@click="openNextDetailFiles(detail)" />
		</div>
		<DetailsGroupList v-show="opened"
			:detail="detail"
			:files="files"
			:all-files="allFiles"
			:loading-files.sync="loadingFiles"
			:updating.sync="updating"
			:files-ascending.sync="filesAscending" />
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import DetailsGroupList from './DetailsGroupList'
import Formats from '../../mixins/Formats'
import { mapGetters } from 'vuex'
import { showError, showSuccess, showWarning } from '@nextcloud/dialogs'
import { subscribe, unsubscribe, emit } from '@nextcloud/event-bus'
import CheckboxRadioSwitch from '@nextcloud/vue/dist/Components/CheckboxRadioSwitch'

export default {
	name: 'DetailsListItem',
	components: { DetailsGroupList, CheckboxRadioSwitch },
	mixins: [Formats],
	props: {
		detail: {
			type: Object,
			required: true,
		},
		checkedDetailGroups: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			opened: false,
			page: 0,
			totalPages: 0,
			loadingFiles: false,
			files: [],
			allFiles: [],
			paginatedFiles: {},
			checked: false,
			filesAscending: false,
			updating: false,
		}
	},
	computed: {
		...mapGetters([
			'task',
			'details',
			'groupItemsPerPage',
		]),
		groupFilesSize() {
			return this.allFiles.length > 0 ? this.allFiles.reduce((sum, file) => sum + file.filesize, 0) : 0
		},
	},
	watch: {
		checked() {
			const newCheckedDetailGroups = this.checkedDetailGroups
			const detailIndex = newCheckedDetailGroups.findIndex(d => d.id === this.detail.id)
			if (this.checked) {
				if (detailIndex === -1) {
					newCheckedDetailGroups.push(this.detail)
				}
			} else if (detailIndex !== -1) {
				newCheckedDetailGroups.splice(detailIndex, 1)
			}
			this.$emit('update:checkedDetailGroups', newCheckedDetailGroups)
		},
		filesAscending() {
			this.sortFiles(this.filesAscending)
		},
		checkedDetailGroups() {
			const detailIndex = this.checkedDetailGroups.findIndex(d => d.id === this.detail.id)
			if (!this.checked && detailIndex !== -1) {
				this.checked = true
			}
		},
		groupItemsPerPage(newGroupItemsPerPage) {
			if (this.opened) {
				if (this.page >= Math.ceil(JSON.parse(this.detail.group_files_ids).length / newGroupItemsPerPage)) {
					this.page = Math.ceil(JSON.parse(this.detail.group_files_ids).length / newGroupItemsPerPage) - 1
				}
				this.paginatedFiles = this.paginateFiles(this.allFiles)
				this.files = this.paginatedFiles[this.page]
			}
		},
		allFiles(newAllFiles) {
			if (this.page >= Math.ceil(newAllFiles.length / this.groupItemsPerPage)) {
				this.page = Math.ceil(newAllFiles.length / this.groupItemsPerPage) - 1
				this.paginatedFiles = this.paginateFiles(this.allFiles)
				this.files = this.paginatedFiles[this.page]
			}
		},
	},
	beforeMount() {
		const detailCheckedIndex = this.checkedDetailGroups.findIndex(d => d.id === this.detail.id)
		this.checked = detailCheckedIndex !== -1
		subscribe('updateGroupFilesPagination', this.updateFilesPagination)
		subscribe('deselectGroups', this.deselect)
		subscribe('openGroup', this.openGroup)
	},
	beforeDestroy() {
		unsubscribe('updateGroupFilesPagination', this.updateFilesPagination)
		unsubscribe('deselectGroups', this.deselect)
		unsubscribe('openGroup', this.openGroup)
	},
	methods: {
		openDetailFiles(detail) {
			if (!this.opened) {
				if (this.files === undefined || this.files.length === 0) {
					const taskId = detail.task_id
					const detailId = detail.id
					this.loadingFiles = true
					this.opened = true
					if (this.allFiles.length === 0) {
						this.loadAllFilesInfo(taskId, detailId)
					} else {
						this.files = this.paginatedFiles[this.page]
						this.loadingFiles = false
					}
				} else {
					this.opened = true
				}
			} else {
				this.opened = false
			}
		},
		openNextDetailFiles(detail) {
			if (this.page < Math.ceil(JSON.parse(detail.group_files_ids).length / this.groupItemsPerPage) - 1) {
				this.page += 1
				this.files = this.paginatedFiles[this.page]
			} else {
				showWarning(this.t('mediadc', 'Last page reached!'))
			}
		},
		openPrevDetailFiles(detail) {
			if (this.page > 0) {
				this.page -= 1
				this.files = this.paginatedFiles[this.page]
			} else {
				showWarning(this.t('mediadc', 'First page reached!'))
			}
		},
		loadAllFilesInfo(taskId, detailId) {
			axios.get(generateUrl(`/apps/mediadc/api/v1/tasks/${taskId}/files/${detailId}/all`)).then(res => {
				this.allFiles = res.data.files
				this.paginatedFiles = this.paginateFiles(this.allFiles)
				this.files = this.paginatedFiles[this.page]
				this.loadingFiles = false
			})
		},
		paginateFiles(files) {
			const paginatedFiles = []
			for (let i = 0; i < files.length; i++) {
				const last = paginatedFiles[paginatedFiles.length - 1]
				if (!last || last.length === this.groupItemsPerPage) {
					paginatedFiles.push([files[i]])
				} else {
					last.push(files[i])
				}
			}
			return paginatedFiles
		},
		removeTaskDetail(detail) {
			if (confirm(this.t('mediadc', 'Are you sure, you want remove this group without deleting files?'))) {
				this.updating = true
				axios.delete(generateUrl(`/apps/mediadc/api/v1/tasks/${detail.task_id}/detail/${detail.id}`)).then(res => {
					if (res.data.success) {
						emit('openNextDetailGroup', this.detail)
						const updatedDetails = [...this.details]
						const removedDetailIndex = updatedDetails.findIndex(d => d.id === this.detail.id)
						updatedDetails.splice(removedDetailIndex, 1)
						this.$store.dispatch('setDetails', updatedDetails)
						const checkedIndex = this.checkedDetailGroups.findIndex(d => d.id === detail.id)
						const newCheckedDetailGroups = [...this.checkedDetailGroups]
						if (this.checked && checkedIndex !== -1) {
							newCheckedDetailGroups.splice(checkedIndex, 1)
							this.$emit('update:checkedDetailGroups', newCheckedDetailGroups)
						}
						emit('updateTaskInfo')
						showSuccess(this.t('mediadc', 'Duplicate group succesffully removed'))
						const detailCheckedIndex = this.checkedDetailGroups.findIndex(d => d.id === detail.id)
						if (detailCheckedIndex !== -1) {
							const newCheckedDetailGroups = this.checkedDetailGroups
							newCheckedDetailGroups.splice(detailCheckedIndex, 1)
							this.$emit('update:checkedDetailGroups', newCheckedDetailGroups)
						}
						this.updating = false
					} else {
						showError(this.t('mediadc', 'Some error occured while deleting duplicate group'))
						this.updating = false
					}
				}).catch(err => {
					console.debug(err)
					showError(this.t('mediadc', 'Some error occured while deleting duplicate group'))
					this.updating = false
				})
			}
		},
		sortFiles(ascending) {
			this.allFiles.sort((a, b) => (ascending) ? a.filesize - b.filesize : b.filesize - a.filesize)
			this.paginatedFiles = this.paginateFiles(this.allFiles)
			this.files = this.paginatedFiles[this.page]
		},
		updateFilesPagination(file) {
			if (file) {
				const deletedFileIndex = this.allFiles.findIndex(f => f.fileid === file.fileid)
				if (deletedFileIndex !== -1) {
					this.allFiles.splice(deletedFileIndex, 1)
				}
			}
			this.paginatedFiles = this.paginateFiles(this.allFiles)
			this.files = this.paginatedFiles[this.page]
		},
		deselect(groupsToDeselect) {
			if (this.checked && groupsToDeselect.includes(this.detail.id)) {
				this.checked = false
			}
		},
		openGroup(detail) {
			if (this.detail.id === detail.id && !this.opened) {
				this.openDetailFiles(detail)
			}
		},
	},
}
</script>

<style scoped>
.details-list-item {
	width: 100%;
	padding: 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
	position: relative;
}

.details-list-item-title {
	display: flex;
	align-items: center;
}

.group-info {
	padding: 10px;
	border-radius: 20px;
	display: flex;
	align-items: center;
	user-select: none;
}

.group-info:hover {
	cursor: pointer;
	background-color: #eee;
}

.group-info:active {
	background-color: #ddd;
}

body.theme--dark .group-info:hover {
	background-color: #727272;
}

body.theme--dark .group-info:active {
	background-color: #5b5b5b;
}

.pagination {
	display: flex;
	align-items: center;
	/* margin: 10px 0; */
}

.pagination-button {
	padding: 20px;
	margin: 0 5px;
	width: 16px;
	height: 16px;
	cursor: pointer;
	border-radius: 50%;
	user-select: none;
}

.pagination-button:hover {
	background-color: #eee;
}

.pagination-button:active {
	background-color: #ddd;
}

body.theme--dark .pagination-button:hover {
	background-color: #727272;
}

body.theme--dark .pagination-button:active {
	background-color: #5b5b5b;
}

.open-details-btn {
	display: inline-flex;
	width: 16px;
	height: 16px;
	margin: 0 5px 0 10px;
	cursor: pointer;
}

.delete-group-btn {
	visibility: hidden;
	cursor: pointer;
	margin: 0 10px 0 5px;
	padding: 20px;
	border-radius: 50%;
}

.delete-group-btn:hover {
	background-color: #eee;
}

.delete-group-btn:active {
	background-color: #ddd;
}

body.theme--dark .delete-group-btn:hover {
	background-color: #727272;
}

body.theme--dark .delete-group-btn:active {
	background-color: #5b5b5b;
}

.details-list-item:hover .delete-group-btn {
	visibility: visible;
}

.action-blackout {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 5px;
}

.batch-checkbox {
	visibility: hidden;
	margin-right: 20px;
}

.batch-checkbox .checkbox-radio-switch__icon {
	margin-right: 0;
	color: #000;
}

.batch-checkbox.checkbox-radio-switch--checked {
	visibility: visible;
}

.details-list-item:hover .batch-checkbox {
	visibility: visible;
}

@media (max-width: 540px) {
	.delete-group-btn {
		visibility: visible;
	}

	.batch-checkbox {
		visibility: visible;
		margin-right: 10px;
	}
}
</style>
