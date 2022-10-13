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
	<div class="details-list-item" :class="{'icon-loading': updating}">
		<div class="details-list-item-title">
			<CheckboxRadioSwitch v-tooltip="{content: t('mediadc', 'Select group'), placement: 'top'}"
				class="mediadc-checkbox-only batch-checkbox"
				:checked.sync="checked" />
			<Button type="tertiary" class="open-details-btn" @click="openDetailFiles(detail)">
				<template #icon>
					<span class="icon-projects" />
				</template>
				<template #default>
					{{ t('mediadc', 'Duplicate group') }} #{{ detail.virtualId }} ({{ JSON.parse(detail.group_files_ids).length }}
					{{ translatePlural('mediadc', 'file', 'files', JSON.parse(detail.group_files_ids).length) }}{{ Array.isArray(files) && files.length > 0 ? ' - ' + formatBytes(groupFilesSize) : '' }})
					<span :class="!opened ? 'icon-triangle-s' : 'icon-triangle-n'"
						style="display: inline-flex; margin: 0 0 0 5px;" />
				</template>
			</Button>
			<Actions>
				<ActionButton icon="icon-delete delete-group-btn" @click="removeTaskDetail(detail)">
					{{ t('mediadc', 'Remove group without deleting files') }}
				</ActionButton>
			</Actions>
		</div>
		<div v-if="opened && JSON.parse(detail.group_files_ids).length > groupItemsPerPage" class="pagination">
			<Button type="tertiary" style="margin-right: 5px;" @click="openPrevDetailFiles(detail)">
				<template #icon>
					<span class="icon-view-previous" />
				</template>
			</Button>
			<span>{{ t('mediadc', 'Page:') }}&nbsp;</span>
			<span>{{ page + 1 }}/{{ Math.ceil(JSON.parse(detail.group_files_ids).length / groupItemsPerPage) }}</span>
			<Button type="tertiary" style="margin-left: 5px;" @click="openNextDetailFiles(detail)">
				<template #icon>
					<span class="icon-view-next" />
				</template>
			</Button>
			<select v-model="goToPage" style="margin-left: 5px;" name="to_page" id="to_page">
				<option v-for="page of pagesRange" :key="page" :value="page">{{ page + 1 }}</option>
			</select>
			<Button v-if="JSON.parse(detail.group_files_ids).length > groupItemsPerPage"
				v-tooltip="t('mediadc', 'Go to page')"
				type="tertiary"
				@click="navigateToPage">
				<template #icon>
					<span class="icon-confirm" />
				</template>
			</Button>
		</div>
		<Transition name="fade">
			<DetailsGroupList v-if="opened"
				:detail="detail"
				:files="files"
				:all-files="allFiles"
				:loading-files.sync="loadingFiles"
				:updating.sync="updating"
				:files-ascending.sync="filesAscending" />
		</Transition>
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
import Actions from '@nextcloud/vue/dist/Components/Actions'
import ActionButton from '@nextcloud/vue/dist/Components/ActionButton'
import Button from '@nextcloud/vue/dist/Components/Button'

export default {
	name: 'DetailsListItem',
	components: {
		Actions,
		ActionButton,
		Button,
		CheckboxRadioSwitch,
		DetailsGroupList,
	},
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
			goToPage: 0,
		}
	},
	computed: {
		...mapGetters([
			'task',
			'details',
			'groupItemsPerPage',
			'deleteFileConfirmation',
		]),
		groupFilesSize() {
			return this.allFiles.length > 0 ? this.allFiles.reduce((sum, file) => sum + file.filesize, 0) : 0
		},
		pagesRange() {
			return Array.from({ length: Math.ceil(JSON.parse(this.detail.group_files_ids).length / this.groupItemsPerPage) }, (_, i) => i)
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
				if (this.goToPage >= Math.ceil(JSON.parse(this.detail.group_files_ids).length / newGroupItemsPerPage)) {
					this.goToPage = Math.ceil(JSON.parse(this.detail.group_files_ids).length / newGroupItemsPerPage) - 1
				}
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
		subscribe('toggleGroup', this.toggleGroup)
	},
	beforeDestroy() {
		unsubscribe('updateGroupFilesPagination', this.updateFilesPagination)
		unsubscribe('deselectGroups', this.deselect)
		unsubscribe('openGroup', this.openGroup)
		unsubscribe('toggleGroup', this.toggleGroup)
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
			if (this.deleteFileConfirmation) {
				if (confirm(this.t('mediadc', 'Are you sure, you want remove this group without deleting files?'))) {
					this._removeTaskDetail(detail)
				}
			} else {
				this._removeTaskDetail(detail)
			}
		},
		_removeTaskDetail(detail) {
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
		toggleGroup(detail) {
			if (this.detail.id === detail.id) {
				this.openDetailFiles(detail)
			}
		},
		navigateToPage() {
			this.page = this.goToPage
			this.files = this.paginatedFiles[this.page]
		},
	},
}
</script>

<style>
.open-details-btn .button-vue__text {
	display: inline-flex;
	align-items: center;
	justify-content: center;
}
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

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

.pagination {
	display: flex;
	align-items: center;
}

.group-info {
	display: flex;
	align-items: center;
	user-select: none;
}

.delete-group-btn {
	visibility: hidden;
}

.details-list-item:hover .delete-group-btn {
	visibility: visible;
}

.batch-checkbox {
	visibility: hidden;
	margin-right: 14px;
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
