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
	<div class="section">
		<h3>{{ t('mediadc', 'Duplicates list settings') }}</h3>
		<div class="setting">
			<label for="details-list-items-per-page">{{ t('mediadc', 'Groups per page') }}</label>
			<input id="details-list-items-per-page"
				v-model="detailsListItemPerPage"
				type="number"
				min="1"
				max="20"
				style="width: 60px;">
		</div>
		<div class="setting">
			<label for="details-grid-setting">{{ t('mediadc', 'Group file size') }}</label>
			<select id="details-grid-setting"
				v-model="selectedSize"
				name="details-grid-setting">
				<option v-for="size in gridSizes" :key="size" :value="size">
					{{ size }}px
				</option>
			</select>
		</div>
		<div class="setting">
			<CheckboxRadioSwitch :checked.sync="deleteFileConfirmation">
				{{ t('mediadc', 'Delete file confirmation') }}
			</CheckboxRadioSwitch>
		</div>
	</div>
</template>

<script>
import CheckboxRadioSwitch from '@nextcloud/vue/dist/Components/CheckboxRadioSwitch'

export default {
	name: 'DetailsListSettings',
	components: {
		CheckboxRadioSwitch,
	},
	data() {
		return {
			loading: true,
			gridSizes: [128, 192, 256, 512, 768],
			selectedSize: 192,
			detailsListItemPerPage: 10,
			deleteFileConfirmation: true,
		}
	},
	watch: {
		selectedSize() {
			window.localStorage.setItem('mediadc_details_files_grid_size', this.selectedSize)
			this.$store.dispatch('setDetailsGridSize', this.selectedSize)
		},
		detailsListItemPerPage() {
			window.localStorage.setItem('mediadc_details_list_items_per_page', this.detailsListItemPerPage)
			this.$store.dispatch('setDetailsListItemsPerPage', this.detailsListItemPerPage)
		},
		deleteFileConfirmation() {
			window.localStorage.setItem('mediadc_delete_file_confirmation', this.deleteFileConfirmation)
			this.$store.dispatch('setDeleteFileConfirmation', this.deleteFileConfirmation)
		},
	},
	beforeMount() {
		this.loadLocalSetting()
	},
	methods: {
		loadLocalSetting() {
			const localSelectedSize = window.localStorage.getItem('mediadc_details_files_grid_size')
			const localDetailsListItemsPerPage = window.localStorage.getItem('mediadc_details_list_items_per_page')
			const localDeleteFileConfirmation = window.localStorage.getItem('mediadc_delete_file_confirmation')
			this.selectedSize = localSelectedSize !== null ? localSelectedSize : 192
			this.detailsListItemPerPage = localDetailsListItemsPerPage !== null ? localDetailsListItemsPerPage : 10
			this.deleteFileConfirmation = localDeleteFileConfirmation !== null ? JSON.parse(localDeleteFileConfirmation) === true : true
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
