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
	<div class="tasks-list">
		<h2>{{ t('mediadc', 'Recent Tasks') }}</h2>
		<div v-if="tasks.length > 0">
			<transition-group name="list" tag="ul">
				<TasksListItem v-for="task in tasks"
					:key="task.id"
					class="task-row"
					:task="task" />
			</transition-group>
		</div>
		<div v-else class="empty-tasks-list">
			<NcEmptyContent style="margin-top: 5vh;"
				:name="t('mediadc', 'No tasks yet')"
				:description="t('mediadc', 'Create a new one!')">
				<template #icon>
					<ClipboardListOutline />
				</template>
			</NcEmptyContent>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { NcEmptyContent } from '@nextcloud/vue'
import ClipboardListOutline from 'vue-material-design-icons/ClipboardListOutline.vue'

import Formats from '../../mixins/Formats.js'
import TasksListItem from './TasksListItem.vue'

export default {
	name: 'TasksList',
	components: {
		TasksListItem,
		NcEmptyContent,
		ClipboardListOutline,
	},
	mixins: [Formats],
	data() {
		return {
			tasksUpdater: null,
		}
	},
	computed: {
		...mapGetters([
			'tasks',
		]),
	},
	beforeMount() {
		this.tasksUpdater = setInterval(() => this.getTasks(true), 5000)
	},
	beforeDestroy() {
		clearInterval(this.tasksUpdater)
	},
	methods: {
		...mapActions([
			'getTasks',
		]),
	},
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
	transition: all 1s ease;
}

.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateY(30px);
}

.tasks-list {
	padding: 20px;
	background-color: var(--color-primary-element-light);
	border-radius: var(--border-radius-large);
	width: 100%;
	margin: 10px;
	max-width: 600px;
	max-height: 482px;
	min-height: 410px;
	overflow-y: scroll;
}

.task-row {
	display: flex;
	align-items: center;
	margin-bottom: 10px;
	transition: box-shadow .3s;
	border-radius: var(--border-radius-pill);
	border-color: var(--color-border-dark);
}

.task-row:hover {
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

@media (max-width: 540px) {
	.task-row, .task-row a {
		flex-direction: column;
		padding: 5px;
	}
	.delete-task-button {
		visibility: visible;
	}
}

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
</style>
