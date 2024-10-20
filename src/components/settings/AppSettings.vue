<!--
 - @copyright Copyright (c) 2023 Andrey Borysenko <andrey18106x@gmail.com>
 -
 - @copyright Copyright (c) 2023 Alexander Piskun <bigcat88@icloud.com>
 -
 - @author 2023 Andrey Borysenko <andrey18106x@gmail.com>
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
	<NcAppSettingsDialog :open="open"
		:show-navigation="true"
		:name="t('mediadc', 'MediaDC settings')"
		@update:open="onClose">
		<NcAppSettingsSection id="settings"
			:name="t('mediadc', 'Duplicates list')"
			:area-label="t('mediadc', 'Duplicates list settings per user and browser')">
			<div class="app-setting">
				<label for="details-list-items-per-page">
					{{ t('mediadc', 'Groups per page') }}
				</label>
				<NcInputField id="details-list-items-per-page"
					:value.sync="detailsListItemPerPage"
					:label-outside="true"
					type="number"
					min="1"
					max="20" />
			</div>
			<div class="app-setting">
				<label for="group-items-per-page">
					{{ t('mediadc', 'Items per group') }}
				</label>
				<NcInputField id="group-items-per-page"
					:value.sync="groupItemsPerPage"
					:label-outside="true"
					type="number"
					min="1"
					max="20" />
			</div>
			<div class="app-setting">
				<label for="details-grid-setting">
					{{ t('mediadc', 'Group image size') }}
				</label>
				<NcSelect v-model="selectedSize"
					input-id="details-grid-setting"
					:clearable="false"
					:options="gridSizes"
					:label-outside="true" />
			</div>
			<div class="app-setting">
				<NcCheckboxRadioSwitch :checked.sync="deleteFileConfirmation">
					{{ t('mediadc', 'Delete file confirmation') }}
				</NcCheckboxRadioSwitch>
			</div>
			<div class="app-setting">
				<NcCheckboxRadioSwitch :checked.sync="autoOpenNextGroup">
					{{ t('mediadc', 'Auto open next group') }}
				</NcCheckboxRadioSwitch>
			</div>
			<div class="app-setting">
				<NcCheckboxRadioSwitch :checked.sync="showFullFilePath">
					{{ t('mediadc', 'Show full file path') }}
				</NcCheckboxRadioSwitch>
			</div>
		</NcAppSettingsSection>
	</NcAppSettingsDialog>
</template>

<script>
import {
	NcAppSettingsDialog,
	NcAppSettingsSection,
	NcCheckboxRadioSwitch,
	NcInputField,
	NcSelect,
} from '@nextcloud/vue'

export default {
	name: 'AppSettings',
	components: {
		NcAppSettingsDialog,
		NcAppSettingsSection,
		NcCheckboxRadioSwitch,
		NcInputField,
		NcSelect,
	},
	props: {
		open: {
			type: Boolean,
			default: false,
		},
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
			showFullFilePath: false,
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
		showFullFilePath() {
			window.localStorage.setItem('mediadc_show_full_file_path', this.showFullFilePath)
			this.$store.commit('setShowFullFilePath', this.showFullFilePath)
		},
	},
	beforeMount() {
		this.loadLocalSetting()
	},
	methods: {
		onClose() {
			this.$emit('update:open', false)
		},
		loadLocalSetting() {
			const localSelectedSize = window.localStorage.getItem('mediadc_details_files_grid_size')
			const localDetailsListItemsPerPage = window.localStorage.getItem('mediadc_details_list_items_per_page')
			const localGroupItemsPerPage = window.localStorage.getItem('mediadc_group_items_per_page')
			const localDeleteFileConfirmation = window.localStorage.getItem('mediadc_delete_file_confirmation')
			const localAutoOpenNextGroup = window.localStorage.getItem('mediadc_auto_open_next_group')
			const localShowFullFilePath = window.localStorage.getItem('mediadc_show_full_file_path')
			this.selectedSize = localSelectedSize !== null ? localSelectedSize : 192
			this.detailsListItemPerPage = localDetailsListItemsPerPage !== null ? localDetailsListItemsPerPage : 10
			this.groupItemsPerPage = localGroupItemsPerPage !== null ? localGroupItemsPerPage : 10
			this.deleteFileConfirmation = localDeleteFileConfirmation !== null ? JSON.parse(localDeleteFileConfirmation) === true : true
			this.autoOpenNextGroup = localAutoOpenNextGroup !== null ? JSON.parse(localAutoOpenNextGroup) === true : true
			this.showFullFilePath = localShowFullFilePath !== null ? JSON.parse(localShowFullFilePath) === true : false
		},
	},
}
</script>

<style scoped>
.app-setting {
	display: flex;
	align-items: center;
	margin: 10px 0;
}

.app-setting label {
	margin-right: 10px;
	white-space: nowrap;
	width: fit-content;
}

.app-setting .input-field {
	width: fit-content;
}

.setting {
	display: flex;
	align-items: center;
}
</style>
