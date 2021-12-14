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
	<div class="task-details">
		<div class="task-details-heading">
			<h3>
				{{ t('mediadc', 'Duplicates list') }}
				<span v-if="getStatusBadge(task) === 'finished'">
					- {{ details.length }} {{ translatePlural('mediadc', 'group, ', 'groups', details.length) }}
					({{ filestotal }} {{ translatePlural('mediadc', 'file', 'files', filestotal) }} - {{ formatBytes(filessize) }})
				</span>
			</h3>
			<div v-if="details.length > itemsPerPage" class="pagination">
				<span :class="!sorted ? 'icon-triangle-s toggle-sorting-button' : 'icon-triangle-n toggle-sorting-button'"
					:title="t('mediadc', 'Sorting details by files count')"
					@click="toggleSorting" />
				<span class="icon-view-previous pagination-button"
					@click="prevGroupsPage()" />
				<span>{{ t('mediadc', 'Page:') }}&nbsp;</span>
				<span>{{ page + 1 }}/{{ Math.ceil(details.length / itemsPerPage) }}</span>
				<span class="icon-view-next pagination-button"
					@click="nextGroupsPage()" />
			</div>
		</div>
		<div v-if="details.length > 0">
			<div class="filters">
				<label for="group-id-filter">
					{{ t('mediadc', 'Filter by duplicate group id: ') }}
					<input id="group-id-filter"
						v-model="filterId"
						type="search"
						name="group-id-filter"
						placeholder="#id"
						@input="filterByGroupId">
				</label>
				<div v-if="checkedDetailGroups.length > 0" class="batch-editing">
					{{ translatePlural('mediadc', 'Batch actions for %n group', 'Batch actions for %n groups', checkedDetailGroups.length) }}
					<div class="app-content-list-menu" style="margin: 0 0 0 10px; position: relative;">
						<div class="icon-more batch-actions-menu-button" @click="openBatchActionsPopup" />
						<div :class="batchActionsOpened ? 'popovermenu open' : 'popovermenu'"
							style="right: -1px;">
							<ul>
								<li>
									<a class="icon-checkmark" @click="selectAllGroups">
										<span>{{ checkedDetailGroups.length === details.length ? t('mediadc', 'Deselect all') : t('mediadc', 'Select all') }}</span>
									</a>
								</li>
								<li>
									<a class="icon-checkmark" @click="selectAllGroupsOnPage">
										<span>{{ checkedDetailGroupsIntersect.length === paginatedDetails[page].length ? t('mediadc', 'Deselect all on page') : t('mediadc', 'Select all on page') }}</span>
									</a>
								</li>
								<li>
									<a class="icon-close" @click="removeCheckedGroups">
										<span>{{ translatePlural('mediadc', 'Remove group', 'Remove groups', checkedDetailGroups.length) }}</span>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div v-if="batchUpdating" class="action-blackout">
				<span class="icon-loading" />
			</div>
			<div v-else-if="detailsFiltered === undefined || (detailsFiltered.length === 0 && (filterId === '' || filterId === null))">
				<div v-for="detail in paginatedDetails[page]"
					v-show="JSON.parse(detail.group_files_ids).length > 1"
					:key="detail.id"
					class="task-details-row">
					<DetailsListItem :detail="detail" :checked-detail-groups.sync="checkedDetailGroups" />
				</div>
			</div>
			<div v-else-if="detailsFiltered.length > 0">
				<div v-for="detail in detailsFiltered"
					v-show="JSON.parse(detail.group_files_ids).length > 1"
					:key="detail.id"
					class="task-details-row">
					<DetailsListItem :detail="detail" :checked-detail-groups.sync="checkedDetailGroups" />
				</div>
			</div>
			<div v-else>
				<p style="text-align: center; font-weight: bold;">
					{{ t('mediadc', 'No matching found') }}
				</p>
			</div>
		</div>
		<div v-else style="margin-top: 10px;">
			<strong>{{ t('mediadc', 'No duplicates found.') }}</strong>
		</div>
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import { showError, showSuccess, showWarning } from '@nextcloud/dialogs'
import { mapGetters } from 'vuex'
import Formats from '../../mixins/Formats'
import DetailsListItem from './DetailsListItem'
import { emit } from '@nextcloud/event-bus'

export default {
	name: 'DetailsList',
	components: { DetailsListItem },
	mixins: [Formats],
	props: {
		filessize: {
			type: Number,
			required: true,
		},
		filestotal: {
			type: Number,
			required: true,
		},
	},
	data() {
		return {
			page: 0,
			filterId: null,
			checkedDetailGroups: [],
			batchActionsOpened: false,
			batchActionResult: null,
			batchUpdating: false,
		}
	},
	computed: {
		...mapGetters([
			'task',
			'details',
			'sorted',
			'paginatedDetails',
			'itemsPerPage',
			'detailsFiltered',
		]),
		checkedDetailGroupsIntersect() {
			const a = new Set(this.paginatedDetails[this.page].map(d => d.id))
			const b = new Set(this.checkedDetailGroups.map(d => d.id))
			const intersect = new Set([...a].filter(i => b.has(i)))
			return Array.from(intersect)
		},
	},
	watch: {
		itemsPerPage(newItemsPerPage) {
			if (this.page >= Math.ceil(this.details.length / newItemsPerPage)) {
				this.page = Math.ceil(this.details.length / newItemsPerPage) - 1
			}
		},
		details(newDetails) {
			if (this.page >= Math.ceil(newDetails.length / this.itemsPerPage)) {
				this.page = Math.ceil(newDetails.length / this.itemsPerPage) - 1
			}
		},
	},
	beforeMount() {
		this.$emit('update:loading', false)
	},
	methods: {
		prevGroupsPage() {
			if (this.page > 0) {
				this.page -= 1
			} else {
				showWarning(this.t('mediadc', 'First page reached!'))
			}
		},
		nextGroupsPage() {
			if (this.page < Math.ceil(this.details.length / this.itemsPerPage) - 1) {
				this.page += 1
			} else {
				showWarning(this.t('mediadc', 'Last page reached!'))
			}
		},
		toggleSorting() {
			this.$store.dispatch('setSorted', !this.sorted)
		},
		filterByGroupId() {
			if (this.filterId !== null && this.filterId !== '') {
				this.$store.dispatch('setDetailsFiltered', this.details.filter(d => d.id.toString().includes(this.filterId)))
			} else {
				this.$store.dispatch('setDetailsFiltered', [])
			}
		},
		openBatchActionsPopup() {
			document.addEventListener('click', this.toggleBatchActionsPopup)
		},
		toggleBatchActionsPopup() {
			if (this.batchActionsOpened) {
				document.removeEventListener('click', this.toggleBatchActionsPopup)
			}
			this.batchActionsOpened = !this.batchActionsOpened
		},
		removeCheckedGroups() {
			axios.post(generateUrl(`/apps/mediadc/api/v1/tasks/${this.task.id}/details/remove`), { taskDetailIds: this.checkedDetailGroups.map(d => d.id) }).then(res => {
				if (res.data.success) {
					emit('updateTaskInfo')
					const updatedDetails = this.details
					for (const taskDetail of res.data.removedTaskDetails) {
						const detailIndex = this.checkedDetailGroups.findIndex(d => d.id === taskDetail.id)
						this.checkedDetailGroups.splice(detailIndex, 1)
						const removedDetailIndex = updatedDetails.findIndex(d => d.id === taskDetail.id)
						updatedDetails.splice(removedDetailIndex, 1)
					}
					this.$store.dispatch('setDetails', updatedDetails)
					showSuccess(this.t('mediadc', 'Selected groups successfully removed'))
				}
			}).catch(err => {
				showError(this.t('mediadc', 'Some server error occured'))
				console.debug(err)
			})
		},
		selectAllGroups() {
			if (this.checkedDetailGroups.length === this.details.length) {
				emit('deselectGroups', this.checkedDetailGroups.map(d => d.id))
				for (const detail of this.details) {
					const detailIndex = this.checkedDetailGroups.findIndex(d => d.id === detail.id)
					if (detailIndex !== -1) {
						this.checkedDetailGroups.splice(detailIndex, 1)
					}
				}
				setTimeout(() => { this.batchUpdating = false }, 300)
			} else {
				for (const detail of this.details) {
					const detailIndex = this.checkedDetailGroups.findIndex(d => d.id === detail.id)
					if (detailIndex === -1) {
						this.checkedDetailGroups.push(detail)
					}
				}
			}
		},
		selectAllGroupsOnPage() {
			if (this.paginatedDetails[this.page].length === this.checkedDetailGroupsIntersect.length) {
				const groupsToDeselect = this.checkedDetailGroupsIntersect
				emit('deselectGroups', groupsToDeselect)
				for (const detail of groupsToDeselect) {
					const detailIndex = this.checkedDetailGroups.findIndex(d => d.id === detail.id)
					if (detailIndex !== -1) {
						this.checkedDetailGroups.splice(detailIndex, 1)
					}
				}
			} else {
				for (const detail of this.paginatedDetails[this.page]) {
					const detailIndex = this.checkedDetailGroups.findIndex(d => d.id === detail.id)
					if (detailIndex === -1) {
						this.checkedDetailGroups.push(detail)
					}
				}
			}
		},
	},
}
</script>

<style scoped>
.task-details {
	width: 100%;
	padding: 10px 10px 20px 20px;
	border: 1px solid #dadada;
	border-radius: 5px;
	overflow-y: scroll;
	margin: 0 auto;
}

.task-details-heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
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

.task-details-heading h3 {
	margin: 0;
}

@media (max-width: 540px) {
	.task-details-heading {
		flex-direction: column;
		text-align: center;
	}
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

.sorting {
	display: flex;
}

.toggle-sorting-button {
	padding: 20px;
	border-radius: 50%;
	user-select: none;
	cursor: pointer;
}

.pagination-button:hover, .toggle-sorting-button:hover {
	background-color: #eee;
}

.pagination-button:active, .toggle-sorting-button:active {
	background-color: #ddd;
}

body.theme--dark .pagination-button:hover, body.theme--dark .toggle-sorting-button:hover {
	background-color: #727272;
}

body.theme--dark .pagination-button:active, body.theme--dark .toggle-sorting-button:active {
	background-color: #5b5b5b;
}

body.theme--dark .task-details {
	border-color: #717171;
}

.task-details-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border: 1px solid #dedede;
	border-radius: 5px;
	margin-bottom: 5px;
	transition: height .3s;
}

.filters {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 5px 10px;
	margin: 10px 0;
	border: 1px solid #dadada;
	border-radius: 5px;
}

body.theme--dark .task-details-row, body.theme--dark .filters {
	border-color: #717171;
}

@media (max-width: 540px) {
	.filters {
		flex-direction: column;
	}
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

.batch-actions-menu-button:hover {
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
}
</style>
