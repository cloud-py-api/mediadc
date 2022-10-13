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
		<Button v-if="details.length > itemsPerPage"
			type="tertiary"
			@click="prevGroupsPage">
			<template #icon>
				<span class="icon-view-previous pagination-button" />
			</template>
		</Button>
		<span v-if="details.length > itemsPerPage" style="margin-left: 5px;">{{ t('mediadc', 'Page:') }}&nbsp;</span>
		<span v-if="details.length > itemsPerPage" style="margin-right: 5px;">{{ page + 1 }}/{{ Math.ceil(details.length / itemsPerPage) }}</span>
		<Button v-if="details.length > itemsPerPage"
			type="tertiary"
			@click="nextGroupsPage">
			<template #icon>
				<span class="icon-view-next pagination-button" />
			</template>
		</Button>
		<template v-if="details.length > itemsPerPage">
			<select v-model="goToPage" name="to_page" id="to_page">
				<option v-for="page of pagesRange" :key="page" :value="page">{{ page + 1 }}</option>
			</select>
			<Button v-tooltip="t('mediadc', 'Go to page')"
				type="tertiary"
				@click="navigateToPage">
				<template #icon>
					<span class="icon-confirm" />
				</template>
			</Button>
		</template>
	</div>
</template>

<script>
import Button from '@nextcloud/vue/dist/Components/Button'
import { mapGetters } from 'vuex'

export default {
	name: 'Pagination',
	components: {
		Button,
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
			goToPage: 0,
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
			this.$emit('update:page', this.goToPage)
		},
	},
}
</script>
