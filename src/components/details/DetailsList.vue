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
	<div class="task-details">
		<div class="task-details-heading">
			<h3>
				{{ t('mediadc', 'Duplicates list') }}
				<span v-if="getStatusBadge(task) === 'finished'">
					- {{ details.length }} {{ t('mediadc', 'group(s)') }}
					({{ filestotal }} {{ t('mediadc', 'file(s)') }} - {{ formatBytes(filessize) }})
				</span>
			</h3>
			<div v-if="details.length > itemsPerPage" class="pagination">
				<span :class="!sorted ? 'icon-triangle-s toggle-sorting-button' : 'icon-triangle-n toggle-sorting-button'" @click="toggleSorting" />
				<span class="icon-view-previous pagination-button"
					@click="prevGroupsPage()" />
				<span>{{ t('mediadc', 'Page:') }}&nbsp;</span>
				<span>{{ page + 1 }}/{{ Math.ceil(details.length / itemsPerPage) }}</span>
				<span class="icon-view-next pagination-button"
					@click="nextGroupsPage()" />
			</div>
		</div>
		<div v-if="details.length > 0">
			<div v-for="detail in paginatedDetails[page]"
				v-show="JSON.parse(detail.group_files_ids).length > 1"
				:key="detail.id"
				class="task-details-row">
				<DetailsListItem :detail="detail" />
			</div>
		</div>
		<div v-else>
			<strong>{{ t('mediadc', 'No duplicates found.') }}</strong>
		</div>
	</div>
</template>

<script>
import { showWarning } from '@nextcloud/dialogs'
import { mapGetters } from 'vuex'
import Formats from '../../mixins/Formats'
import DetailsListItem from './DetailsListItem'

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
		}
	},
	computed: {
		...mapGetters([
			'task',
			'details',
			'sorted',
			'paginatedDetails',
			'itemsPerPage',
		]),
	},
	beforeMount() {
		this.$emit('update:loading', false)
	},
	methods: {
		prevGroupsPage() {
			if (this.page > 0) {
				this.page -= 1
			} else {
				showWarning(t('mediadc', 'First page reached!'))
			}
		},
		nextGroupsPage() {
			if (this.page < Math.ceil(this.details.length / this.itemsPerPage) - 1) {
				this.page += 1
			} else {
				showWarning(t('mediadc', 'Last page reached!'))
			}
		},
		toggleSorting() {
			this.$store.dispatch('setSorted', !this.sorted)
		},
	},
}
</script>

<style scoped>
.task-details {
	width: 100%;
	padding: 10px 20px 20px;
	border: 1px solid #dadada;
	border-radius: 5px;
	max-height: 100vh;
	overflow-y: scroll;
	margin: 0 auto;
}

.task-details-heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
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

body.theme--dark .task-details-row {
	border-color: #717171;
}
</style>
