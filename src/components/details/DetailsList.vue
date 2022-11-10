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
					<CheckboxRadioSwitch :checked.sync="sortGroups" style="margin-right: 20px;">
						{{ t('mediadc', 'Sort groups') }}
					</CheckboxRadioSwitch>
					<Button v-tooltip="t('mediadc', 'Sorting details by files count')"
						type="tertiary"
						@click="toggleSorting">
						<template #icon>
							<span :class="!sorted ? 'icon-triangle-s toggle-sorting-button' : 'icon-triangle-n toggle-sorting-button'" />
						</template>
					</Button>
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
					<Button v-tooltip="t('mediadc', 'Toggle duplicate groups')"
						type="tertiary"
						style="margin-right: 10px;"
						@click="toggleGroups">
						<template #icon>
							<span class="icon-category-organization" />
						</template>
						<template #default>
							{{ t('mediadc', 'Toggle groups') }}
						</template>
					</Button>
					<div v-if="checkedDetailGroups.length > 0" class="batch-editing">
						{{ n('mediadc', 'Batch actions for %n group', 'Batch actions for %n groups', checkedDetailGroups.length) }}
						<Actions placement="top" style="margin-left: 5px;">
							<template v-if="!filtered">
								<ActionButton icon="icon-checkmark" @click="selectAllGroups">
									{{ checkedDetailGroups.length === details.length ? t('mediadc', 'Deselect all') : t('mediadc', 'Select all') }}
								</ActionButton>
								<ActionButton v-if="details.length > itemsPerPage" icon="icon-checkmark" @click="selectAllGroupsOnPage">
									{{ checkedDetailGroupsIntersect.length === paginatedDetails[page].length || checkedDetailGroupsIntersect.length === paginatedSortedDetails[page].length ? t('mediadc', 'Deselect all on page') : t('mediadc', 'Select all on page') }}
								</ActionButton>
							</template>
							<template v-else>
								<ActionButton icon="icon-checkmark" @click="selectAllGroups">
									{{ checkedDetailGroups.length === detailsFiltered.length ? t('mediadc', 'Deselect all') : t('mediadc', 'Select all') }}
								</ActionButton>
								<ActionButton v-if="detailsFiltered.length > itemsPerPage" icon="icon-checkmark" @click="selectAllGroupsOnPage">
									{{ checkedDetailGroupsIntersect.length === paginatedDetailsFiltered[page].length ? t('mediadc', 'Deselect all on page') : t('mediadc', 'Select all on page') }}
								</ActionButton>
							</template>
							<ActionButton v-if="checkedDetailGroups.length > 0" icon="icon-close" @click="_deselectAllGroups((!filtered) ? details : detailsFiltered)">
								{{ t('mediadc', 'Uncheck selected') }}
							</ActionButton>
							<ActionButton v-tooltip="{content: t('mediadc', 'Mark all files in group as resolved'), placement: 'left'}"
								icon="icon-delete"
								@click="removeCheckedGroups">
								{{ n('mediadc', 'Remove group', 'Remove groups', checkedDetailGroups.length) }}
							</ActionButton>
						</Actions>
					</div>
				</div>
			</div>
			<div v-if="!filtered">
				<template v-if="sortGroups">
					<div v-for="detail in paginatedSortedDetails[page]"
						v-show="JSON.parse(detail.group_files_ids).length > 1"
						:key="detail.id"
						class="task-details-row">
						<DetailsListItem :detail="detail" :checked-detail-groups.sync="checkedDetailGroups" />
					</div>
				</template>
				<template v-else>
					<div v-for="detail in paginatedDetails[page]"
						v-show="JSON.parse(detail.group_files_ids).length > 1"
						:key="detail.id"
						class="task-details-row">
						<DetailsListItem :detail="detail" :checked-detail-groups.sync="checkedDetailGroups" />
					</div>
				</template>
			</div>
			<div v-else-if="detailsFiltered.length > 0 && filtered">
				<template v-if="!sortGroups">
					<div v-for="detail in paginatedDetailsFiltered[page]"
						v-show="JSON.parse(detail.group_files_ids).length > 1"
						:key="detail.id"
						class="task-details-row">
						<DetailsListItem :detail="detail" :checked-detail-groups.sync="checkedDetailGroups" />
					</div>
				</template>
				<template v-else>
					<div v-for="detail in paginatedDetailsFilteredSorted[page]"
						v-show="JSON.parse(detail.group_files_ids).length > 1"
						:key="detail.id"
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
import CheckboxRadioSwitch from '@nextcloud/vue/dist/Components/CheckboxRadioSwitch.js'
import Button from '@nextcloud/vue/dist/Components/Button.js'
import Actions from '@nextcloud/vue/dist/Components/Actions.js'
import ActionButton from '@nextcloud/vue/dist/Components/ActionButton.js'

import { mapGetters } from 'vuex'

import Formats from '../../mixins/Formats.js'

import DetailsListItem from './DetailsListItem.vue'
import Pagination from './Pagination.vue'

export default {
	name: 'DetailsList',
	components: {
		DetailsListItem,
		CheckboxRadioSwitch,
		Button, // eslint-disable-line vue/no-reserved-component-names
		Actions,
		ActionButton,
		Pagination,
	},
	mixins: [Formats],
	data() {
		return {
			page: 0,
			filterId: null,
			checkedDetailGroups: [],
			batchActionsOpened: false,
			sortGroups: true,
			goToPage: 0,
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
					a = new Set(this.paginatedDetailsFiltered[this.page].map(d => d.id))
				} else {
					a = new Set(this.paginatedDetails[this.page].map(d => d.id))
				}
			} else {
				if (this.filtered) {
					a = new Set(this.paginatedDetailsFilteredSorted[this.page].map(d => d.id))
				} else {
					a = new Set(this.paginatedSortedDetails[this.page].map(d => d.id))
				}
			}
			const b = new Set(this.checkedDetailGroups.map(d => d.id))
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
			if (this.goToPage >= Math.ceil(this.details.length / newItemsPerPage)) {
				this.goToPage = Math.ceil(this.details.length / newItemsPerPage) - 1
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
				const rangeIdsRegex = /^\d+-\d+$/s
				this.page = 0

				if (singleIdRegex.test(this.filterId)) {
					this.$store.commit('setDetailsFiltered', this.details.filter(d => d.virtualId.toString().includes(this.filterId)))
				} else if (rangeIdsRegex.test(this.filterId)) {
					const beginRange = this.filterId.split('-')[0]
					const endRange = this.filterId.split('-')[1]
					this.$store.commit('setDetailsFiltered', this.details.filter(d => d.virtualId >= beginRange && d.virtualId <= endRange))
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
					this.$store.commit('setDetails', updatedDetails)
					showSuccess(this.t('mediadc', 'Selected groups successfully removed'))
				}
			}).catch(err => {
				showError(this.t('mediadc', 'A server error occurred'))
				console.debug(err)
			})
		},
		_deselectAllGroups(_details) {
			emit('deselectGroups', this.checkedDetailGroups.map(d => d.id))
			for (const detail of this.details) {
				const detailIndex = this.checkedDetailGroups.findIndex(d => d.id === detail.id)
				if (detailIndex !== -1) {
					this.checkedDetailGroups.splice(detailIndex, 1)
				}
			}
		},
		selectAllGroups() {
			const _details = (!this.filtered) ? this.details : this.detailsFiltered
			if (this.checkedDetailGroups.length === _details.length) {
				this._deselectAllGroups(_details)
			} else {
				for (const detail of _details) {
					const detailIndex = this.checkedDetailGroups.findIndex(d => d.id === detail.id)
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
					const detailIndex = this.checkedDetailGroups.findIndex(d => d.id === detail.id)
					if (detailIndex !== -1) {
						this.checkedDetailGroups.splice(detailIndex, 1)
					}
				}
			} else {
				for (const detail of _details[this.page]) {
					const detailIndex = this.checkedDetailGroups.findIndex(d => d.id === detail.id)
					if (detailIndex === -1) {
						this.checkedDetailGroups.push(detail)
					}
				}
			}
		},
		openNextDetailGroup(detail) {
			if (this.autoOpenNextGroup) {
				const detailIndex = this.details.findIndex(d => d.id === detail.id)
				if (detailIndex !== -1) {
					if (detailIndex !== this.details.length - 1) {
						emit('openGroup', this.details[detailIndex + 1])
					} else if (detailIndex === this.details.length - 1 && this.details.length >= 2) {
						emit('openGroup', this.details[detailIndex - 1])
					}
				}
			}
		},
		navigateToPage() {
			this.page = this.goToPage
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
	border: 1px solid var(--color-border-dark);
	border-radius: 5px;
}

body.theme--dark .task-details-row, body.theme--dark .filters {
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
