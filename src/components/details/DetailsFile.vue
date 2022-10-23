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
	<div class="file" :style="'width: ' + detailsGridSize + 'px;'">
		<div v-if="updating" class="updating-blackout">
			<span class="icon-loading" />
		</div>
		<div class="file-thumb" @click="openFile(file)">
			<div v-show="loaded"
				v-if="file.filempart === 'image' || (file.filempart === 'video' && file.has_preview)"
				class="file-thumb-loaded">
				<img v-show="loaded"
					:key="file.filepath"
					:src="imageUrl"
					:alt="file.filename"
					:title="file.filepath"
					@load="onLoad">
			</div>
			<div v-show="!loaded && file.filempart === 'video'"
				class="placeholder"
				:style="'min-height: ' + detailsGridSize + 'px'"
				:title="file.filepath">
				<svg width="50%"
					height="50%"
					version="1.1"
					viewBox="-31 0 512 512"
					xmlns="http://www.w3.org/2000/svg">
					<path d="m440.59 206.68h-341.17l327.7-94.93c2.5469-0.73828 4.6953-2.4609 5.9766-4.7812 1.2812-2.3242 1.5859-5.0586 0.84766-7.6055l-17.148-59.199c-6.8516-23.645-28.867-40.16-53.539-40.16-5.1992 0-10.379 0.73828-15.402 2.1914l-307.68 89.129c-14.23 4.1211-26.023 13.582-33.215 26.633-7.1875 13.051-8.875 28.078-4.7539 42.305l16.754 57.836v238.25c0 30.688 24.965 55.652 55.648 55.652h120.16c5.5234 0 10-4.4766 10-10s-4.4766-10-10-10h-120.16c-19.66 0-35.652-15.992-35.652-35.652v-136.09h391.63v136.09c2.1e-4 19.66-15.992 35.652-35.652 35.652h-120.16c-5.5195 0-10 4.4766-10 10s4.4805 10 10 10h120.16c30.688 0 55.652-24.965 55.652-55.652v-239.67c0-5.5234-4.4766-10-10-10zm-176.33 93.586 42.488-73.586h55.262l-42.484 73.586zm-78.359 0 42.488-73.586h55.262l-42.484 73.586zm-78.355 0 42.484-73.586h55.266l-42.488 73.586zm37.18-129.46-71.148-68.336 53.309-15.441c0.375 0.54688 0.8125 1.0625 1.3125 1.543l71.148 68.336-53.309 15.441c-0.375-0.54688-0.81641-1.0664-1.3125-1.543zm134-125.84 71.148 68.336-53.309 15.441c-0.375-0.54688-0.8125-1.0664-1.3125-1.543l-71.148-68.336 53.309-15.441c0.375 0.54688 0.8125 1.0625 1.3125 1.543zm-75.266 21.805 71.148 68.332-53.309 15.445c-0.375-0.54687-0.8125-1.0664-1.3125-1.543l-71.148-68.336 53.309-15.441c0.37891 0.54297 0.81641 1.0625 1.3125 1.543zm149.96-45.367c3.2109-0.92969 6.5195-1.4023 9.8359-1.4023 15.824 0 29.938 10.578 34.328 25.727l14.367 49.59-40.121 11.621c-0.3789-0.54688-0.8164-1.0625-1.3164-1.543l-71.145-68.332zm-328.94 106.2c4.6094-8.3711 12.16-14.434 21.262-17.07l5.875-1.7031c0.37891 0.54688 0.81641 1.0664 1.3125 1.543l71.148 68.336-88.293 25.578-14.367-49.59c-2.6367-9.0976-1.5469-18.719 3.0625-27.094zm14.48 99.074h87.973l-42.484 73.586h-45.488zm303.66 73.586 42.484-73.586h45.488v73.586z" />
					<path d="m303.92 405.11c0-3.5742-1.9062-6.875-5-8.6602l-87.855-50.723c-3.0938-1.7852-6.9062-1.7852-10 0-3.0938 1.7852-5 5.0859-5 8.6602v101.45c0 3.5703 1.9062 6.8711 5 8.6562 1.5469 0.89453 3.2734 1.3438 5 1.3438 1.7266 0 3.4531-0.44922 5-1.3438l87.855-50.719c3.0938-1.7852 5-5.0859 5-8.6602zm-87.855 33.402v-66.805l57.855 33.402z" />
					<path d="m234.77 492c-5.5078 0-10 4.4922-10 10s4.4922 10 10 10c5.5117 0 10-4.4922 10-10s-4.4883-10-10-10z" />
				</svg>
			</div>
			<div v-show="!loaded && file.filempart === 'image'"
				class="placeholder"
				:style="'min-height: ' + detailsGridSize + 'px'"
				:title="file.filepath">
				<svg width="50%"
					enable-background="new 0 0 512 512"
					version="1.1"
					viewBox="0 0 512 512"
					xml:space="preserve"
					xmlns="http://www.w3.org/2000/svg">
					<path d="m446.58 0h-381.15c-36.076 0-65.425 29.35-65.425 65.426v381.15c0 36.075 29.349 65.425 65.425 65.425h381.15c36.076 0 65.425-29.35 65.425-65.426v-381.15c0-36.076-29.349-65.426-65.425-65.426zm35.267 446.58c0 19.447-15.821 35.267-35.267 35.267h-381.15c-19.447 0-35.268-15.821-35.268-35.267v-55.007l99.255-84.451c3.622-3.082 8.906-3.111 12.562-0.075l62.174 51.628c5.995 4.977 14.795 4.569 20.304-0.946l147.73-147.95c2.67-2.675 5.783-2.935 7.408-2.852 1.62 0.083 4.695 0.661 7.078 3.596l95.176 117.19v118.87zm0-166.71-71.766-88.366c-7.117-8.764-17.666-14.122-28.942-14.701-11.268-0.57-22.317 3.672-30.294 11.662l-138.01 138.22-51.59-42.839c-14.959-12.422-36.563-12.293-51.373 0.308l-79.712 67.822v-286.55c0-19.447 15.821-35.268 35.268-35.268h381.15c19.447 0 35.267 15.821 35.267 35.268v214.44z" />
					<path d="m161.17 62.995c-40.095 0-72.713 32.62-72.713 72.713 0 40.094 32.619 72.713 72.713 72.713s72.713-32.619 72.713-72.713-32.618-72.713-72.713-72.713zm0 115.27c-23.466 0-42.556-19.091-42.556-42.556 0-23.466 19.09-42.556 42.556-42.556s42.556 19.091 42.556 42.556-19.09 42.556-42.556 42.556z" />
				</svg>
			</div>
		</div>
		<div class="file-info">
			<span class="filename" :title="file.filepath">{{ file.filename }}</span>
			<span class="owner">{{ file.fileowner }}</span>
			<span class="size">{{ formatBytes(Number(file.filesize)) }}</span>
			<div class="actions" style="display: flex;">
				<CheckboxRadioSwitch class="batch-checkbox"
					:checked.sync="checked"
					style="margin-right: 20px;" />
				<span class="delete-file-btn icon-delete-white" @click="deleteGroupFile(file)" />
			</div>
		</div>
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateRemoteUrl, generateUrl } from '@nextcloud/router'
import { mapGetters } from 'vuex'
import { getCurrentUser } from '@nextcloud/auth'
import { emit, subscribe, unsubscribe } from '@nextcloud/event-bus'
import { showError, showMessage, showWarning } from '@nextcloud/dialogs'
import Formats from '../../mixins/Formats'
import CheckboxRadioSwitch from '@nextcloud/vue/dist/Components/CheckboxRadioSwitch'

export default {
	name: 'DetailsFile',
	components: { CheckboxRadioSwitch },
	mixins: [Formats],
	props: {
		file: {
			type: Object,
			required: true,
		},
		files: {
			type: Array,
			required: true,
		},
		allFiles: {
			type: Array,
			required: true,
		},
		checkedFiles: {
			type: Array,
			required: true,
		},
		detail: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			loaded: false,
			checked: false,
			updating: false,
		}
	},
	computed: {
		...mapGetters([
			'detailsGridSize',
			'deleteFileConfirmation',
			'details',
		]),
		imageUrl() {
			if (this.file.has_preview) {
				return generateUrl(`/core/preview?fileId=${this.file.fileid}&x=${this.detailsGridSize}&y=${this.detailsGridSize}$forceIcon=0`)
			} else {
				return generateRemoteUrl(`dav/files${this.file.filepath.replace('files/', '')}`)
			}
		},
	},
	watch: {
		checked() {
			const newCheckedFiles = this.checkedFiles
			const fileIndex = newCheckedFiles.findIndex(f => f.fileid === this.file.fileid)
			if (this.checked) {
				if (fileIndex === -1) {
					newCheckedFiles.push(this.file)
				}
			} else if (fileIndex !== -1) {
				newCheckedFiles.splice(fileIndex, 1)
			}
			this.$emit('update:checkedFiles', newCheckedFiles)
		},
		checkedFiles() {
			const fileIndex = this.checkedFiles.findIndex(f => f.fileid === this.file.fileid)
			if (!this.checked && fileIndex !== -1) {
				this.checked = true
			}
		},
	},
	beforeMount() {
		const fileIndexChecked = this.checkedFiles.findIndex(f => f.fileid === this.file.fileid)
		this.checked = fileIndexChecked !== -1
		subscribe('deselectFiles', this.deselect)
	},
	beforeDestroy() {
		unsubscribe('deselectFiles', this.deselect)
	},
	methods: {
		openFile(file) {
			const filesList = this.files.map(file => ({
				basename: file.filename,
				fileid: file.fileid,
				filename: file.filepath.replace(`/${getCurrentUser().uid}/files`, ''),
				getcontentlength: file.filesize,
				getcontenttype: file.filemtype,
				mime: file.filemtype,
				size: file.filesize,
			}))
			OCA.Viewer.open({
				path: file.filepath.replace(`/${getCurrentUser().uid}/files`, ''),
				list: filesList.map(file => ({
					...file,
					list: filesList,
				})),
			})
		},
		onLoad() {
			this.loaded = true
		},
		deleteGroupFile(file) {
			if (this.deleteFileConfirmation) {
				if (confirm(t('mediadc', 'Are you sure, you want delete this file?'))) {
					this._deleteGroupFile(file)
				}
			} else {
				this._deleteGroupFile(file)
			}
		},
		_deleteGroupFile(file) {
			this.updating = true
			axios.delete(generateUrl(`/apps/mediadc/api/v1/tasks/${this.detail.task_id}/files/${this.detail.id}/${file.fileid}`))
				.then(res => {
					if (res.data.success) {
						const files = this.files
						if (this.allFiles.length === 2) { // Remove detail when 1 file left
							emit('openNextDetailGroup', this.detail)
							this.$store.dispatch('deleteDetail', this.detail)
							showMessage(this.t('mediadc', 'Group successfully removed (1 file left)'))
						}
						const fileidIndex = files.findIndex(f => f.fileid === file.fileid)
						files.splice(fileidIndex, 1)
						const checkedIndex = this.checkedFiles.findIndex(f => f.fileid === file.fileid)
						if (this.checked && checkedIndex !== -1) {
							const newCheckedFiles = this.checkedFiles
							newCheckedFiles.splice(checkedIndex, 1)
							this.$emit('update:checkedFiles', newCheckedFiles)
						}
						this.$emit('update:files', files)
						emit('updateTaskInfo')
						this.$store.dispatch('setTask', res.data.task).then(() => {
							emit('updateGroupFilesPagination', this.file)
						})
					} else if ('locked' in res.data && res.data.locked) {
						showWarning(this.t('mediadc', 'Wait until file loaded before deleting'))
					} else if ('not_permited' in res.data && res.data.not_permited) {
						showError(this.t('mediadc', 'Not enough permissions to delete file'))
					} else if ('not_found' in res.data && res.data.not_found) {
						showError(this.t('mediadc', 'File not found. Probably it\'s already deleted'))
					} else {
						showError(this.t('mediadc', 'An error occured while deleting file'))
					}
					this.updating = false
				})
				.catch(err => {
					console.debug(err)
					showError(this.t('mediadc', 'Some error occured while deleting file'))
					this.updating = false
				})
		},
		deselect(filesToDeselect) {
			if (this.checked && filesToDeselect.map(f => f.fileid).includes(this.file.fileid)) {
				this.checked = false
			}
		},
	},
}
</script>

<style scoped>
.file {
	position: relative;
}

.file-thumb {
	display: flex;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
}

.file-thumb-loaded {
	display: flex;
	width: 100%;
}

img {
	width: 100%;
	height: auto;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
	cursor: pointer;
}

.updating-blackout {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.7);
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 5px;
}

.placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
}

body.theme--dark .placeholder {
	background-color: #fff;
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
