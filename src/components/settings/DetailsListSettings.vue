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
	<div class="section" style="padding: 0 10px;">
		<h3 style="font-weight: bold;">
			{{ t('mediadc', 'Duplicates list settings') }}
		</h3>
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
			<label for="group-items-per-page">{{ t('mediadc', 'Items per group') }}</label>
			<input id="group-items-per-page"
				v-model="groupItemsPerPage"
				type="number"
				min="1"
				max="20"
				style="width: 60px;">
		</div>
		<div class="setting">
			<label for="details-grid-setting">{{ t('mediadc', 'Group image size') }}</label>
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
		<div class="setting">
			<CheckboxRadioSwitch :checked.sync="autoOpenNextGroup">
				{{ t('mediadc', 'Auto open next group') }}
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
			groupItemsPerPage: 10,
			deleteFileConfirmation: true,
			autoOpenNextGroup: true,
		}
	},
	watch: {
		selectedSize() {
			window.localStorage.setItem('mediadc_details_files_grid_size', this.selectedSize)
			this.$store.commit('setDetailsGridSize', this.selectedSize)
		},
		detailsListItemPerPage() {
			window.localStorage.setItem('mediadc_details_list_items_per_page', this.detailsListItemPerPage)
			this.$store.commit('setDetailsListItemsPerPage', this.detailsListItemPerPage)
		},
		groupItemsPerPage() {
			window.localStorage.setItem('mediadc_group_items_per_page', this.groupItemsPerPage)
			this.$store.commit('setGroupItemsPerPage', this.groupItemsPerPage)
		},
		deleteFileConfirmation() {
			window.localStorage.setItem('mediadc_delete_file_confirmation', this.deleteFileConfirmation)
			this.$store.commit('setDeleteFileConfirmation', this.deleteFileConfirmation)
		},
		autoOpenNextGroup() {
			window.localStorage.setItem('mediadc_auto_open_next_group', this.autoOpenNextGroup)
			this.$store.commit('setAutoOpenNextGroup', this.autoOpenNextGroup)
		},
	},
	beforeMount() {
		this.loadLocalSetting()
	},
	methods: {
		loadLocalSetting() {
			const localSelectedSize = window.localStorage.getItem('mediadc_details_files_grid_size')
			const localDetailsListItemsPerPage = window.localStorage.getItem('mediadc_details_list_items_per_page')
			const localGroupItemsPerPage = window.localStorage.getItem('mediadc_group_items_per_page')
			const localDeleteFileConfirmation = window.localStorage.getItem('mediadc_delete_file_confirmation')
			const localAutoOpenNextGroup = window.localStorage.getItem('mediadc_auto_open_next_group')
			this.selectedSize = localSelectedSize !== null ? localSelectedSize : 192
			this.detailsListItemPerPage = localDetailsListItemsPerPage !== null ? localDetailsListItemsPerPage : 10
			this.groupItemsPerPage = localGroupItemsPerPage !== null ? localGroupItemsPerPage : 10
			this.deleteFileConfirmation = localDeleteFileConfirmation !== null ? JSON.parse(localDeleteFileConfirmation) === true : true
			this.autoOpenNextGroup = localAutoOpenNextGroup !== null ? JSON.parse(localAutoOpenNextGroup) === true : true
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
