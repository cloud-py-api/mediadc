<!--
 - @copyright Copyright (c) 2022 Andrey Borysenko <andrey18106x@gmail.com>
 -
 - @copyright Copyright (c) 2022 Alexander Piskun <bigcat88@icloud.com>
 -
 - @author 2022 Andrey Borysenko <andrey18106x@gmail.com>
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
	<div class="pagination">
		<NcButton v-if="details.length > itemsPerPage"
			type="tertiary"
			:aria-label="t('mediadc', 'Previous duplicate list page')"
			@click="prevGroupsPage">
			<template #icon>
				<span class="icon-view-previous pagination-button" />
			</template>
		</NcButton>
		<span v-if="details.length > itemsPerPage" style="margin-left: 5px;">{{ t('mediadc', 'Page:') }}&nbsp;</span>
		<span v-if="details.length > itemsPerPage" style="margin-right: 5px;">{{ page + 1 }}/{{ Math.ceil(details.length / itemsPerPage) }}</span>
		<NcButton v-if="details.length > itemsPerPage"
			type="tertiary"
			:aria-label="t('mediadc', 'Next duplicate list page')"
			@click="nextGroupsPage">
			<template #icon>
				<span class="icon-view-next pagination-button" />
			</template>
		</NcButton>
		<template v-if="details.length > itemsPerPage">
			<input id="go_to_page"
				v-model="goToPage"
				type="number"
				:min="1"
				:max="pagesRange[pagesRange.length - 1] + 1"
				name="go_to_page"
				:aria-label="t('mediadc', 'Page to navigate to')"
				@keyup.enter="navigateToPage">
			<NcButton v-tooltip="t('mediadc', 'Go to page')"
				type="tertiary"
				:aria-label="t('mediadc', 'Navigate to duplicate list page')"
				@click="navigateToPage">
				<template #icon>
					<span class="icon-confirm" />
				</template>
			</NcButton>
		</template>
	</div>
</template>

<script>
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import { mapGetters } from 'vuex'

export default {
	name: 'Pagination',
	components: {
		NcButton,
	},
	props: {
		details: {
			type: Array,
			required: true,
		},
		prevGroupsPage: {
			type: Function,
			required: true,
		},
		nextGroupsPage: {
			type: Function,
			required: true,
		},
		page: {
			type: Number,
			required: true,
		},
	},
	data() {
		return {
			goToPage: 1,
		}
	},
	computed: {
		...mapGetters([
			'itemsPerPage',
		]),
		pagesRange() {
			return Array.from({ length: Math.ceil(this.details.length / this.itemsPerPage) }, (_, i) => i)
		},
	},
	methods: {
		navigateToPage() {
			if (this.goToPage > this.pagesRange.length) {
				this.goToPage = this.pagesRange.length
			} else if (this.goToPage <= 0) {
				this.goToPage = 1
			}
			this.$emit('update:page', this.goToPage - 1)
		},
	},
}
</script>

<style scoped>
input#go_to_page {
	width: fit-content;
	border-color: var(--color-border-dark);
}
</style>