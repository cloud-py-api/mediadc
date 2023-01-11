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
	<div class="resolved-list">
		<div class="resolved-list-heading">
			<div v-if="resolved.total_pages > 1" class="pagination pagination-desktop">
				<NcButton type="tertiary"
					:aria-label="t('mediadc', 'Previous resolved list page')"
					@click="prevResolvedPage">
					<template #icon>
						<span class="icon-view-previous pagination-button" />
					</template>
				</NcButton>
				<span style="margin-left: 5px;">{{ t('mediadc', 'Page:') }}&nbsp;</span>
				<span style="margin-right: 5px;">{{ page + 1 }}/{{ resolved.total_pages }}</span>
				<NcButton type="tertiary"
					:aria-label="t('mediadc', 'Next resolved list page')"
					@click="nextResolvedPage">
					<template #icon>
						<span class="icon-view-next pagination-button" />
					</template>
				</NcButton>
				<template v-if="resolved.total_pages > 1">
					<input id="go_to_page"
						v-model="goToPage"
						type="number"
						style="width: fit-content;"
						:min="1"
						:max="pagesRange[pagesRange.length - 1] + 1"
						name="go_to_page"
						:aria-label="t('mediadc', 'Page to navigate to')"
						@keyup.enter="navigateToPage">
					<NcButton v-tooltip="t('mediadc', 'Go to page')"
						type="tertiary"
						:aria-label="t('mediadc', 'Navigate to resolved list page')"
						@click="navigateToPage">
						<template #icon>
							<span class="icon-confirm" />
						</template>
					</NcButton>
				</template>
			</div>
			<h2>{{ t('mediadc', 'Resolved list') }} ({{ resolved.total_items }} {{ n('mediadc', 'file', 'files', resolved.total_items) }})</h2>
			<NcButton v-tooltip="t('mediadc', 'Toggle media type')"
				type="tertiary"
				class="toggle-type-button"
				:aria-label="t('mediadc', 'Toggle resolved list media type')"
				@click="toggleMediaType">
				<template #icon>
					<span :class="selectedType === 'photos' ? 'icon-video' : 'icon-picture'" />
				</template>
			</NcButton>
			<NcButton v-tooltip="viewTooltip"
				type="tertiary"
				class="toggle-view-button"
				:aria-label="t('mediadc', 'Toggle list view (list or grid)')"
				@click="toggleListView">
				<template #icon>
					<span :class="listView ? 'icon-toggle-pictures' : 'icon-toggle-filelist'" />
				</template>
			</NcButton>
		</div>
		<div v-if="resolved.total_pages > 1" class="pagination pagination-mobile">
			<NcButton type="tertiary"
				:aria-label="t('mediadc', 'Previous resolved list page')"
				@click="prevResolvedPage">
				<template #icon>
					<span class="icon-view-previous pagination-button" />
				</template>
			</NcButton>
			<span style="margin-left: 5px;">{{ t('mediadc', 'Page:') }}&nbsp;</span>
			<span style="margin-right: 5px;">{{ page + 1 }}/{{ resolved.total_pages }}</span>
			<NcButton type="tertiary"
				:aria-label="t('mediadc', 'Next resolved list page')"
				@click="nextResolvedPage">
				<template #icon>
					<span class="icon-view-next pagination-button" />
				</template>
			</NcButton>
			<template v-if="resolved.total_pages > 1">
				<input id="go_to_page"
					v-model="goToPage"
					type="number"
					style="width: fit-content;"
					:min="1"
					:max="pagesRange[pagesRange.length - 1] + 1"
					name="go_to_page"
					:aria-label="t('mediadc', 'Page to navigate to')"
					@keyup.enter="navigateToPage">
				<NcButton v-tooltip="t('mediadc', 'Go to page')"
					type="tertiary"
					:aria-label="t('mediadc', 'Navigate to resolved list page')"
					@click="navigateToPage">
					<template #icon>
						<span class="icon-confirm" />
					</template>
				</NcButton>
			</template>
		</div>
		<Transition name="fade" appear>
			<div v-if="listView" class="list-view">
				<transition-group v-if="resolved.data && resolved.data.length > 0" name="fade" tag="ul">
					<NcListItem v-for="photo in resolved.data"
						:key="photo.fileid"
						:bold="true"
						:force-display-actions="true"
						:title="fileTitle(photo)"
						@click="openFile(photo)">
						<template #subtitle>
							{{ photo.fileowner }} <span :title="photo.relfilepath">({{ photo.relfilepath }})</span>
						</template>
						<template #icon>
							<div class="resolved-img-icon">
								<img :src="imageUrl(photo.fileid)" :width="thumbSize" :height="thumbSize">
							</div>
						</template>
						<template #actions>
							<NcActionButton icon="icon-delete"
								:close-after-click="true"
								@click="unresolve(photo.fileid)">
								{{ t('mediadc', 'Remove file from resolved list') }}
							</NcActionButton>
						</template>
					</NcListItem>
				</transition-group>
				<div v-else class="empty-resolved" style="margin: 0 0 20px;">
					<NcEmptyContent style="margin-top: 5vh;"
						:title="t('mediadc', `No resolved ${selectedType} yet`)"
						:description="t('mediadc', 'Create a new task or work on existing ones and resolve some!')">
						<template #icon>
							<ClipboardListOutline />
						</template>
						<template #action>
							<NcButton :to="{ name: 'collector' }" type="primary">
								{{ t('mediadc', 'Create a new one!') }}
							</NcButton>
						</template>
					</NcEmptyContent>
				</div>
			</div>
			<transition-group v-else-if="resolved.data && resolved.data.length > 0"
				name="grid"
				tag="div"
				class="grid-view">
				<div v-for="photo in resolved.data"
					:key="photo.fileid"
					class="grid-view-item">
					<ResolvedListFile :file="photo" :files="resolved.data" />
				</div>
			</transition-group>
			<div v-else class="empty-resolved" style="margin: 0 0 20px;">
				<NcEmptyContent style="margin-top: 5vh;"
					:title="t('mediadc', `No resolved ${selectedType} yet`)"
					:description="t('mediadc', 'Create a new task or work on existing ones and resolve some!')">
					<template #icon>
						<ClipboardListOutline />
					</template>
					<template #action>
						<NcButton :to="{ name: 'collector' }" type="primary">
							{{ t('mediadc', 'Create a new one!') }}
						</NcButton>
					</template>
				</NcEmptyContent>
			</div>
		</Transition>
	</div>
</template>

<script>
import { getCurrentUser } from '@nextcloud/auth'
import { generateUrl } from '@nextcloud/router'

import Formats from '../../mixins/Formats.js'
import ResolvedListFile from './ResolvedListFile.vue'

import NcActionButton from '@nextcloud/vue/dist/Components/NcActionButton.js'
import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import NcEmptyContent from '@nextcloud/vue/dist/Components/NcEmptyContent.js'
import NcListItem from '@nextcloud/vue/dist/Components/NcListItem.js'
import ClipboardListOutline from 'vue-material-design-icons/ClipboardListOutline.vue'

import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'ResolvedList',
	components: {
		NcActionButton,
		NcButton,
		NcEmptyContent,
		NcListItem,
		ResolvedListFile,
		ClipboardListOutline,
	},
	mixins: [
		Formats,
	],
	data() {
		return {
			thumbSize: 48,
			listView: true,
			goToPage: 1,
		}
	},
	computed: {
		...mapGetters([
			'resolved',
			'page',
			'selectedType',
		]),
		tasksLink() {
			return generateUrl('/apps/mediadc')
		},
		viewTooltip() {
			return this.listView ? this.t('mediadc', 'Change to grid view') : this.t('mediadc', 'Change to list view')
		},
		pagesRange() {
			return Array.from({ length: this.resolved.total_pages }, (_, i) => i)
		},
	},
	methods: {
		...mapActions(['getResolved']),
		unresolve(fileid) {
			const lastFileOnPage = this.resolved.data.length === 1
			this.$store.dispatch('resolveFile', { fileid, resolved: false }).then(res => {
				if (res.data?.success) {
					if (lastFileOnPage && this.page > 0) {
						this.$store.commit('updatePage', this.page - 1)
					}
					this.$store.dispatch('getResolved')
				}
			})
		},
		imageUrl(fileid) {
			return generateUrl(`/core/preview?fileId=${fileid}&x=${this.thumbSize}&y=${this.thumbSize}$forceIcon=0`)
		},
		fileTitle(photo) {
			return `${photo.filename} (${this.formatBytes(Number(photo.filesize))})`
		},
		openFile(file) {
			const filesList = this.resolved.data.map(file => ({
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
		toggleListView() {
			this.listView = !this.listView
		},
		toggleMediaType() {
			this.$store.commit('setSelectedType', this.selectedType === 'photos' ? 'videos' : 'photos')
		},
		prevResolvedPage() {
			if (this.page > 0) {
				this.$store.commit('updatePage', this.page - 1)
			}
		},
		nextResolvedPage() {
			if (this.page < this.resolved.total_pages - 1) {
				this.$store.commit('updatePage', this.page + 1)
			}
		},
		navigateToPage() {
			if (this.goToPage > this.pagesRange.length) {
				this.goToPage = this.pagesRange.length
			} else if (this.goToPage <= 0) {
				this.goToPage = 1
			}
			this.$store.commit('updatePage', this.goToPage - 1)
		},
	},
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity .3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.list-move,
.list-enter-active,
.list-leave-active {
	transition: all .5s ease;
}

.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateY(30px);
}

.list-leave-active {
	position: absolute;
}

.grid-enter-active,
.grid-leave-active {
	transition: all .5s ease;
}

.grid-enter-from,
.grid-leave-to {
	opacity: 0;
}

.resolved-list {
	position: relative;
	min-height: 250px;
	max-height: 70vh;
	overflow-y: scroll;
	width: 100%;
	max-width: 1280px;
	padding: 10px 20px;
	margin: 10px auto;
	border: 2px solid var(--color-border-dark);
	border-radius: var(--border-radius-large);
}

.resolved-img-icon {
	border-radius: var(--border-radius-large);
	overflow: hidden;
	width: 48px;
	height: 48px;
	margin-right: 10px;
}

.resolved-list-heading {
	text-align: center;
	position: sticky;
	top: 0;
	z-index: 999;
	padding: 5px 0;
	margin: 10px 0;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 4px 0 var(--color-box-shadow);
	border-radius: var(--border-radius-large);
	background-color: var(--color-border);
}

.resolved-list-heading h2 {
	margin: 0 10px;
}

.toggle-view-button {
	position: absolute !important;
	top: 50%;
	right: 10px;
	transform: translateY(-50%);
}

.pagination.pagination-desktop {
	position: absolute;
	top: 50%;
	left: 10px;
	transform: translateY(-50%);
	display: flex;
	align-items: center;
	justify-content: center;
}

.pagination.pagination-mobile {
	visibility: hidden;
	display: none;
}

.list-view {
	width: 100%;
	max-width: 640px;
	margin: 0 auto;
}

.grid-view {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
}

.empty-resolved p {
	text-align: center;
}

@media (max-width: 650px) {
	.resolved-list-heading {
		margin: 10px 0;
	}

	.pagination.pagination-desktop {
		visibility: hidden;
		display: none;
	}

	.pagination.pagination-mobile {
		visibility: visible;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 10px 0 20px;
	}

	.resolved-list {
		padding: 10px 0 10px 10px;
	}

	.toggle-view-button {
		position: initial !important;
		transform: none;
	}

	.resolved-list-heading h2 {
		margin: 0 10px;
		font-size: 18px;
	}
}
</style>
