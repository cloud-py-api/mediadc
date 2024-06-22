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
	<NcDashboardWidget :items="tasks" :loading="loading" :show-more-url="''">
		<template #default="{ item }">
			<NcDashboardWidgetItem :target-url="getItemUrl(item.id)"
				:avatar-url="getAvatarUrl()"
				:avatar-username="getAvatarUsername()"
				:avatar-is-no-user="true"
				:main-text="getItemText(item)"
				:sub-text="`${item.owner} - ${getStatusBadge(item)}`" />
		</template>
		<template #empty-content>
			<div class="empty-tasks-list">
				<NcEmptyContent style="margin-top: 5vh;"
					:name="t('mediadc', 'No tasks yet')">
					<template #icon>
						<ClipboardListOutline />
					</template>
					<template #action>
						<NcButton :href="getAppUrl()" type="primary">
							{{ t('mediadc', 'Create a new one!') }}
						</NcButton>
					</template>
				</NcEmptyContent>
			</div>
		</template>
	</NcDashboardWidget>
</template>

<script>
import { getCurrentUser } from '@nextcloud/auth'
import { generateUrl } from '@nextcloud/router'
import { loadState } from '@nextcloud/initial-state'
import { NcDashboardWidget, NcDashboardWidgetItem } from '@nextcloud/vue'

import Formats from '../mixins/Formats.js'

import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import NcEmptyContent from '@nextcloud/vue/dist/Components/NcEmptyContent.js'
import ClipboardListOutline from 'vue-material-design-icons/ClipboardListOutline.vue'

const tasks = loadState('mediadc', 'mediadc-recent-tasks')

export default {
	name: 'Dashboard',
	components: {
		NcDashboardWidget,
		NcDashboardWidgetItem,
		NcButton,
		NcEmptyContent,
		ClipboardListOutline,
	},
	mixins: [
		Formats,
	],
	data() {
		return {
			tasks,
			loading: true,
		}
	},
	async mounted() {
		this.loading = false
	},
	methods: {
		getAppUrl() {
			return generateUrl('/apps/mediadc')
		},
		getItemUrl(taskId) {
			return generateUrl(`/apps/mediadc/tasks/${taskId}`)
		},
		getAvatarUrl() {
			return generateUrl(`/avatar/${getCurrentUser().uid}/32`)
		},
		getAvatarUsername() {
			return getCurrentUser().uid
		},
		getItemText(item) {
			const taskName = item.name !== '' && item.name !== null ? item.name + ' - ' : ''
			return taskName + this.parseTargetMtype(item) + ' ' + item.files_total + ' ' + this.n('mediadc', 'file', 'files', Number(item.files_total)) + ' (' + this.formatBytes(item.files_total_size) + ')'
		},
	},
}
</script>

<style scoped>
.empty-tasks-list {
	padding: 20px;
	width: 100%;
	height: 80%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	flex-direction: column;
}

.empty-tasks-list a {
	text-decoration: underline;
}

.empty-tasks-list-icon, .empty-tasks-list-icon--dark {
	width: 96px;
	height: 96px;
}

.empty-tasks-list-icon--dark {
	display: none;
	visibility: hidden;
}
</style>
