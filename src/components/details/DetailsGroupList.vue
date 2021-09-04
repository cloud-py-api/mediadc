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
	<div v-if="!loadingFiles" class="details-group">
		<div class="details-group-files">
			<div v-for="file in files"
				:key="file.fileid"
				class="file"
				:style="'width: ' + detailsGridSize + 'px; min-height: ' + detailsGridSize + 'px;'">
				<DetailsFile :file="file" :files="files" />
				<div class="file-info">
					<span class="filename">{{ file.filename }}</span>
					<span class="owner">{{ file.fileowner }}</span>
					<span class="size">{{ formatBytes(Number(file.filesize)) }}</span>
					<span class="delete-file-btn icon-delete-white" @click="deleteGroupFile(file)" />
				</div>
			</div>
		</div>
	</div>
	<div v-else>
		<span class="icon-loading" style="width: 20px; height: 20px; display: flex; margin: 20px auto;" />
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import Formats from '../../mixins/Formats'
import { mapGetters } from 'vuex'
import DetailsFile from './DetailsFile'

export default {
	name: 'DetailsGroupList',
	components: { DetailsFile },
	mixins: [Formats],
	props: {
		files: {
			type: Array,
			required: true,
		},
		loadingFiles: {
			type: Boolean,
			required: true,
		},
	},
	computed: {
		...mapGetters([
			'detailsGridSize',
		]),
	},
	methods: {
		deleteGroupFile(file) {
			if (confirm(t('mediadc', 'Are you sure, you want delete this file?'))) {
				axios.delete(generateUrl(`/apps/mediadc/api/v1/tasks/${file.taskId}/files/${file.detailId}/${file.fileid}`))
					.then(res => {
						const files = this.files
						const fileidIndex = files.findIndex(f => f.fileid === file.fileid)
						files.splice(fileidIndex, 1)
						this.$emit('update:files', files)
						this.$store.dispatch('setTask', res.data.task)
					})
			}
		},
	},
}
</script>

<style scoped>
.details-group {
	border-top: 1px solid #dadada;
	border-bottom: 1px solid #dadada;
	margin: 10px 0;
}

body.theme--dark .details-group {
	border-color: #717171;
}

.details-group-files {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	max-height: 70vh;
	overflow-y: scroll;
}

.file {
	display: flex;
	height: 100%;
	flex-direction: column;
	justify-content: space-between;
	width: 192px;
	border-radius: 5px;
	border: 1px solid #dadada;
	transition: box-shadow .3s;
	margin: 10px;
}

body.theme--dark .file {
	border-color: #717171;
}

@media (max-width: 540px) {
	.file {
		max-width: 192px;
	}

	.pagination {
		text-align: center;
	}
}

.file:hover {
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, .25);
}

.file-info {
	width: 100%;
	padding: 5px 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #000;
	text-align: center;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;
	color: #fff;
}

.filename {
	width: 100%;
	overflow-x: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.delete-file-btn {
	padding: 20px;
	border-radius: 50%;
	width: 16px;
	height: 16px;
	cursor: pointer;
	background-image: var(--icon-delete-fff);
}

.delete-file-btn:hover {
	background-color: #eee;
}

.delete-file-btn:active {
	background-color: #ddd;
}

body.theme--dark .delete-file-btn {
	background-image: var(--icon-delete-000);
}

.delete-file-btn:hover, body.theme--dark .delete-file-btn:hover {
	background-image: var(--icon-delete-e9322d);
}
</style>
