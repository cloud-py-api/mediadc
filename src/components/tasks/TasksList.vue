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
			<img class="empty-tasks-list-icon" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDM4Ljg5MSA0MzguODkxIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzguODkxIDQzOC44OTE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGQ9Ik0zNDcuOTY4LDU3LjUwM2gtMzkuNzA2VjM5Ljc0YzAtNS43NDctNi4yNjktOC4zNTktMTIuMDE2LTguMzU5aC0zMC44MjRjLTcuMzE0LTIwLjg5OC0yNS42LTMxLjM0Ny00Ni40OTgtMzEuMzQ3DQoJCQkJYy0yMC42NjgtMC43NzctMzkuNDY3LDExLjg5Ni00Ni40OTgsMzEuMzQ3aC0zMC4zMDJjLTUuNzQ3LDAtMTEuNDk0LDIuNjEyLTExLjQ5NCw4LjM1OXYxNy43NjNIOTAuOTIzDQoJCQkJYy0yMy41MywwLjI1MS00Mi43OCwxOC44MTMtNDMuODg2LDQyLjMxOHYyOTkuMzYzYzAsMjIuOTg4LDIwLjg5OCwzOS43MDYsNDMuODg2LDM5LjcwNmgyNTcuMDQ1DQoJCQkJYzIyLjk4OCwwLDQzLjg4Ni0xNi43MTgsNDMuODg2LTM5LjcwNlY5OS44MjJDMzkwLjc0OCw3Ni4zMTYsMzcxLjQ5OCw1Ny43NTQsMzQ3Ljk2OCw1Ny41MDN6IE0xNTEuNTI3LDUyLjI3OWgyOC43MzUNCgkJCQljNS4wMTYtMC42MTIsOS4wNDUtNC40MjgsOS45MjctOS40MDRjMy4wOTQtMTMuNDc0LDE0LjkxNS0yMy4xNDYsMjguNzM1LTIzLjUxYzEzLjY5MiwwLjQxNSwyNS4zMzUsMTAuMTE3LDI4LjIxMiwyMy41MQ0KCQkJCWMwLjkzNyw1LjE0OCw1LjIzMiw5LjAxMywxMC40NDksOS40MDRoMjkuNzh2NDEuNzk2SDE1MS41MjdWNTIuMjc5eiBNMzcwLjk1NiwzOTkuMTg1YzAsMTEuNDk0LTExLjQ5NCwxOC44MDgtMjIuOTg4LDE4LjgwOA0KCQkJCUg5MC45MjNjLTExLjQ5NCwwLTIyLjk4OC03LjMxNC0yMi45ODgtMTguODA4Vjk5LjgyMmMxLjA2Ni0xMS45NjQsMTAuOTc4LTIxLjIwMSwyMi45ODgtMjEuNDJoMzkuNzA2djI2LjY0NQ0KCQkJCWMwLjU1Miw1Ljg1NCw1LjYyMiwxMC4yMzMsMTEuNDk0LDkuOTI3aDE1NC4xMjJjNS45OCwwLjMyNywxMS4yMDktMy45OTIsMTIuMDE2LTkuOTI3Vjc4LjQwMWgzOS43MDYNCgkJCQljMTIuMDA5LDAuMjIsMjEuOTIyLDkuNDU2LDIyLjk4OCwyMS40MlYzOTkuMTg1eiIvPg0KCQkJPHBhdGggZD0iTTE3OS4yMTcsMjMzLjU2OWMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzY0LTE0LjYyOS0wLjUyMmwtMzMuNDM3LDMxLjg2OWwtMTQuMTA2LTE0LjYyOQ0KCQkJCWMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzYzLTE0LjYyOS0wLjUyMmMtNC4wNDcsNC4yNC00LjA0NywxMC45MTEsMCwxNS4xNTFsMjEuNDIsMjEuOTQzYzEuODU0LDIuMDc2LDQuNTMyLDMuMjI0LDcuMzE0LDMuMTM1DQoJCQkJYzIuNzU2LTAuMDM5LDUuMzg1LTEuMTY2LDcuMzE0LTMuMTM1bDQwLjc1MS0zOC42NjFjNC4wNC0zLjcwNiw0LjMxLTkuOTg2LDAuNjAzLTE0LjAyNQ0KCQkJCUMxNzkuNjI4LDIzMy45NjIsMTc5LjQyNywyMzMuNzYxLDE3OS4yMTcsMjMzLjU2OXoiLz4NCgkJCTxwYXRoIGQ9Ik0zMjkuMTYsMjU2LjAzNEgyMDguOTk3Yy01Ljc3MSwwLTEwLjQ0OSw0LjY3OC0xMC40NDksMTAuNDQ5czQuNjc4LDEwLjQ0OSwxMC40NDksMTAuNDQ5SDMyOS4xNg0KCQkJCWM1Ljc3MSwwLDEwLjQ0OS00LjY3OCwxMC40NDktMTAuNDQ5UzMzNC45MzEsMjU2LjAzNCwzMjkuMTYsMjU2LjAzNHoiLz4NCgkJCTxwYXRoIGQ9Ik0xNzkuMjE3LDE0OS45NzdjLTMuOTE5LTQuMTMxLTEwLjQyNS00LjM2NC0xNC42MjktMC41MjJsLTMzLjQzNywzMS44NjlsLTE0LjEwNi0xNC42MjkNCgkJCQljLTMuOTE5LTQuMTMxLTEwLjQyNS00LjM2NC0xNC42MjktMC41MjJjLTQuMDQ3LDQuMjQtNC4wNDcsMTAuOTExLDAsMTUuMTUxbDIxLjQyLDIxLjk0M2MxLjg1NCwyLjA3Niw0LjUzMiwzLjIyNCw3LjMxNCwzLjEzNQ0KCQkJCWMyLjc1Ni0wLjAzOSw1LjM4NS0xLjE2Niw3LjMxNC0zLjEzNWw0MC43NTEtMzguNjYxYzQuMDQtMy43MDYsNC4zMS05Ljk4NiwwLjYwMy0xNC4wMjUNCgkJCQlDMTc5LjYyOCwxNTAuMzcsMTc5LjQyNywxNTAuMTY5LDE3OS4yMTcsMTQ5Ljk3N3oiLz4NCgkJCTxwYXRoIGQ9Ik0zMjkuMTYsMTcyLjQ0MkgyMDguOTk3Yy01Ljc3MSwwLTEwLjQ0OSw0LjY3OC0xMC40NDksMTAuNDQ5czQuNjc4LDEwLjQ0OSwxMC40NDksMTAuNDQ5SDMyOS4xNg0KCQkJCWM1Ljc3MSwwLDEwLjQ0OS00LjY3OCwxMC40NDktMTAuNDQ5UzMzNC45MzEsMTcyLjQ0MiwzMjkuMTYsMTcyLjQ0MnoiLz4NCgkJCTxwYXRoIGQ9Ik0xNzkuMjE3LDMxNy4xNmMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzYzLTE0LjYyOS0wLjUyMmwtMzMuNDM3LDMxLjg2OWwtMTQuMTA2LTE0LjYyOQ0KCQkJCWMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzYzLTE0LjYyOS0wLjUyMmMtNC4wNDcsNC4yNC00LjA0NywxMC45MTEsMCwxNS4xNTFsMjEuNDIsMjEuOTQzYzEuODU0LDIuMDc2LDQuNTMyLDMuMjI0LDcuMzE0LDMuMTM1DQoJCQkJYzIuNzU2LTAuMDM5LDUuMzg1LTEuMTY2LDcuMzE0LTMuMTM1bDQwLjc1MS0zOC42NjFjNC4wNC0zLjcwNiw0LjMxLTkuOTg2LDAuNjAzLTE0LjAyNQ0KCQkJCUMxNzkuNjI4LDMxNy41NTQsMTc5LjQyNywzMTcuMzUzLDE3OS4yMTcsMzE3LjE2eiIvPg0KCQkJPHBhdGggZD0iTTMyOS4xNiwzMzkuNjI2SDIwOC45OTdjLTUuNzcxLDAtMTAuNDQ5LDQuNjc4LTEwLjQ0OSwxMC40NDlzNC42NzgsMTAuNDQ5LDEwLjQ0OSwxMC40NDlIMzI5LjE2DQoJCQkJYzUuNzcxLDAsMTAuNDQ5LTQuNjc4LDEwLjQ0OS0xMC40NDlTMzM0LjkzMSwzMzkuNjI2LDMyOS4xNiwzMzkuNjI2eiIvPg0KCQk8L2c+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=">
			<img class="empty-tasks-list-icon--dark" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQzOC44OTEgNDM4Ljg5MSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZD0iTTM0Ny45NjgsNTcuNTAzaC0zOS43MDZWMzkuNzRjMC01Ljc0Ny02LjI2OS04LjM1OS0xMi4wMTYtOC4zNTloLTMwLjgyNGMtNy4zMTQtMjAuODk4LTI1LjYtMzEuMzQ3LTQ2LjQ5OC0zMS4zNDcgICAgIGMtMjAuNjY4LTAuNzc3LTM5LjQ2NywxMS44OTYtNDYuNDk4LDMxLjM0N2gtMzAuMzAyYy01Ljc0NywwLTExLjQ5NCwyLjYxMi0xMS40OTQsOC4zNTl2MTcuNzYzSDkwLjkyMyAgICAgYy0yMy41MywwLjI1MS00Mi43OCwxOC44MTMtNDMuODg2LDQyLjMxOHYyOTkuMzYzYzAsMjIuOTg4LDIwLjg5OCwzOS43MDYsNDMuODg2LDM5LjcwNmgyNTcuMDQ1ICAgICBjMjIuOTg4LDAsNDMuODg2LTE2LjcxOCw0My44ODYtMzkuNzA2Vjk5LjgyMkMzOTAuNzQ4LDc2LjMxNiwzNzEuNDk4LDU3Ljc1NCwzNDcuOTY4LDU3LjUwM3ogTTE1MS41MjcsNTIuMjc5aDI4LjczNSAgICAgYzUuMDE2LTAuNjEyLDkuMDQ1LTQuNDI4LDkuOTI3LTkuNDA0YzMuMDk0LTEzLjQ3NCwxNC45MTUtMjMuMTQ2LDI4LjczNS0yMy41MWMxMy42OTIsMC40MTUsMjUuMzM1LDEwLjExNywyOC4yMTIsMjMuNTEgICAgIGMwLjkzNyw1LjE0OCw1LjIzMiw5LjAxMywxMC40NDksOS40MDRoMjkuNzh2NDEuNzk2SDE1MS41MjdWNTIuMjc5eiBNMzcwLjk1NiwzOTkuMTg1YzAsMTEuNDk0LTExLjQ5NCwxOC44MDgtMjIuOTg4LDE4LjgwOCAgICAgSDkwLjkyM2MtMTEuNDk0LDAtMjIuOTg4LTcuMzE0LTIyLjk4OC0xOC44MDhWOTkuODIyYzEuMDY2LTExLjk2NCwxMC45NzgtMjEuMjAxLDIyLjk4OC0yMS40MmgzOS43MDZ2MjYuNjQ1ICAgICBjMC41NTIsNS44NTQsNS42MjIsMTAuMjMzLDExLjQ5NCw5LjkyN2gxNTQuMTIyYzUuOTgsMC4zMjcsMTEuMjA5LTMuOTkyLDEyLjAxNi05LjkyN1Y3OC40MDFoMzkuNzA2ICAgICBjMTIuMDA5LDAuMjIsMjEuOTIyLDkuNDU2LDIyLjk4OCwyMS40MlYzOTkuMTg1eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCQk8cGF0aCBkPSJNMTc5LjIxNywyMzMuNTY5Yy0zLjkxOS00LjEzMS0xMC40MjUtNC4zNjQtMTQuNjI5LTAuNTIybC0zMy40MzcsMzEuODY5bC0xNC4xMDYtMTQuNjI5ICAgICBjLTMuOTE5LTQuMTMxLTEwLjQyNS00LjM2My0xNC42MjktMC41MjJjLTQuMDQ3LDQuMjQtNC4wNDcsMTAuOTExLDAsMTUuMTUxbDIxLjQyLDIxLjk0M2MxLjg1NCwyLjA3Niw0LjUzMiwzLjIyNCw3LjMxNCwzLjEzNSAgICAgYzIuNzU2LTAuMDM5LDUuMzg1LTEuMTY2LDcuMzE0LTMuMTM1bDQwLjc1MS0zOC42NjFjNC4wNC0zLjcwNiw0LjMxLTkuOTg2LDAuNjAzLTE0LjAyNSAgICAgQzE3OS42MjgsMjMzLjk2MiwxNzkuNDI3LDIzMy43NjEsMTc5LjIxNywyMzMuNTY5eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCQk8cGF0aCBkPSJNMzI5LjE2LDI1Ni4wMzRIMjA4Ljk5N2MtNS43NzEsMC0xMC40NDksNC42NzgtMTAuNDQ5LDEwLjQ0OXM0LjY3OCwxMC40NDksMTAuNDQ5LDEwLjQ0OUgzMjkuMTYgICAgIGM1Ljc3MSwwLDEwLjQ0OS00LjY3OCwxMC40NDktMTAuNDQ5UzMzNC45MzEsMjU2LjAzNCwzMjkuMTYsMjU2LjAzNHoiIGZpbGw9IiNmZmZmZmYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD4KCQkJPHBhdGggZD0iTTE3OS4yMTcsMTQ5Ljk3N2MtMy45MTktNC4xMzEtMTAuNDI1LTQuMzY0LTE0LjYyOS0wLjUyMmwtMzMuNDM3LDMxLjg2OWwtMTQuMTA2LTE0LjYyOSAgICAgYy0zLjkxOS00LjEzMS0xMC40MjUtNC4zNjQtMTQuNjI5LTAuNTIyYy00LjA0Nyw0LjI0LTQuMDQ3LDEwLjkxMSwwLDE1LjE1MWwyMS40MiwyMS45NDNjMS44NTQsMi4wNzYsNC41MzIsMy4yMjQsNy4zMTQsMy4xMzUgICAgIGMyLjc1Ni0wLjAzOSw1LjM4NS0xLjE2Niw3LjMxNC0zLjEzNWw0MC43NTEtMzguNjYxYzQuMDQtMy43MDYsNC4zMS05Ljk4NiwwLjYwMy0xNC4wMjUgICAgIEMxNzkuNjI4LDE1MC4zNywxNzkuNDI3LDE1MC4xNjksMTc5LjIxNywxNDkuOTc3eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCQk8cGF0aCBkPSJNMzI5LjE2LDE3Mi40NDJIMjA4Ljk5N2MtNS43NzEsMC0xMC40NDksNC42NzgtMTAuNDQ5LDEwLjQ0OXM0LjY3OCwxMC40NDksMTAuNDQ5LDEwLjQ0OUgzMjkuMTYgICAgIGM1Ljc3MSwwLDEwLjQ0OS00LjY3OCwxMC40NDktMTAuNDQ5UzMzNC45MzEsMTcyLjQ0MiwzMjkuMTYsMTcyLjQ0MnoiIGZpbGw9IiNmZmZmZmYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD4KCQkJPHBhdGggZD0iTTE3OS4yMTcsMzE3LjE2Yy0zLjkxOS00LjEzMS0xMC40MjUtNC4zNjMtMTQuNjI5LTAuNTIybC0zMy40MzcsMzEuODY5bC0xNC4xMDYtMTQuNjI5ICAgICBjLTMuOTE5LTQuMTMxLTEwLjQyNS00LjM2My0xNC42MjktMC41MjJjLTQuMDQ3LDQuMjQtNC4wNDcsMTAuOTExLDAsMTUuMTUxbDIxLjQyLDIxLjk0M2MxLjg1NCwyLjA3Niw0LjUzMiwzLjIyNCw3LjMxNCwzLjEzNSAgICAgYzIuNzU2LTAuMDM5LDUuMzg1LTEuMTY2LDcuMzE0LTMuMTM1bDQwLjc1MS0zOC42NjFjNC4wNC0zLjcwNiw0LjMxLTkuOTg2LDAuNjAzLTE0LjAyNSAgICAgQzE3OS42MjgsMzE3LjU1NCwxNzkuNDI3LDMxNy4zNTMsMTc5LjIxNywzMTcuMTZ6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+CgkJCTxwYXRoIGQ9Ik0zMjkuMTYsMzM5LjYyNkgyMDguOTk3Yy01Ljc3MSwwLTEwLjQ0OSw0LjY3OC0xMC40NDksMTAuNDQ5czQuNjc4LDEwLjQ0OSwxMC40NDksMTAuNDQ5SDMyOS4xNiAgICAgYzUuNzcxLDAsMTAuNDQ5LTQuNjc4LDEwLjQ0OS0xMC40NDlTMzM0LjkzMSwzMzkuNjI2LDMyOS4xNiwzMzkuNjI2eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCTwvZz4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+">
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

.badge.running, .badge.pending {
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

body.theme--dark .empty-tasks-list strong {
	color: #b2b2b2;
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

.empty-tasks-list-icon, .empty-tasks-list-icon--dark {
	width: 96px;
	height: 96px;
}

.empty-tasks-list-icon--dark {
	display: none;
	visibility: hidden;
}

body.theme--dark .empty-tasks-list-icon--dark {
	display: block;
	visibility: visible;
}

body.theme--dark .empty-tasks-list-icon {
	display: none;
	visibility: hidden;
}
</style>
