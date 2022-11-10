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
	<div v-if="!loadingFiles" class="details-group">
		<div class="filters">
			<div class="sorting">
				{{ t('mediadc', 'Files size sorting') }}
				<Button type="tertiary" style="margin: 0 10px;" @click="updateFileSorting">
					<template #icon>
						<span :class="filesAscending ? 'icon-triangle-s sorting-group-files-btn' : 'icon-triangle-n sorting-group-files-btn'" />
					</template>
				</Button>
			</div>
			<div class="search">
				<label for="filename-filter">
					{{ t('mediadc', 'Filter by filename: ') }}
					<input id="filename-filter"
						v-model="filterFileName"
						type="search"
						name="filename-filter"
						:placeholder="t('mediadc', 'Filename or part')"
						@input="filterByFileName">
				</label>
			</div>
			<div v-if="checkedFiles.length > 0" class="batch-editing">
				{{ n('mediadc', 'Batch actions for %n file', 'Batch actions for %n files', checkedFiles.length) }}
				<Actions placement="left" style="margin-left: 5px;">
					<ActionButton v-tooltip="{content: t('mediadc', 'Select all files in a group'), placement: 'left'}" icon="icon-checkmark" @click="selectAllFiles">
						{{ checkedFiles.length === allFiles.length ? t('mediadc', 'Deselect all') : t('mediadc', 'Select all') }}
					</ActionButton>
					<ActionButton v-if="JSON.parse(detail.group_files_ids).length > groupItemsPerPage" icon="icon-checkmark" @click="selectAllFilesOnPage">
						{{ checkedFilesIntersect.length === files.length ? t('mediadc', 'Deselect all on page') : t('mediadc', 'Select all on page') }}
					</ActionButton>
					<ActionButton v-tooltip="{content: t('mediadc', 'Mark as resolved without deleting'), placement: 'left'}" icon="icon-close" @click="removeCheckedFiles">
						{{ n('mediadc', 'Remove file', 'Remove files', checkedFiles.length) }}
					</ActionButton>
					<ActionButton v-tooltip="{content: n('mediadc', 'Delete selected file', 'Delete selected files', checkedFiles.length), placement: 'left'}" icon="icon-delete" @click="deleteCheckedFiles">
						{{ n('mediadc', 'Delete file', 'Delete files', checkedFiles.length) }}
					</ActionButton>
				</Actions>
			</div>
		</div>
		<div v-if="!filesFiltered" class="details-group-files">
			<DetailsFile v-for="file in files"
				:key="file.fileid"
				:file="file"
				:files="files"
				:all-files="allFiles"
				:checked-files.sync="checkedFiles"
				:detail="detail" />
		</div>
		<div v-else-if="filteredFiles.length > 0" class="details-group-files">
			<DetailsFile v-for="file in filteredFiles"
				:key="file.fileid"
				:file="file"
				:files="files"
				:all-files="allFiles"
				:checked-files.sync="checkedFiles"
				:detail="detail" />
		</div>
		<div v-else class="details-group-files">
			<p style="margin: 0 0 10px;">
				{{ t('mediadc', 'No matches on this page') }}
			</p>
		</div>
	</div>
	<div v-else>
		<span class="icon-loading" style="width: 20px; height: 20px; display: flex; margin: 20px auto;" />
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { mapGetters } from 'vuex'
import { showError, showMessage, showSuccess, showWarning } from '@nextcloud/dialogs'
import { generateUrl } from '@nextcloud/router'
import { emit } from '@nextcloud/event-bus'

import Actions from '@nextcloud/vue/dist/Components/Actions.js'
import ActionButton from '@nextcloud/vue/dist/Components/ActionButton.js'
import Button from '@nextcloud/vue/dist/Components/Button.js'

import Formats from '../../mixins/Formats.js'
import DetailsFile from './DetailsFile.vue'

export default {
	name: 'DetailsGroupList',
	components: {
		DetailsFile,
		Actions,
		ActionButton,
		Button, // eslint-disable-line vue/no-reserved-component-names
	},
	mixins: [Formats],
	props: {
		files: {
			type: Array,
			required: true,
			default: () => [],
		},
		allFiles: {
			type: Array,
			required: true,
			default: () => [],
		},
		detail: {
			type: Object,
			required: true,
		},
		loadingFiles: {
			type: Boolean,
			required: true,
		},
		updating: {
			type: Boolean,
			required: true,
		},
		filesAscending: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		return {
			checkedFiles: [],
			batchActionsOpened: false,
			filesFiltered: false,
			filterFileName: '',
			filteredFiles: [],
		}
	},
	computed: {
		...mapGetters([
			'detailsGridSize',
			'deleteFileConfirmation',
			'groupItemsPerPage',
			'details',
		]),
		checkedFilesIntersect() {
			const a = new Set(this.files)
			const b = new Set(this.checkedFiles)
			const intersect = new Set([...a].filter(i => b.has(i)))
			return Array.from(intersect)
		},
	},
	watch: {
		files() {
			this.filterByFileName()
		},
	},
	methods: {
		openBatchActionsPopup() {
			document.addEventListener('click', this.toggleBatchActionsPopup)
		},
		toggleBatchActionsPopup() {
			if (this.batchActionsOpened) {
				document.removeEventListener('click', this.toggleBatchActionsPopup)
			}
			this.batchActionsOpened = !this.batchActionsOpened
		},
		selectAllFiles() {
			if (this.checkedFiles.length === this.allFiles.length) { // Deselect files
				emit('deselectFiles', this.checkedFiles)
				for (const file of this.allFiles) {
					const fileIndex = this.checkedFiles.findIndex(f => f.fileid === file.fileid)
					if (fileIndex !== -1) {
						this.checkedFiles.splice(fileIndex, 1)
					}
				}
			} else {
				for (const file of this.allFiles) {
					const fileIndex = this.checkedFiles.findIndex(f => f.fileid === file.fileid)
					if (fileIndex === -1) {
						this.checkedFiles.push(file)
					}
				}
			}
		},
		selectAllFilesOnPage() {
			if (this.files.length === this.checkedFilesIntersect.length) {
				const filesToDeselect = this.checkedFilesIntersect
				emit('deselectFiles', filesToDeselect)
				for (const fileid of filesToDeselect.map(f => f.fileid)) {
					const fileIndex = this.checkedFiles.findIndex(f => f.fileid === fileid)
					if (fileIndex !== -1) {
						this.checkedFiles.splice(fileIndex, 1)
					}
				}
			} else {
				for (const file of this.files) {
					const fileIndex = this.checkedFiles.findIndex(f => f.fileid === file.fileid)
					if (fileIndex === -1) {
						this.checkedFiles.push(file)
					}
				}
			}
		},
		removeCheckedFiles() {
			this.$emit('update:updating', true)
			axios.post(generateUrl(`/apps/mediadc/api/v1/tasks/${this.detail.task_id}/files/${this.detail.id}/remove`), { fileIds: this.checkedFiles.map(f => f.fileid) }).then(res => {
				if (res.data.success) {
					const allFiles = this.allFiles
					if ((this.allFiles.length - this.checkedFiles.length) <= 1) {
						emit('openNextDetailGroup', this.detail)
						// Remove detail
						this.$store.commit('deleteDetail', this.detail)
						if ((this.allFiles.length - this.checkedFiles.length) === 1) {
							showMessage(this.t('mediadc', 'Group successfully removed (1 file left)'))
						}
					}
					for (const fileid of res.data.removedFileIds) {
						const fileidIndex = allFiles.findIndex(f => f.fileid === fileid)
						allFiles.splice(fileidIndex, 1)
						const checkedFileIdIndex = this.checkedFiles.findIndex(f => f.fileid === fileid)
						if (checkedFileIdIndex !== -1) {
							this.checkedFiles.splice(checkedFileIdIndex, 1)
						}
					}
					emit('updateTaskInfo')
					this.$emit('update:allFiles', allFiles)
					emit('updateGroupFilesPagination')
					this.$emit('update:updating', false)
					showSuccess(this.t('mediadc', 'Checked files successfully removed'))
				}
			}).catch(err => {
				console.debug(err)
				showError(this.t('mediadc', 'A server error occurred'))
				this.$emit('update:updating', false)
			})
		},
		deleteCheckedFiles() {
			if (this.allFiles.length === this.checkedFiles.length) {
				if (confirm(this.t('mediadc', 'Are you sure you want to delete all files'))) {
					this._deleteCheckedFiles()
				}
			} else {
				this._deleteCheckedFiles()
			}
		},
		_deleteCheckedFiles() {
			this.$emit('update:updating', true)
			axios.post(generateUrl(`/apps/mediadc/api/v1/tasks/${this.detail.task_id}/files/${this.detail.id}/delete`), { fileIds: this.checkedFiles.map(f => f.fileid) }).then(res => {
				if (res.data.success) {
					this._updateDeletedFiles(res)
				} else if (!res.data.success && res.data.deletedFileIds.length > 0) {
					showWarning(this.t('mediadc', 'Not all files deleted'))
					this._updateDeletedFiles(res)
				} else {
					console.debug(res.data.errors)
					showError(this.t('mediadc', 'A server error occurred. Files not deleted'))
					this.$emit('update:updating', false)
				}
			}).catch(err => {
				console.debug(err)
				showError(this.t('mediadc', 'A server error occurred'))
				this.$emit('update:updating', false)
			})
		},
		_updateDeletedFiles(res) {
			const allFiles = this.allFiles
			if ((this.allFiles.length - this.checkedFiles.length) <= 1 && res.data.deletedFileIds.length === this.checkedFiles.length) {
				emit('openNextDetailGroup', this.detail)
				// Remove detail
				this.$store.commit('deleteDetail', this.detail)
				if ((this.allFiles.length - this.checkedFiles.length) === 1) {
					showMessage(this.t('mediadc', 'Group successfully removed (1 file left)'))
				}
			}

			for (const fileid of res.data.deletedFileIds) {
				const fileidIndex = allFiles.findIndex(f => f.fileid === fileid)
				allFiles.splice(fileidIndex, 1)
				const checkedFileIdIndex = this.checkedFiles.findIndex(f => f.fileid === fileid)
				if (checkedFileIdIndex !== -1) {
					this.checkedFiles.splice(checkedFileIdIndex, 1)
				}
			}

			emit('updateTaskInfo')
			this.$emit('update:allFiles', allFiles)
			emit('updateGroupFilesPagination')
			this.$emit('update:updating', false)
			showSuccess(this.t('mediadc', 'Checked files successfully deleted'))
		},
		filterByFileName() {
			if (this.filterFileName !== '') {
				this.filesFiltered = true
				this.filteredFiles = this.files.filter(f => f.filename.toLowerCase().includes(this.filterFileName.toLowerCase()))
			} else {
				this.filesFiltered = false
				this.filteredFiles = []
			}
		},
		updateFileSorting() {
			this.$emit('update:filesAscending', !this.filesAscending)
		},
	},
}
</script>

<style scoped>
.details-group {
	width: 100%;
	border-top: 1px solid var(--color-border-dark);
	border-bottom: 1px solid var(--color-border-dark);
	margin: 10px 0;
}

.details-group-files {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	max-height: 100vh;
	overflow-y: scroll;
}

@media (max-width: 540px) {
	.file {
		max-width: 192px;
	}

	.filters {
		flex-direction: column;
	}
}

.file:hover {
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, .25);
}

.filters {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 5px 10px;
	margin: 10px 0;
	border: 1px solid var(--color-border-dark);
	border-radius: 5px;
}

.search {
	display: flex;
	align-items: center;
	justify-content: center;
}

.sorting {
	display: flex;
	align-items: center;
	justify-content: center;
}

.batch-editing {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
}

.batch-actions-menu-button {
	padding: 20px;
	border-radius: 50%;
	cursor: pointer;
	user-select: none;
}

/* .batch-actions-menu-button:hover {
	background-color: #eee;
}

.batch-actions-menu-button:active {
	background-color: #ddd;
}

body.theme--dark .batch-actions-menu-button:hover {
	background-color: #727272;
}

body.theme--dark .batch-actions-menu-button:active {
	background-color: #5b5b5b;
} */
</style>
