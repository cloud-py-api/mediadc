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
	<transition name="fade">
		<div class="details-export-wrapper">
			<div class="details-export">
				<div class="details-export-close" @click="closeExportResultsDialog()" />
				<h2>{{ t('mediadc', 'Export task results') }}</h2>
				<div class="selection-container">
					<label for="export-file-format">{{ t('mediadc', 'Select export file format') }}</label>
					<select id="export-file-format"
						v-model="exportFileFormat">
						<option v-for="format in exportFormatOptions" :key="format" :value="format">
							{{ format }}
						</option>
					</select>
				</div>
				<NcButton :href="downloadExportUrl">
					{{ t('mediadc', 'Export') }}
				</NcButton>
			</div>
		</div>
	</transition>
</template>

<script>
import { generateUrl } from '@nextcloud/router'

import { NcButton } from '@nextcloud/vue'

export default {
	name: 'DetailsExport',
	components: {
		NcButton,
	},
	props: {
		task: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			exportFormatOptions: ['xml', 'json'],
			exportFileFormat: 'xml',
		}
	},
	computed: {
		downloadExportUrl() {
			return generateUrl(`/apps/mediadc/api/v1/tasks/${this.task.id}/export/${this.exportFileFormat}`)
		},
	},
	methods: {
		closeExportResultsDialog() {
			this.$emit('update:opened', false)
		},
	},
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 250ms;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.fade-visibility-enter,
.fade-visibility-leave-to {
	visibility: hidden;
	opacity: 0;
}

.details-export-wrapper {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;

}

.details-export {
	position: relative;
	border: 1px solid var(--color-border-dark);
	border-radius: var(--border-radius-large);
	box-shadow: 0 0 30px var(--color-box-shadow);
	padding: 20px 20px 10px;
	width: 100%;
	max-width: 300px;
	margin: auto;
	background-color: var(--color-main-background);
}

.details-export-close {
	position: absolute;
	top: 10px;
	right: 5px;
	padding: 25px;
	background: var(--icon-close-dark) no-repeat center;
	opacity: .5;
	cursor: pointer;
}

.details-export-close:hover {
	opacity: 1;
}

.selection-container {
	display: flex;
	flex-direction: column;
	margin: 10px auto;
}

@media (max-width: 540px) {
	.details-export {
		width: 90vw;
		height: 80vh;
		overflow-y: scroll;
		top: calc(100% - 96vh);
	}
}
</style>
