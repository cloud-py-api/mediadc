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
	<NcListItem :name="listItemTitle"
		:bold="true"
		:force-display-actions="true"
		:to="{ name: 'collectorDetails', params: { taskId: task.id } }"
		class="task-list-item">
		<template #icon>
			<span :class="'badge ' + getStatusBadge(task)">{{ getStatusBadge(task) }}</span>
		</template>
		<template #subname>
			{{ listItemDetails }}
			<NcProgressBar :value="Math.round((task.files_scanned / task.files_total) * 100)"
				size="small"
				:error="getStatusBadge(task) === 'error'" />
		</template>
		<template #actions>
			<NcActionButton icon="icon-history" :close-after-click="true" @click="restartTask(task)">
				{{ getStatusBadge(task) === 'duplicated' ? t('mediadc', 'Start') : t('mediadc', 'Restart') }}
			</NcActionButton>
			<NcActionButton icon="icon-pause" :close-after-click="true" @click="terminateTask(task)">
				{{ t('mediadc', 'Stop') }}
			</NcActionButton>
			<NcActionButton v-tooltip="{content: t('mediadc', 'Create copy of the task'), placement: 'left'}"
				:close-after-click="true"
				@click="duplicateTask(task)">
				{{ t('mediadc', 'Duplicate') }}
				<template #icon>
					<ContentCopy :size="16" />
				</template>
			</NcActionButton>
			<NcActionButton icon="icon-delete" :close-after-click="true" @click="deleteTask(task)">
				{{ t('mediadc', 'Delete') }}
			</NcActionButton>
		</template>
	</NcListItem>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import {
	NcActionButton,
	NcProgressBar,
	NcListItem,
} from '@nextcloud/vue'
import ContentCopy from 'vue-material-design-icons/ContentCopy.vue'

import Formats from '../../mixins/Formats.js'

export default {
	name: 'TasksListItem',
	components: {
		NcActionButton,
		ContentCopy,
		NcListItem,
		NcProgressBar,
	},
	mixins: [Formats],
	props: {
		task: {
			type: Object,
			required: true,
		},
	},
	computed: {
		...mapGetters([
			'tasks',
		]),
		listItemTitle() {
			const taskName = this.task.name !== '' && this.task.name !== null ? this.task.name + ' - ' : ''
			return `${taskName}${this.parseTargetMtype(this.task)}
				${this.task.files_scanned !== this.task.files_total ? this.task.files_scanned + '/' : ''}${this.task.files_total} ${this.n('mediadc', 'file', 'files', this.task.files_total)}
				(${this.formatBytes(Number(this.task.files_total_size))})`
		},
		listItemDetails() {
			return `${this.parseUnixTimestamp(this.task.created_time)}
				${Number(this.task.finished_time) > 0 ? ' - ' + this.parseUnixTimestamp(this.task.finished_time) : ''}`
		},
	},
	methods: {
		...mapActions([
			'getTasks',
			'getSettings',
			'deleteTask',
			'duplicateTask',
			'terminateTask',
			'restartTask',
		]),
	},
}
</script>

<style>
.list-item {
	margin: 0 !important;
}
</style>

<style scoped>
.task-list-item {
	border: 1px solid #dadada;
	background-color: var(--color-main-background);
	border-radius: 16px;
}

@media (max-width: 540px) {
	.badge {
		margin-right: 0;
		margin-bottom: 10px;
	}
}
</style>
