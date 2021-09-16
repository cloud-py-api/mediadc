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
		<div class="details-list-item-title">
			<span class="icon-projects" style="margin: 0 10px 0 0;" />
			<span class="group-info" @click="openDetailFiles(detail)">
				{{ t('mediadc', 'Duplicate group') }} #{{ detail.id }} ({{ JSON.parse(detail.group_files_ids).length }}
				{{ t('mediadc', 'file(s)') }}{{ files.length > 0 ? ' - ' + formatBytes(getGroupFilesSize(files)) : '' }})
			</span>
			<span :class="!opened ? 'icon-triangle-s open-details-btn' : 'icon-triangle-n open-details-btn'" />
			<span class="icon-delete delete-group-btn" @click="deleteTaskDetail(detail)" />
		</div>
		<div v-if="opened && JSON.parse(detail.group_files_ids).length > itemsPerPage" class="pagination">
			<span class="icon-view-previous pagination-button"
				@click="openPrevDetailFiles(detail)" />
			<span>{{ t('mediadc', 'Page:') }}&nbsp;</span>
			<span>{{ page + 1 }}/{{ Math.ceil(JSON.parse(detail.group_files_ids).length / itemsPerPage) }}</span>
			<span class="icon-view-next pagination-button"
				@click="openNextDetailFiles(detail)" />
		</div>
		<DetailsGroupList v-show="opened" :files="files" :loading-files="loadingFiles" />
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import DetailsGroupList from './DetailsGroupList'
import Formats from '../../mixins/Formats'
import { mapGetters } from 'vuex'
import { showError, showSuccess, showWarning } from '@nextcloud/dialogs'
import { emit } from '@nextcloud/event-bus'

export default {
	name: 'DetailsListItem',
	components: { DetailsGroupList },
	mixins: [Formats],
	props: {
		detail: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			opened: false,
			page: 0,
			totalPages: 0,
			itemsPerPage: 10,
			loadingFiles: false,
			files: [],
			paginatedFiles: {},
		}
	},
	computed: {
		...mapGetters([
			'task',
			'details',
		]),
	},
	methods: {
		openDetailFiles(detail) {
			if (!this.opened) {
				if (this.files.length === 0) {
					const taskId = detail.task_id
					const detailId = detail.id
					this.loadingFiles = true
					this.opened = true
					if (!(this.page in this.paginatedFiles)) {
						this.loadFilesInfo(taskId, detailId)
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
			if (this.page < Math.ceil(JSON.parse(detail.group_files_ids).length / this.itemsPerPage) - 1) {
				this.page += 1
				const taskId = detail.task_id
				const detailId = detail.id
				this.loadingFiles = true
				if (!(this.page in this.paginatedFiles)) {
					this.loadFilesInfo(taskId, detailId)
				} else {
					this.files = this.paginatedFiles[this.page]
					this.loadingFiles = false
				}
			} else {
				showWarning(t('mediadc', 'Last page reached!'))
			}
		},
		openPrevDetailFiles(detail) {
			if (this.page > 0) {
				this.page -= 1
				const taskId = detail.task_id
				const detailId = detail.id
				this.loadingFiles = true
				if (!(this.page in this.paginatedFiles)) {
					this.loadFilesInfo(taskId, detailId)
				} else {
					this.files = this.paginatedFiles[this.page]
					this.loadingFiles = false
				}
			} else {
				showWarning(t('mediadc', 'First page reached!'))
			}
		},
		loadFilesInfo(taskId, detailId) {
			axios.get(generateUrl(`/apps/mediadc/api/v1/tasks/${taskId}/files/${detailId}?limit=${this.itemsPerPage}&page=${this.page}`)).then(res => {
				this.paginatedFiles[this.page] = res.data.map(file => ({
					...file,
					taskId,
					detailId,
				}))
				this.files = this.paginatedFiles[this.page]
				this.loadingFiles = false
			})
		},
		getGroupFilesSize(groupFiles) {
			return groupFiles.reduce((sum, file) => sum + file.filesize, 0)
		},
		deleteTaskDetail(detail) {
			if (confirm(t('mediadc', 'Are you sure, you want remove this group without deleting files?'))) {
				axios.delete(generateUrl(`/apps/mediadc/api/v1/tasks/${detail.task_id}/detail/${detail.id}`)).then(res => {
					if (res.data.success) {
						this.$store.dispatch('deleteDetail', detail)
						emit('updateTaskInfo')
						showSuccess(t('mediadc', 'Duplicate group succesffully removed'))
					} else {
						showError(t('mediadc', 'Some error occured while deleting duplicate group'))
					}
				})
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
}

.details-list-item-title {
	display: flex;
	align-items: center;
}

.details-list-item-title .group-info {
	cursor: pointer;
}

.details-list-item-title .group-info:hover {
	text-decoration: underline;
}

.pagination {
	display: flex;
	align-items: center;
	margin: 10px 0;
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
	margin: 0 10px;
}

.delete-group-btn {
	visibility: hidden;
	cursor: pointer;
	margin: 0 10px;
}

@media (max-width: 540px) {
	.delete-group-btn {
		visibility: visible;
	}
}

.details-list-item:hover .delete-group-btn {
	visibility: visible;
}
</style>
