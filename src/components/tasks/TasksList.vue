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
	<div class="tasks-list">
		<h2>{{ t('mediadc', 'Recent Tasks') }}</h2>
		<div v-if="tasks.length > 0">
			<div v-for="task in tasks"
				:key="task.id"
				class="task-row">
				<router-link :to="{ name: 'collectorDetails', params: { taskId: task.id } }">
					<span :class="'badge ' + getStatusBadge(task)">{{ getStatusBadge(task) }}</span>
					<div style="display: flex; flex-wrap: wrap;">
						<span style="width: 100%;">
							<b>{{ parseTargetMtype(task) }}</b>
							{{ task.files_scanned !== task.files_total ? `${task.files_scanned}/` : '' }}{{ task.files_total }} file(s)
							({{ formatBytes(Number(task.files_total_size)) }})
						</span>
						<span class="task-time" style="width: 100%;">
							{{ parseUnixTimestamp(task.created_time) }}
							{{ Number(task.finished_time) > 0 ? ' - ' + parseUnixTimestamp(task.finished_time) : '' }}
						</span>
					</div>
				</router-link>
				<span class="delete-task-button icon-delete" @click="deleteTask(task)" />
			</div>
		</div>
		<div v-else class="empty-tasks-list">
			<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDM4Ljg5MSA0MzguODkxIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzguODkxIDQzOC44OTE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGQ9Ik0zNDcuOTY4LDU3LjUwM2gtMzkuNzA2VjM5Ljc0YzAtNS43NDctNi4yNjktOC4zNTktMTIuMDE2LTguMzU5aC0zMC44MjRjLTcuMzE0LTIwLjg5OC0yNS42LTMxLjM0Ny00Ni40OTgtMzEuMzQ3DQoJCQkJYy0yMC42NjgtMC43NzctMzkuNDY3LDExLjg5Ni00Ni40OTgsMzEuMzQ3aC0zMC4zMDJjLTUuNzQ3LDAtMTEuNDk0LDIuNjEyLTExLjQ5NCw4LjM1OXYxNy43NjNIOTAuOTIzDQoJCQkJYy0yMy41MywwLjI1MS00Mi43OCwxOC44MTMtNDMuODg2LDQyLjMxOHYyOTkuMzYzYzAsMjIuOTg4LDIwLjg5OCwzOS43MDYsNDMuODg2LDM5LjcwNmgyNTcuMDQ1DQoJCQkJYzIyLjk4OCwwLDQzLjg4Ni0xNi43MTgsNDMuODg2LTM5LjcwNlY5OS44MjJDMzkwLjc0OCw3Ni4zMTYsMzcxLjQ5OCw1Ny43NTQsMzQ3Ljk2OCw1Ny41MDN6IE0xNTEuNTI3LDUyLjI3OWgyOC43MzUNCgkJCQljNS4wMTYtMC42MTIsOS4wNDUtNC40MjgsOS45MjctOS40MDRjMy4wOTQtMTMuNDc0LDE0LjkxNS0yMy4xNDYsMjguNzM1LTIzLjUxYzEzLjY5MiwwLjQxNSwyNS4zMzUsMTAuMTE3LDI4LjIxMiwyMy41MQ0KCQkJCWMwLjkzNyw1LjE0OCw1LjIzMiw5LjAxMywxMC40NDksOS40MDRoMjkuNzh2NDEuNzk2SDE1MS41MjdWNTIuMjc5eiBNMzcwLjk1NiwzOTkuMTg1YzAsMTEuNDk0LTExLjQ5NCwxOC44MDgtMjIuOTg4LDE4LjgwOA0KCQkJCUg5MC45MjNjLTExLjQ5NCwwLTIyLjk4OC03LjMxNC0yMi45ODgtMTguODA4Vjk5LjgyMmMxLjA2Ni0xMS45NjQsMTAuOTc4LTIxLjIwMSwyMi45ODgtMjEuNDJoMzkuNzA2djI2LjY0NQ0KCQkJCWMwLjU1Miw1Ljg1NCw1LjYyMiwxMC4yMzMsMTEuNDk0LDkuOTI3aDE1NC4xMjJjNS45OCwwLjMyNywxMS4yMDktMy45OTIsMTIuMDE2LTkuOTI3Vjc4LjQwMWgzOS43MDYNCgkJCQljMTIuMDA5LDAuMjIsMjEuOTIyLDkuNDU2LDIyLjk4OCwyMS40MlYzOTkuMTg1eiIvPg0KCQkJPHBhdGggZD0iTTE3OS4yMTcsMjMzLjU2OWMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzY0LTE0LjYyOS0wLjUyMmwtMzMuNDM3LDMxLjg2OWwtMTQuMTA2LTE0LjYyOQ0KCQkJCWMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzYzLTE0LjYyOS0wLjUyMmMtNC4wNDcsNC4yNC00LjA0NywxMC45MTEsMCwxNS4xNTFsMjEuNDIsMjEuOTQzYzEuODU0LDIuMDc2LDQuNTMyLDMuMjI0LDcuMzE0LDMuMTM1DQoJCQkJYzIuNzU2LTAuMDM5LDUuMzg1LTEuMTY2LDcuMzE0LTMuMTM1bDQwLjc1MS0zOC42NjFjNC4wNC0zLjcwNiw0LjMxLTkuOTg2LDAuNjAzLTE0LjAyNQ0KCQkJCUMxNzkuNjI4LDIzMy45NjIsMTc5LjQyNywyMzMuNzYxLDE3OS4yMTcsMjMzLjU2OXoiLz4NCgkJCTxwYXRoIGQ9Ik0zMjkuMTYsMjU2LjAzNEgyMDguOTk3Yy01Ljc3MSwwLTEwLjQ0OSw0LjY3OC0xMC40NDksMTAuNDQ5czQuNjc4LDEwLjQ0OSwxMC40NDksMTAuNDQ5SDMyOS4xNg0KCQkJCWM1Ljc3MSwwLDEwLjQ0OS00LjY3OCwxMC40NDktMTAuNDQ5UzMzNC45MzEsMjU2LjAzNCwzMjkuMTYsMjU2LjAzNHoiLz4NCgkJCTxwYXRoIGQ9Ik0xNzkuMjE3LDE0OS45NzdjLTMuOTE5LTQuMTMxLTEwLjQyNS00LjM2NC0xNC42MjktMC41MjJsLTMzLjQzNywzMS44NjlsLTE0LjEwNi0xNC42MjkNCgkJCQljLTMuOTE5LTQuMTMxLTEwLjQyNS00LjM2NC0xNC42MjktMC41MjJjLTQuMDQ3LDQuMjQtNC4wNDcsMTAuOTExLDAsMTUuMTUxbDIxLjQyLDIxLjk0M2MxLjg1NCwyLjA3Niw0LjUzMiwzLjIyNCw3LjMxNCwzLjEzNQ0KCQkJCWMyLjc1Ni0wLjAzOSw1LjM4NS0xLjE2Niw3LjMxNC0zLjEzNWw0MC43NTEtMzguNjYxYzQuMDQtMy43MDYsNC4zMS05Ljk4NiwwLjYwMy0xNC4wMjUNCgkJCQlDMTc5LjYyOCwxNTAuMzcsMTc5LjQyNywxNTAuMTY5LDE3OS4yMTcsMTQ5Ljk3N3oiLz4NCgkJCTxwYXRoIGQ9Ik0zMjkuMTYsMTcyLjQ0MkgyMDguOTk3Yy01Ljc3MSwwLTEwLjQ0OSw0LjY3OC0xMC40NDksMTAuNDQ5czQuNjc4LDEwLjQ0OSwxMC40NDksMTAuNDQ5SDMyOS4xNg0KCQkJCWM1Ljc3MSwwLDEwLjQ0OS00LjY3OCwxMC40NDktMTAuNDQ5UzMzNC45MzEsMTcyLjQ0MiwzMjkuMTYsMTcyLjQ0MnoiLz4NCgkJCTxwYXRoIGQ9Ik0xNzkuMjE3LDMxNy4xNmMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzYzLTE0LjYyOS0wLjUyMmwtMzMuNDM3LDMxLjg2OWwtMTQuMTA2LTE0LjYyOQ0KCQkJCWMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzYzLTE0LjYyOS0wLjUyMmMtNC4wNDcsNC4yNC00LjA0NywxMC45MTEsMCwxNS4xNTFsMjEuNDIsMjEuOTQzYzEuODU0LDIuMDc2LDQuNTMyLDMuMjI0LDcuMzE0LDMuMTM1DQoJCQkJYzIuNzU2LTAuMDM5LDUuMzg1LTEuMTY2LDcuMzE0LTMuMTM1bDQwLjc1MS0zOC42NjFjNC4wNC0zLjcwNiw0LjMxLTkuOTg2LDAuNjAzLTE0LjAyNQ0KCQkJCUMxNzkuNjI4LDMxNy41NTQsMTc5LjQyNywzMTcuMzUzLDE3OS4yMTcsMzE3LjE2eiIvPg0KCQkJPHBhdGggZD0iTTMyOS4xNiwzMzkuNjI2SDIwOC45OTdjLTUuNzcxLDAtMTAuNDQ5LDQuNjc4LTEwLjQ0OSwxMC40NDlzNC42NzgsMTAuNDQ5LDEwLjQ0OSwxMC40NDlIMzI5LjE2DQoJCQkJYzUuNzcxLDAsMTAuNDQ5LTQuNjc4LDEwLjQ0OS0xMC40NDlTMzM0LjkzMSwzMzkuNjI2LDMyOS4xNiwzMzkuNjI2eiIvPg0KCQk8L2c+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=" width="96" height="96">
			<strong>{{ t('mediadc', 'No tasks yet. Create a new one!') }}</strong>
		</div>
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import { mapGetters } from 'vuex'
import Formats from '../../mixins/Formats'

export default {
	name: 'TasksList',
	mixins: [Formats],
	data() {
		return {
			tasksUpdater: null,
		}
	},
	computed: {
		...mapGetters([
			'settings',
			'tasks',
		]),
	},
	beforeMount() {
		this.tasksUpdater = setInterval(this.getTasks, 5000)
	},
	beforeDestroy() {
		clearInterval(this.tasksUpdater)
	},
	methods: {
		async getTasks() {
			axios.get(generateUrl('/apps/mediadc/api/v1/tasks')).then(res => {
				this.$store.dispatch('setTasks', res.data)
			})
		},
		deleteTask(task) {
			axios.delete(generateUrl(`/apps/mediadc/api/v1/tasks/${task.id}`)).then(res => {
				this.getTasks()
			})
		},
		terminateTask(taskId) {
			axios.post(generateUrl(`/apps/mediadc/api/v1/tasks/${taskId}/terminate`), { taskId }).then(res => {
				this.getTasks()
			})
		},
	},
}
</script>

<style scoped>
.tasks-list {
	padding: 20px;
	background-color: #E6F3FA;
	border-radius: 5px;
	width: 100%;
	margin: 10px;
	max-width: 600px;
	max-height: 480px;
	min-height: 410px;
	overflow-y: scroll;
}

.task-row {
	display: flex;
	align-items: center;
	border: 1px solid #dadada;
	background-color: #fff;
	border-radius: 5px;
	margin-bottom: 10px;
	transition: box-shadow .3s;
}

.task-row:hover {
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.task-row:hover .delete-task-button {
	visibility: visible;
}

.task-row a {
	padding: 10px 0 10px 20px;
	width: 100%;
	height: 100%;
	display: inline-flex;
	align-items: center;
}

.delete-task-button {
	display: inline-flex;
	visibility: hidden;
	width: 16px;
	height: 16px;
	margin: 10px 20px;
	cursor: pointer;
}

.task-time {
	color: #585858;
}

@media (max-width: 540px) {
	.task-row, .task-row a {
		flex-direction: column;
	}
	.delete-task-button {
		visibility: visible;
	}
	.badge {
		margin-right: 0;
		margin-bottom: 10px;
	}
}

.badge {
	display: inline-flex;
	padding: 0 10px;
	background-color: #eee;
	border-radius: 20px;
	margin-right: 10px;
}

.badge.finished {
	background-color: #49b382;
	color: #fff;
}

.badge.running {
	background-color: #dadada;
	color: #000;
}

.badge.error {
	background-color: #bd3f3f;
	color: #fff;
}

.badge.terminated {
	background-color: #f17b1b;
	color: #fff;
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

.empty-tasks-list strong {
	font-size: 16px;
	color: #636363;
}

.empty-tasks-list img {
	margin: 20px 0;
}

body.theme--dark .tasks-list {
	background-color: #333333;
}

body.theme--dark .task-row {
	background-color: #353535;
	border-color: #717171;
}

body.theme--dark .task-time {
	color: #a9a8a8;
}
</style>
