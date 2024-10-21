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
	<div class="task-details">
		<div class="task-details-heading">
			<h3>
				{{ t('mediadc', 'Duplicates list') }}
				<span v-if="getStatusBadge(task) === 'finished'">
					- {{ details.length }} {{ n('mediadc', 'group ', 'groups', details.length) }}
				</span>
				<span v-if="detailsInfo.filestotal !== -1 && detailsInfo.filessize !== -1">
					({{ detailsInfo.filestotal }} {{ n('mediadc', 'file', 'files', detailsInfo.filestotal) }} - {{ formatBytes(detailsInfo.filessize) }})
				</span>
			</h3>
			<div class="pagination-wrapper">
				<div class="pagination-sorting">
					<NcCheckboxRadioSwitch :checked.sync="sortGroups" style="margin-right: 20px;">
						{{ t('mediadc', 'Sort groups') }}
					</NcCheckboxRadioSwitch>
					<NcButton v-tooltip="t('mediadc', 'Sorting details by files count')"
						type="tertiary"
						:aria-label="t('mediadc', 'Sorting details by files count')"
						@click="toggleSorting">
						<template #icon>
							<span :class="!sorted ? 'icon-triangle-s toggle-sorting-button' : 'icon-triangle-n toggle-sorting-button'" />
						</template>
					</NcButton>
				</div>
				<Pagination :details="(!filtered) ? details : detailsFiltered"
					:prev-groups-page="prevGroupsPage"
					:next-groups-page="nextGroupsPage"
					:page.sync="page" />
			</div>
		</div>
		<div v-if="details.length > 0">
			<div class="filters">
				<label for="group-id-filter">
					{{ t('mediadc', 'Filter by duplicate group id: ') }}
					<input id="group-id-filter"
						v-model="filterId"
						v-tooltip="t('mediadc', 'Filter by id or range of ids (1-10)')"
						type="search"
						name="group-id-filter"
						placeholder="#id"
						style="max-width: 33%;"
						@input="filterByGroupId">
				</label>
				<div class="batch-actions" style="display: flex;">
					<NcButton v-tooltip="t('mediadc', 'Toggle duplicate groups')"
						type="tertiary"
						:aria-label="t('mediadc', 'Toggle duplicate groups')"
						style="margin-right: 10px;"
						@click="toggleGroups">
						<template #icon>
							<span class="icon-category-organization" />
						</template>
						<template #default>
							{{ t('mediadc', 'Toggle groups') }}
						</template>
					</NcButton>
					<div v-if="checkedDetailGroups.length > 0" class="batch-editing">
						{{ n('mediadc', 'Batch actions for %n group', 'Batch actions for %n groups', checkedDetailGroups.length) }}
						<NcActions placement="top" style="margin-left: 5px;">
							<template v-if="!filtered">
								<NcActionButton @click="selectAllGroups">
									<template #icon>
										<CheckAll :size="20" />
									</template>
									{{ checkedDetailGroups.length === details.length ? t('mediadc', 'Deselect all') : t('mediadc', 'Select all') }}
								</NcActionButton>
								<NcActionButton v-if="details.length > itemsPerPage" @click="selectAllGroupsOnPage">
									<template #icon>
										<CheckUnderline :size="20" />
									</template>
									{{ checkedDetailGroupsIntersect.length === paginatedDetails[page].length || checkedDetailGroupsIntersect.length === paginatedSortedDetails[page].length ? t('mediadc', 'Deselect all on page') : t('mediadc', 'Select all on page') }}
								</NcActionButton>
							</template>
							<template v-else>
								<NcActionButton @click="selectAllGroups">
									<template #icon>
										<CheckAll :size="20" />
									</template>
									{{ checkedDetailGroups.length === detailsFiltered.length ? t('mediadc', 'Deselect all') : t('mediadc', 'Select all') }}
								</NcActionButton>
								<NcActionButton v-if="detailsFiltered.length > itemsPerPage" @click="selectAllGroupsOnPage">
									<template #icon>
										<CheckUnderline :size="20" />
									</template>
									{{ checkedDetailGroupsIntersect.length === paginatedDetailsFiltered[page].length ? t('mediadc', 'Deselect all on page') : t('mediadc', 'Select all on page') }}
								</NcActionButton>
							</template>
							<NcActionButton v-if="checkedDetailGroups.length > 0" @click="_deselectAllGroups((!filtered) ? details : detailsFiltered)">
								<template #icon>
									<MinusBoxOutline :size="20" />
								</template>
								{{ t('mediadc', 'Uncheck selected') }}
							</NcActionButton>
							<NcActionButton v-tooltip="{content: t('mediadc', 'Mark all files in group as resolved'), placement: 'left'}"
								icon="icon-close"
								@click="removeCheckedGroups">
								{{ n('mediadc', 'Remove group', 'Remove groups', checkedDetailGroups.length) }}
							</NcActionButton>
							<NcActionButton v-tooltip="{content: t('mediadc', 'Delete all files except the largest one'), placement: 'left'}"
								icon="icon-delete"
								:disabled="batchDeleting"
								@click="deleteCheckedGroupsFiles">
								<template v-if="!batchDeleting" #icon>
									<span class="icon-delete material-design-icon" />
								</template>
								<template v-else #icon>
									<NcLoadingIcon :size="20" />
								</template>
								{{ t('mediadc', 'Delete files') }}
							</NcActionButton>
						</NcActions>
					</div>
				</div>
			</div>
			<div v-if="!filtered">
				<template v-if="sortGroups">
					<div v-for="detail in paginatedSortedDetails[page]"
						v-show="detail.files.length > 1"
						:key="detail.group_id"
						class="task-details-row">
						<DetailsListItem :detail="detail" :checked-detail-groups.sync="checkedDetailGroups" />
					</div>
				</template>
				<template v-else>
					<div v-for="detail in paginatedDetails[page]"
						v-show="detail.files.length > 1"
						:key="detail.group_id"
						class="task-details-row">
						<DetailsListItem :detail="detail" :checked-detail-groups.sync="checkedDetailGroups" />
					</div>
				</template>
			</div>
			<div v-else-if="detailsFiltered.length > 0 && filtered">
				<template v-if="!sortGroups">
					<div v-for="detail in paginatedDetailsFiltered[page]"
						v-show="detail.files.length > 1"
						:key="detail.group_id"
						class="task-details-row">
						<DetailsListItem :detail="detail" :checked-detail-groups.sync="checkedDetailGroups" />
					</div>
				</template>
				<template v-else>
					<div v-for="detail in paginatedDetailsFilteredSorted[page]"
						v-show="detail.files.length > 1"
						:key="detail.group_id"
						class="task-details-row">
						<DetailsListItem :detail="detail" :checked-detail-groups.sync="checkedDetailGroups" />
					</div>
				</template>
			</div>
			<div v-else>
				<p style="text-align: center; font-weight: bold;">
					{{ t('mediadc', 'No matchings found') }}
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
import { subscribe, unsubscribe, emit } from '@nextcloud/event-bus'
import {
	NcCheckboxRadioSwitch,
	NcButton,
	NcActions,
	NcActionButton,
	NcLoadingIcon,
} from '@nextcloud/vue'
import MinusBoxOutline from 'vue-material-design-icons/MinusBoxOutline.vue'
import CheckAll from 'vue-material-design-icons/CheckAll.vue'
import CheckUnderline from 'vue-material-design-icons/CheckUnderline.vue'

import { mapGetters } from 'vuex'

import Formats from '../../mixins/Formats.js'

import DetailsListItem from './DetailsListItem.vue'
import Pagination from './Pagination.vue'

export default {
	name: 'DetailsList',
	components: {
		DetailsListItem,
		NcCheckboxRadioSwitch,
		NcButton,
		NcActions,
		NcActionButton,
		Pagination,
		MinusBoxOutline,
		CheckAll,
		CheckUnderline,
		NcLoadingIcon,
	},
	mixins: [Formats],
	data() {
		return {
			page: 0,
			filterId: null,
			checkedDetailGroups: [],
			batchActionsOpened: false,
			sortGroups: true,
			batchDeleting: false,
		}
	},
	computed: {
		...mapGetters([
			'task',
			'taskInfo',
			'details',
			'detailsInfo',
			'sortedDetails',
			'sorted',
			'paginatedDetails',
			'paginatedSortedDetails',
			'paginatedDetailsFiltered',
			'paginatedDetailsFilteredSorted',
			'itemsPerPage',
			'detailsFiltered',
			'detailsFilteredSorted',
			'autoOpenNextGroup',
		]),
		filtered() {
			return this.filterId !== '' && this.filterId !== null
		},
		checkedDetailGroupsIntersect() {
			let a = []
			if (!this.sortGroups) {
				if (this.filtered) {
					a = new Set(this.paginatedDetailsFiltered[this.page].map(d => d.group_id))
				} else {
					a = new Set(this.paginatedDetails[this.page].map(d => d.group_id))
				}
			} else {
				if (this.filtered) {
					a = new Set(this.paginatedDetailsFilteredSorted[this.page].map(d => d.group_id))
				} else {
					a = new Set(this.paginatedSortedDetails[this.page].map(d => d.group_id))
				}
			}
			const b = new Set(this.checkedDetailGroups.map(d => d.group_id))
			const intersect = new Set([...a].filter(i => b.has(i)))
			return Array.from(intersect)
		},
		pagesRange() {
			if (this.filterId === null) {
				return Array.from({ length: Math.ceil(this.details.length / this.itemsPerPage) }, (_, i) => i)
			} else {
				return Array.from({ length: Math.ceil(this.detailsFiltered.length / this.itemsPerPage) }, (_, i) => i)
			}
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
		sortGroups() {
			window.localStorage.setItem('mediadc_details_sort_groups', this.sortGroups)
			this.$store.commit('setSortGroups', this.sortGroups)
		},
	},
	beforeMount() {
		this.$emit('update:loading', false)
		const sortGroups = window.localStorage.getItem('mediadc_details_sort_groups')
		this.sortGroups = sortGroups !== null ? JSON.parse(sortGroups) === true : true
		this.$store.commit('setSortGroups', sortGroups !== null ? JSON.parse(sortGroups) === true : true)
		subscribe('openNextDetailGroup', this.openNextDetailGroup)
	},
	beforeDestroy() {
		unsubscribe('openNextDetailGroup', this.openNextDetailGroup)
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
			if (!this.filtered && this.page < Math.ceil(this.details.length / this.itemsPerPage) - 1) {
				this.page += 1
			} else if (this.page < Math.ceil(this.detailsFiltered.length / this.itemsPerPage) - 1) {
				this.page += 1
			} else {
				showWarning(this.t('mediadc', 'Last page reached!'))
			}
		},
		toggleSorting() {
			this.$store.commit('setSorted', !this.sorted)
		},
		filterByGroupId() {
			if (this.filterId !== null && this.filterId !== '') {
				const singleIdRegex = /^[1-9]$/s
				const rangeIdsRegex = /^\d+-\d+$/s // TODO: /(^\d+-\d+)(, ?\d+-\d+)*$/s
				this.page = 0

				if (singleIdRegex.test(this.filterId)) {
					this.$store.commit('setDetailsFiltered', this.details.filter(d => d.group_id.toString().includes(this.filterId)))
				} else if (rangeIdsRegex.test(this.filterId)) {
					const beginRange = this.filterId.split('-')[0]
					const endRange = this.filterId.split('-')[1]
					this.$store.commit('setDetailsFiltered', this.details.filter(d => Number(d.group_id) >= beginRange && Number(d.group_id) <= endRange))
				}
			} else {
				this.$store.commit('setDetailsFiltered', [])
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
			axios.post(generateUrl(`/apps/mediadc/api/v1/tasks/${this.task.id}/details/remove`), { groupIds: this.checkedDetailGroups.map(d => d.group_id) }).then(res => {
				if (res.data.success) {
					emit('openNextDetailGroup', this.checkedDetailGroups[this.checkedDetailGroups.length - 1])
					const updatedDetails = [...this.details]
					for (const removedGroupId of res.data.removedGroupIds) {
						const checkedIndex = this.checkedDetailGroups.findIndex(d => Number(d.group_id) === removedGroupId)
						if (checkedIndex !== -1) {
							this.checkedDetailGroups.splice(checkedIndex, 1)
						}
						const removedDetailIndex = updatedDetails.findIndex(d => Number(d.group_id) === removedGroupId)
						updatedDetails.splice(removedDetailIndex, 1)
					}
					emit('updateTaskInfo')
					this.$store.commit('setDetails', updatedDetails)
					showSuccess(this.t('mediadc', 'Selected groups successfully removed'))
				}
			}).catch(err => {
				showError(this.t('mediadc', 'A server error occurred'))
				console.debug(err)
			})
		},
		_deselectAllGroups(_details) {
			emit('deselectGroups', this.checkedDetailGroups.map(d => d.group_id))
			for (const detail of this.details) {
				const detailIndex = this.checkedDetailGroups.findIndex(d => d.group_id === detail.group_id)
				if (detailIndex !== -1) {
					this.checkedDetailGroups.splice(detailIndex, 1)
				}
			}
		},
		deleteCheckedGroupsFiles() {
			this.batchDeleting = true
			axios.post(generateUrl(`/apps/mediadc/api/v1/tasks/${this.task.id}/details/delete`), { groupIds: this.checkedDetailGroups.map(d => d.group_id) }).then(res => {
				if (res.data.success) {
					emit('openNextDetailGroup', this.checkedDetailGroups[this.checkedDetailGroups.length - 1])
					const updatedDetails = [...this.details]
					for (const removedGroupId of res.data.removedGroupIds) {
						const checkedIndex = this.checkedDetailGroups.findIndex(d => Number(d.group_id) === removedGroupId)
						if (checkedIndex !== -1) {
							this.checkedDetailGroups.splice(checkedIndex, 1)
						}
						const removedDetailIndex = updatedDetails.findIndex(d => Number(d.group_id) === removedGroupId)
						updatedDetails.splice(removedDetailIndex, 1)
					}
					emit('updateTaskInfo')
					this.$store.commit('setDetails', updatedDetails)
					this.$store.commit('setTask', res.data.task)
					showSuccess(this.t('mediadc', 'Selected group files successfully deleted'))
				} else if (res.data.removedGroupIds.length !== 0) {
					showWarning(this.t('mediadc', 'Not all selected group files deleted'))
				} else {
					showError(this.t('mediadc', 'Failed to delete selected group files'))
				}
				this.batchDeleting = false
			}).catch(err => {
				showError(this.t('mediadc', 'A server error occurred'))
				console.debug(err)
				this.batchDeleting = false
			})
		},
		selectAllGroups() {
			const _details = (!this.filtered) ? this.details : this.detailsFiltered
			if (this.checkedDetailGroups.length === _details.length) {
				this._deselectAllGroups(_details)
			} else {
				for (const detail of _details) {
					const detailIndex = this.checkedDetailGroups.findIndex(d => d.group_id === detail.group_id)
					if (detailIndex === -1) {
						this.checkedDetailGroups.push(detail)
					}
				}
			}
		},
		selectAllGroupsOnPage() {
			const _details = (!this.filtered)
				? ((!this.sortGroups) ? this.paginatedDetails : this.paginatedSortedDetails)
				: ((!this.sortGroups) ? this.paginatedDetailsFiltered : this.paginatedDetailsFilteredSorted)
			if (_details[this.page].length === this.checkedDetailGroupsIntersect.length) {
				const groupsToDeselect = this.checkedDetailGroupsIntersect
				emit('deselectGroups', groupsToDeselect)
				for (const detail of groupsToDeselect) {
					const detailIndex = this.checkedDetailGroups.findIndex(d => d.group_id === detail.group_id)
					if (detailIndex !== -1) {
						this.checkedDetailGroups.splice(detailIndex, 1)
					}
				}
			} else {
				for (const detail of _details[this.page]) {
					const detailIndex = this.checkedDetailGroups.findIndex(d => d.group_id === detail.group_id)
					if (detailIndex === -1) {
						this.checkedDetailGroups.push(detail)
					}
				}
			}
		},
		openNextDetailGroup(detail) {
			if (this.autoOpenNextGroup) {
				const detailIndex = this.details.findIndex(d => d.group_id === detail.group_id)
				if (detailIndex !== -1) {
					if (detailIndex !== this.details.length - 1) {
						emit('openGroup', this.details[detailIndex + 1])
					} else if (detailIndex === this.details.length - 1 && this.details.length >= 2) {
						emit('openGroup', this.details[detailIndex - 1])
					}
				}
			}
		},
		toggleGroups() {
			const _details = (!this.filtered)
				? ((!this.sortGroups) ? this.paginatedDetails[this.page] : this.paginatedSortedDetails[this.page])
				: ((!this.sortGroups) ? this.paginatedDetailsFiltered[this.page] : this.paginatedDetailsFilteredSorted[this.page])
			for (const detail of _details) {
				emit('toggleGroup', detail)
			}
		},
	},
}
</script>

<style scoped>
.task-details {
	width: 100%;
	padding: 20px 10px 20px 20px;
	border: 1px solid var(--color-border-dark);
	border-radius: var(--border-radius-large);
	overflow-y: scroll;
	margin: 0 auto 20px;
}

.task-details-heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.task-details-heading h3 {
	margin: 0;
}

@media (max-width: 540px) {
	.task-details {
		padding: 15px 0px 10px 10px;
	}

	.task-details-heading {
		flex-direction: column;
		text-align: center;
	}

	.pagination-wrapper {
		flex-direction: column;
	}
}

.pagination-wrapper, .pagination-sorting, .pagination {
	display: flex;
	align-items: center;
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

.task-details-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border: 1px solid var(--color-border-dark);
	border-radius: var(--border-radius-large);
	margin-bottom: 5px;
	transition: height .3s;
}

.filters {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 5px 10px;
	margin: 10px 0;
	border: 1px solid var(--color-border-dark);
	border-radius: var(--border-radius-large);
}

input#group-id-filter {
	width: fit-content;
	border-color: var(--color-border-dark);
}

body[data-theme-dark] .task-details-row, body[data-theme-dark] .filters {
	border-color: var(--color-border-dark);
}

@media (max-width: 540px) {
	.filters {
		flex-direction: column;
	}
}

.batch-editing {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
