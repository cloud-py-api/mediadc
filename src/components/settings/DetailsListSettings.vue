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
	<div class="section">
		<h3>{{ t('mediadc', 'Duplicates list settings') }}</h3>
		<div class="setting">
			<label for="details-list-items-per-page">{{ t('mediadc', 'Groups per page') }}</label>
			<input id="details-list-items-per-page"
				v-model="detailsListItemPerPage"
				type="number"
				min="1"
				max="20"
				style="width: 60px;"
				@change="updateDetailsListItemsPerPage">
		</div>
		<div class="setting">
			<label for="details-grid-setting">{{ t('mediadc', 'Group file size') }}</label>
			<select id="details-grid-setting"
				v-model="selectedSize"
				name="details-grid-setting"
				@change="updateGridSize">
				<option v-for="size in gridSizes" :key="size" :value="size">
					{{ size }}px
				</option>
			</select>
		</div>
	</div>
</template>

<script>

export default {
	name: 'DetailsListSettings',
	data() {
		return {
			gridSizes: [128, 192, 256, 512, 768],
			selectedSize: 192,
			detailsListItemPerPage: 10,
		}
	},
	beforeMount() {
		this.loadLocalSetting()
		this.updateGridSize()
		this.updateDetailsListItemsPerPage()
	},
	methods: {
		updateGridSize() {
			window.localStorage.setItem('mediadc_details_files_grid_size', this.selectedSize)
			this.$store.dispatch('setDetailsGridSize', this.selectedSize)
		},
		loadLocalSetting() {
			const localSelectedSize = window.localStorage.getItem('mediadc_details_files_grid_size')
			const localDetailsListItemsPerPage = window.localStorage.getItem('mediadc_details_list_items_per_page')
			this.selectedSize = localSelectedSize !== null ? localSelectedSize : 192
			this.detailsListItemPerPage = localDetailsListItemsPerPage !== null ? localDetailsListItemsPerPage : 10
		},
		updateDetailsListItemsPerPage() {
			window.localStorage.setItem('mediadc_details_list_items_per_page', this.detailsListItemPerPage)
			this.$store.dispatch('setDetailsListItemsPerPage', this.detailsListItemPerPage)
		},
	},
}
</script>

<style scoped>
.setting {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
