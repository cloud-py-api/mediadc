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
				<Button type="tertiary" @click="prevResolvedPage">
					<template #icon>
						<span class="icon-view-previous pagination-button" />
					</template>
				</Button>
				<span style="margin-left: 5px;">{{ t('mediadc', 'Page:') }}&nbsp;</span>
				<span style="margin-right: 5px;">{{ page + 1 }}/{{ resolved.total_pages }}</span>
				<Button type="tertiary" @click="nextResolvedPage">
					<template #icon>
						<span class="icon-view-next pagination-button" />
					</template>
				</Button>
				<template v-if="resolved.total_pages > 1">
					<select id="to_page" v-model="goToPage" name="to_page">
						<option v-for="page of pagesRange" :key="page" :value="page">
							{{ page + 1 }}
						</option>
					</select>
					<Button v-tooltip="t('mediadc', 'Go to page')"
						type="tertiary"
						@click="navigateToPage">
						<template #icon>
							<span class="icon-confirm" />
						</template>
					</Button>
				</template>
			</div>
			<h2>{{ t('mediadc', 'Resolved list') }} ({{ resolved.total_items }} {{ translatePlural('mediadc', 'file', 'files', resolved.total_items) }})</h2>
			<Button v-tooltip="t('mediadc', 'Toggle media type')"
				type="tertiary"
				class="toggle-type-button"
				@click="toggleMediaType">
				<template #icon>
					<span :class="selectedType === 'photos' ? 'icon-video' : 'icon-picture'" />
				</template>
			</Button>
			<Button v-tooltip="viewTooltip"
				type="tertiary"
				class="toggle-view-button"
				@click="toggleListView">
				<template #icon>
					<span :class="listView ? 'icon-toggle-pictures' : 'icon-toggle-filelist'" />
				</template>
			</Button>
		</div>
		<div v-if="resolved.total_pages > 1" class="pagination pagination-mobile">
			<Button type="tertiary" @click="prevResolvedPage">
				<template #icon>
					<span class="icon-view-previous pagination-button" />
				</template>
			</Button>
			<span style="margin-left: 5px;">{{ t('mediadc', 'Page:') }}&nbsp;</span>
			<span style="margin-right: 5px;">{{ page + 1 }}/{{ resolved.total_pages }}</span>
			<Button type="tertiary" @click="nextResolvedPage">
				<template #icon>
					<span class="icon-view-next pagination-button" />
				</template>
			</Button>
			<template v-if="resolved.total_pages > 1">
				<select id="to_page" v-model="goToPage" name="to_page">
					<option v-for="page of pagesRange" :key="page" :value="page">
						{{ page + 1 }}
					</option>
				</select>
				<Button v-tooltip="t('mediadc', 'Go to page')"
					type="tertiary"
					@click="navigateToPage">
					<template #icon>
						<span class="icon-confirm" />
					</template>
				</Button>
			</template>
		</div>
		<Transition name="fade" appear>
			<div v-if="listView" class="list-view">
				<transition-group v-if="resolved.data && resolved.data.length > 0" name="fade" tag="ul">
					<ListItem v-for="photo in resolved.data"
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
							<ActionButton icon="icon-delete"
								:close-after-click="true"
								@click="unresolve(photo.fileid)">
								{{ t('mediadc', 'Remove file from resolved list') }}
							</ActionButton>
						</template>
					</ListItem>
				</transition-group>
				<div v-else class="empty-resolved" style="margin: 0 0 20px;">
					<EmptyContent style="margin-top: 5vh;">
						{{ t('mediadc', `No resolved ${selectedType} yet`) }}
						<template #icon>
							<img class="empty-tasks-list-icon" style="width: 100%; height: auto;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDM4Ljg5MSA0MzguODkxIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzguODkxIDQzOC44OTE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGQ9Ik0zNDcuOTY4LDU3LjUwM2gtMzkuNzA2VjM5Ljc0YzAtNS43NDctNi4yNjktOC4zNTktMTIuMDE2LTguMzU5aC0zMC44MjRjLTcuMzE0LTIwLjg5OC0yNS42LTMxLjM0Ny00Ni40OTgtMzEuMzQ3DQoJCQkJYy0yMC42NjgtMC43NzctMzkuNDY3LDExLjg5Ni00Ni40OTgsMzEuMzQ3aC0zMC4zMDJjLTUuNzQ3LDAtMTEuNDk0LDIuNjEyLTExLjQ5NCw4LjM1OXYxNy43NjNIOTAuOTIzDQoJCQkJYy0yMy41MywwLjI1MS00Mi43OCwxOC44MTMtNDMuODg2LDQyLjMxOHYyOTkuMzYzYzAsMjIuOTg4LDIwLjg5OCwzOS43MDYsNDMuODg2LDM5LjcwNmgyNTcuMDQ1DQoJCQkJYzIyLjk4OCwwLDQzLjg4Ni0xNi43MTgsNDMuODg2LTM5LjcwNlY5OS44MjJDMzkwLjc0OCw3Ni4zMTYsMzcxLjQ5OCw1Ny43NTQsMzQ3Ljk2OCw1Ny41MDN6IE0xNTEuNTI3LDUyLjI3OWgyOC43MzUNCgkJCQljNS4wMTYtMC42MTIsOS4wNDUtNC40MjgsOS45MjctOS40MDRjMy4wOTQtMTMuNDc0LDE0LjkxNS0yMy4xNDYsMjguNzM1LTIzLjUxYzEzLjY5MiwwLjQxNSwyNS4zMzUsMTAuMTE3LDI4LjIxMiwyMy41MQ0KCQkJCWMwLjkzNyw1LjE0OCw1LjIzMiw5LjAxMywxMC40NDksOS40MDRoMjkuNzh2NDEuNzk2SDE1MS41MjdWNTIuMjc5eiBNMzcwLjk1NiwzOTkuMTg1YzAsMTEuNDk0LTExLjQ5NCwxOC44MDgtMjIuOTg4LDE4LjgwOA0KCQkJCUg5MC45MjNjLTExLjQ5NCwwLTIyLjk4OC03LjMxNC0yMi45ODgtMTguODA4Vjk5LjgyMmMxLjA2Ni0xMS45NjQsMTAuOTc4LTIxLjIwMSwyMi45ODgtMjEuNDJoMzkuNzA2djI2LjY0NQ0KCQkJCWMwLjU1Miw1Ljg1NCw1LjYyMiwxMC4yMzMsMTEuNDk0LDkuOTI3aDE1NC4xMjJjNS45OCwwLjMyNywxMS4yMDktMy45OTIsMTIuMDE2LTkuOTI3Vjc4LjQwMWgzOS43MDYNCgkJCQljMTIuMDA5LDAuMjIsMjEuOTIyLDkuNDU2LDIyLjk4OCwyMS40MlYzOTkuMTg1eiIvPg0KCQkJPHBhdGggZD0iTTE3OS4yMTcsMjMzLjU2OWMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzY0LTE0LjYyOS0wLjUyMmwtMzMuNDM3LDMxLjg2OWwtMTQuMTA2LTE0LjYyOQ0KCQkJCWMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzYzLTE0LjYyOS0wLjUyMmMtNC4wNDcsNC4yNC00LjA0NywxMC45MTEsMCwxNS4xNTFsMjEuNDIsMjEuOTQzYzEuODU0LDIuMDc2LDQuNTMyLDMuMjI0LDcuMzE0LDMuMTM1DQoJCQkJYzIuNzU2LTAuMDM5LDUuMzg1LTEuMTY2LDcuMzE0LTMuMTM1bDQwLjc1MS0zOC42NjFjNC4wNC0zLjcwNiw0LjMxLTkuOTg2LDAuNjAzLTE0LjAyNQ0KCQkJCUMxNzkuNjI4LDIzMy45NjIsMTc5LjQyNywyMzMuNzYxLDE3OS4yMTcsMjMzLjU2OXoiLz4NCgkJCTxwYXRoIGQ9Ik0zMjkuMTYsMjU2LjAzNEgyMDguOTk3Yy01Ljc3MSwwLTEwLjQ0OSw0LjY3OC0xMC40NDksMTAuNDQ5czQuNjc4LDEwLjQ0OSwxMC40NDksMTAuNDQ5SDMyOS4xNg0KCQkJCWM1Ljc3MSwwLDEwLjQ0OS00LjY3OCwxMC40NDktMTAuNDQ5UzMzNC45MzEsMjU2LjAzNCwzMjkuMTYsMjU2LjAzNHoiLz4NCgkJCTxwYXRoIGQ9Ik0xNzkuMjE3LDE0OS45NzdjLTMuOTE5LTQuMTMxLTEwLjQyNS00LjM2NC0xNC42MjktMC41MjJsLTMzLjQzNywzMS44NjlsLTE0LjEwNi0xNC42MjkNCgkJCQljLTMuOTE5LTQuMTMxLTEwLjQyNS00LjM2NC0xNC42MjktMC41MjJjLTQuMDQ3LDQuMjQtNC4wNDcsMTAuOTExLDAsMTUuMTUxbDIxLjQyLDIxLjk0M2MxLjg1NCwyLjA3Niw0LjUzMiwzLjIyNCw3LjMxNCwzLjEzNQ0KCQkJCWMyLjc1Ni0wLjAzOSw1LjM4NS0xLjE2Niw3LjMxNC0zLjEzNWw0MC43NTEtMzguNjYxYzQuMDQtMy43MDYsNC4zMS05Ljk4NiwwLjYwMy0xNC4wMjUNCgkJCQlDMTc5LjYyOCwxNTAuMzcsMTc5LjQyNywxNTAuMTY5LDE3OS4yMTcsMTQ5Ljk3N3oiLz4NCgkJCTxwYXRoIGQ9Ik0zMjkuMTYsMTcyLjQ0MkgyMDguOTk3Yy01Ljc3MSwwLTEwLjQ0OSw0LjY3OC0xMC40NDksMTAuNDQ5czQuNjc4LDEwLjQ0OSwxMC40NDksMTAuNDQ5SDMyOS4xNg0KCQkJCWM1Ljc3MSwwLDEwLjQ0OS00LjY3OCwxMC40NDktMTAuNDQ5UzMzNC45MzEsMTcyLjQ0MiwzMjkuMTYsMTcyLjQ0MnoiLz4NCgkJCTxwYXRoIGQ9Ik0xNzkuMjE3LDMxNy4xNmMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzYzLTE0LjYyOS0wLjUyMmwtMzMuNDM3LDMxLjg2OWwtMTQuMTA2LTE0LjYyOQ0KCQkJCWMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzYzLTE0LjYyOS0wLjUyMmMtNC4wNDcsNC4yNC00LjA0NywxMC45MTEsMCwxNS4xNTFsMjEuNDIsMjEuOTQzYzEuODU0LDIuMDc2LDQuNTMyLDMuMjI0LDcuMzE0LDMuMTM1DQoJCQkJYzIuNzU2LTAuMDM5LDUuMzg1LTEuMTY2LDcuMzE0LTMuMTM1bDQwLjc1MS0zOC42NjFjNC4wNC0zLjcwNiw0LjMxLTkuOTg2LDAuNjAzLTE0LjAyNQ0KCQkJCUMxNzkuNjI4LDMxNy41NTQsMTc5LjQyNywzMTcuMzUzLDE3OS4yMTcsMzE3LjE2eiIvPg0KCQkJPHBhdGggZD0iTTMyOS4xNiwzMzkuNjI2SDIwOC45OTdjLTUuNzcxLDAtMTAuNDQ5LDQuNjc4LTEwLjQ0OSwxMC40NDlzNC42NzgsMTAuNDQ5LDEwLjQ0OSwxMC40NDlIMzI5LjE2DQoJCQkJYzUuNzcxLDAsMTAuNDQ5LTQuNjc4LDEwLjQ0OS0xMC40NDlTMzM0LjkzMSwzMzkuNjI2LDMyOS4xNiwzMzkuNjI2eiIvPg0KCQk8L2c+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=">
							<img class="empty-tasks-list-icon--dark" style="width: 100%; height: auto;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQzOC44OTEgNDM4Ljg5MSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZD0iTTM0Ny45NjgsNTcuNTAzaC0zOS43MDZWMzkuNzRjMC01Ljc0Ny02LjI2OS04LjM1OS0xMi4wMTYtOC4zNTloLTMwLjgyNGMtNy4zMTQtMjAuODk4LTI1LjYtMzEuMzQ3LTQ2LjQ5OC0zMS4zNDcgICAgIGMtMjAuNjY4LTAuNzc3LTM5LjQ2NywxMS44OTYtNDYuNDk4LDMxLjM0N2gtMzAuMzAyYy01Ljc0NywwLTExLjQ5NCwyLjYxMi0xMS40OTQsOC4zNTl2MTcuNzYzSDkwLjkyMyAgICAgYy0yMy41MywwLjI1MS00Mi43OCwxOC44MTMtNDMuODg2LDQyLjMxOHYyOTkuMzYzYzAsMjIuOTg4LDIwLjg5OCwzOS43MDYsNDMuODg2LDM5LjcwNmgyNTcuMDQ1ICAgICBjMjIuOTg4LDAsNDMuODg2LTE2LjcxOCw0My44ODYtMzkuNzA2Vjk5LjgyMkMzOTAuNzQ4LDc2LjMxNiwzNzEuNDk4LDU3Ljc1NCwzNDcuOTY4LDU3LjUwM3ogTTE1MS41MjcsNTIuMjc5aDI4LjczNSAgICAgYzUuMDE2LTAuNjEyLDkuMDQ1LTQuNDI4LDkuOTI3LTkuNDA0YzMuMDk0LTEzLjQ3NCwxNC45MTUtMjMuMTQ2LDI4LjczNS0yMy41MWMxMy42OTIsMC40MTUsMjUuMzM1LDEwLjExNywyOC4yMTIsMjMuNTEgICAgIGMwLjkzNyw1LjE0OCw1LjIzMiw5LjAxMywxMC40NDksOS40MDRoMjkuNzh2NDEuNzk2SDE1MS41MjdWNTIuMjc5eiBNMzcwLjk1NiwzOTkuMTg1YzAsMTEuNDk0LTExLjQ5NCwxOC44MDgtMjIuOTg4LDE4LjgwOCAgICAgSDkwLjkyM2MtMTEuNDk0LDAtMjIuOTg4LTcuMzE0LTIyLjk4OC0xOC44MDhWOTkuODIyYzEuMDY2LTExLjk2NCwxMC45NzgtMjEuMjAxLDIyLjk4OC0yMS40MmgzOS43MDZ2MjYuNjQ1ICAgICBjMC41NTIsNS44NTQsNS42MjIsMTAuMjMzLDExLjQ5NCw5LjkyN2gxNTQuMTIyYzUuOTgsMC4zMjcsMTEuMjA5LTMuOTkyLDEyLjAxNi05LjkyN1Y3OC40MDFoMzkuNzA2ICAgICBjMTIuMDA5LDAuMjIsMjEuOTIyLDkuNDU2LDIyLjk4OCwyMS40MlYzOTkuMTg1eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCQk8cGF0aCBkPSJNMTc5LjIxNywyMzMuNTY5Yy0zLjkxOS00LjEzMS0xMC40MjUtNC4zNjQtMTQuNjI5LTAuNTIybC0zMy40MzcsMzEuODY5bC0xNC4xMDYtMTQuNjI5ICAgICBjLTMuOTE5LTQuMTMxLTEwLjQyNS00LjM2My0xNC42MjktMC41MjJjLTQuMDQ3LDQuMjQtNC4wNDcsMTAuOTExLDAsMTUuMTUxbDIxLjQyLDIxLjk0M2MxLjg1NCwyLjA3Niw0LjUzMiwzLjIyNCw3LjMxNCwzLjEzNSAgICAgYzIuNzU2LTAuMDM5LDUuMzg1LTEuMTY2LDcuMzE0LTMuMTM1bDQwLjc1MS0zOC42NjFjNC4wNC0zLjcwNiw0LjMxLTkuOTg2LDAuNjAzLTE0LjAyNSAgICAgQzE3OS42MjgsMjMzLjk2MiwxNzkuNDI3LDIzMy43NjEsMTc5LjIxNywyMzMuNTY5eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCQk8cGF0aCBkPSJNMzI5LjE2LDI1Ni4wMzRIMjA4Ljk5N2MtNS43NzEsMC0xMC40NDksNC42NzgtMTAuNDQ5LDEwLjQ0OXM0LjY3OCwxMC40NDksMTAuNDQ5LDEwLjQ0OUgzMjkuMTYgICAgIGM1Ljc3MSwwLDEwLjQ0OS00LjY3OCwxMC40NDktMTAuNDQ5UzMzNC45MzEsMjU2LjAzNCwzMjkuMTYsMjU2LjAzNHoiIGZpbGw9IiNmZmZmZmYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD4KCQkJPHBhdGggZD0iTTE3OS4yMTcsMTQ5Ljk3N2MtMy45MTktNC4xMzEtMTAuNDI1LTQuMzY0LTE0LjYyOS0wLjUyMmwtMzMuNDM3LDMxLjg2OWwtMTQuMTA2LTE0LjYyOSAgICAgYy0zLjkxOS00LjEzMS0xMC40MjUtNC4zNjQtMTQuNjI5LTAuNTIyYy00LjA0Nyw0LjI0LTQuMDQ3LDEwLjkxMSwwLDE1LjE1MWwyMS40MiwyMS45NDNjMS44NTQsMi4wNzYsNC41MzIsMy4yMjQsNy4zMTQsMy4xMzUgICAgIGMyLjc1Ni0wLjAzOSw1LjM4NS0xLjE2Niw3LjMxNC0zLjEzNWw0MC43NTEtMzguNjYxYzQuMDQtMy43MDYsNC4zMS05Ljk4NiwwLjYwMy0xNC4wMjUgICAgIEMxNzkuNjI4LDE1MC4zNywxNzkuNDI3LDE1MC4xNjksMTc5LjIxNywxNDkuOTc3eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCQk8cGF0aCBkPSJNMzI5LjE2LDE3Mi40NDJIMjA4Ljk5N2MtNS43NzEsMC0xMC40NDksNC42NzgtMTAuNDQ5LDEwLjQ0OXM0LjY3OCwxMC40NDksMTAuNDQ5LDEwLjQ0OUgzMjkuMTYgICAgIGM1Ljc3MSwwLDEwLjQ0OS00LjY3OCwxMC40NDktMTAuNDQ5UzMzNC45MzEsMTcyLjQ0MiwzMjkuMTYsMTcyLjQ0MnoiIGZpbGw9IiNmZmZmZmYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD4KCQkJPHBhdGggZD0iTTE3OS4yMTcsMzE3LjE2Yy0zLjkxOS00LjEzMS0xMC40MjUtNC4zNjMtMTQuNjI5LTAuNTIybC0zMy40MzcsMzEuODY5bC0xNC4xMDYtMTQuNjI5ICAgICBjLTMuOTE5LTQuMTMxLTEwLjQyNS00LjM2My0xNC42MjktMC41MjJjLTQuMDQ3LDQuMjQtNC4wNDcsMTAuOTExLDAsMTUuMTUxbDIxLjQyLDIxLjk0M2MxLjg1NCwyLjA3Niw0LjUzMiwzLjIyNCw3LjMxNCwzLjEzNSAgICAgYzIuNzU2LTAuMDM5LDUuMzg1LTEuMTY2LDcuMzE0LTMuMTM1bDQwLjc1MS0zOC42NjFjNC4wNC0zLjcwNiw0LjMxLTkuOTg2LDAuNjAzLTE0LjAyNSAgICAgQzE3OS42MjgsMzE3LjU1NCwxNzkuNDI3LDMxNy4zNTMsMTc5LjIxNywzMTcuMTZ6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+CgkJCTxwYXRoIGQ9Ik0zMjkuMTYsMzM5LjYyNkgyMDguOTk3Yy01Ljc3MSwwLTEwLjQ0OSw0LjY3OC0xMC40NDksMTAuNDQ5czQuNjc4LDEwLjQ0OSwxMC40NDksMTAuNDQ5SDMyOS4xNiAgICAgYzUuNzcxLDAsMTAuNDQ5LTQuNjc4LDEwLjQ0OS0xMC40NDlTMzM0LjkzMSwzMzkuNjI2LDMyOS4xNiwzMzkuNjI2eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCTwvZz4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+">
						</template>
						<template #desc>
							<a :href="tasksLink">
								{{ t('mediadc', 'Create a new task or work on existing and resolve some!') }}
							</a>
						</template>
					</EmptyContent>
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
				<EmptyContent style="margin-top: 5vh;">
					{{ t('mediadc', `No resolved ${selectedType} yet`) }}
					<template #icon>
						<img class="empty-tasks-list-icon" style="width: 100%; height: auto;" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDM4Ljg5MSA0MzguODkxIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzguODkxIDQzOC44OTE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGQ9Ik0zNDcuOTY4LDU3LjUwM2gtMzkuNzA2VjM5Ljc0YzAtNS43NDctNi4yNjktOC4zNTktMTIuMDE2LTguMzU5aC0zMC44MjRjLTcuMzE0LTIwLjg5OC0yNS42LTMxLjM0Ny00Ni40OTgtMzEuMzQ3DQoJCQkJYy0yMC42NjgtMC43NzctMzkuNDY3LDExLjg5Ni00Ni40OTgsMzEuMzQ3aC0zMC4zMDJjLTUuNzQ3LDAtMTEuNDk0LDIuNjEyLTExLjQ5NCw4LjM1OXYxNy43NjNIOTAuOTIzDQoJCQkJYy0yMy41MywwLjI1MS00Mi43OCwxOC44MTMtNDMuODg2LDQyLjMxOHYyOTkuMzYzYzAsMjIuOTg4LDIwLjg5OCwzOS43MDYsNDMuODg2LDM5LjcwNmgyNTcuMDQ1DQoJCQkJYzIyLjk4OCwwLDQzLjg4Ni0xNi43MTgsNDMuODg2LTM5LjcwNlY5OS44MjJDMzkwLjc0OCw3Ni4zMTYsMzcxLjQ5OCw1Ny43NTQsMzQ3Ljk2OCw1Ny41MDN6IE0xNTEuNTI3LDUyLjI3OWgyOC43MzUNCgkJCQljNS4wMTYtMC42MTIsOS4wNDUtNC40MjgsOS45MjctOS40MDRjMy4wOTQtMTMuNDc0LDE0LjkxNS0yMy4xNDYsMjguNzM1LTIzLjUxYzEzLjY5MiwwLjQxNSwyNS4zMzUsMTAuMTE3LDI4LjIxMiwyMy41MQ0KCQkJCWMwLjkzNyw1LjE0OCw1LjIzMiw5LjAxMywxMC40NDksOS40MDRoMjkuNzh2NDEuNzk2SDE1MS41MjdWNTIuMjc5eiBNMzcwLjk1NiwzOTkuMTg1YzAsMTEuNDk0LTExLjQ5NCwxOC44MDgtMjIuOTg4LDE4LjgwOA0KCQkJCUg5MC45MjNjLTExLjQ5NCwwLTIyLjk4OC03LjMxNC0yMi45ODgtMTguODA4Vjk5LjgyMmMxLjA2Ni0xMS45NjQsMTAuOTc4LTIxLjIwMSwyMi45ODgtMjEuNDJoMzkuNzA2djI2LjY0NQ0KCQkJCWMwLjU1Miw1Ljg1NCw1LjYyMiwxMC4yMzMsMTEuNDk0LDkuOTI3aDE1NC4xMjJjNS45OCwwLjMyNywxMS4yMDktMy45OTIsMTIuMDE2LTkuOTI3Vjc4LjQwMWgzOS43MDYNCgkJCQljMTIuMDA5LDAuMjIsMjEuOTIyLDkuNDU2LDIyLjk4OCwyMS40MlYzOTkuMTg1eiIvPg0KCQkJPHBhdGggZD0iTTE3OS4yMTcsMjMzLjU2OWMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzY0LTE0LjYyOS0wLjUyMmwtMzMuNDM3LDMxLjg2OWwtMTQuMTA2LTE0LjYyOQ0KCQkJCWMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzYzLTE0LjYyOS0wLjUyMmMtNC4wNDcsNC4yNC00LjA0NywxMC45MTEsMCwxNS4xNTFsMjEuNDIsMjEuOTQzYzEuODU0LDIuMDc2LDQuNTMyLDMuMjI0LDcuMzE0LDMuMTM1DQoJCQkJYzIuNzU2LTAuMDM5LDUuMzg1LTEuMTY2LDcuMzE0LTMuMTM1bDQwLjc1MS0zOC42NjFjNC4wNC0zLjcwNiw0LjMxLTkuOTg2LDAuNjAzLTE0LjAyNQ0KCQkJCUMxNzkuNjI4LDIzMy45NjIsMTc5LjQyNywyMzMuNzYxLDE3OS4yMTcsMjMzLjU2OXoiLz4NCgkJCTxwYXRoIGQ9Ik0zMjkuMTYsMjU2LjAzNEgyMDguOTk3Yy01Ljc3MSwwLTEwLjQ0OSw0LjY3OC0xMC40NDksMTAuNDQ5czQuNjc4LDEwLjQ0OSwxMC40NDksMTAuNDQ5SDMyOS4xNg0KCQkJCWM1Ljc3MSwwLDEwLjQ0OS00LjY3OCwxMC40NDktMTAuNDQ5UzMzNC45MzEsMjU2LjAzNCwzMjkuMTYsMjU2LjAzNHoiLz4NCgkJCTxwYXRoIGQ9Ik0xNzkuMjE3LDE0OS45NzdjLTMuOTE5LTQuMTMxLTEwLjQyNS00LjM2NC0xNC42MjktMC41MjJsLTMzLjQzNywzMS44NjlsLTE0LjEwNi0xNC42MjkNCgkJCQljLTMuOTE5LTQuMTMxLTEwLjQyNS00LjM2NC0xNC42MjktMC41MjJjLTQuMDQ3LDQuMjQtNC4wNDcsMTAuOTExLDAsMTUuMTUxbDIxLjQyLDIxLjk0M2MxLjg1NCwyLjA3Niw0LjUzMiwzLjIyNCw3LjMxNCwzLjEzNQ0KCQkJCWMyLjc1Ni0wLjAzOSw1LjM4NS0xLjE2Niw3LjMxNC0zLjEzNWw0MC43NTEtMzguNjYxYzQuMDQtMy43MDYsNC4zMS05Ljk4NiwwLjYwMy0xNC4wMjUNCgkJCQlDMTc5LjYyOCwxNTAuMzcsMTc5LjQyNywxNTAuMTY5LDE3OS4yMTcsMTQ5Ljk3N3oiLz4NCgkJCTxwYXRoIGQ9Ik0zMjkuMTYsMTcyLjQ0MkgyMDguOTk3Yy01Ljc3MSwwLTEwLjQ0OSw0LjY3OC0xMC40NDksMTAuNDQ5czQuNjc4LDEwLjQ0OSwxMC40NDksMTAuNDQ5SDMyOS4xNg0KCQkJCWM1Ljc3MSwwLDEwLjQ0OS00LjY3OCwxMC40NDktMTAuNDQ5UzMzNC45MzEsMTcyLjQ0MiwzMjkuMTYsMTcyLjQ0MnoiLz4NCgkJCTxwYXRoIGQ9Ik0xNzkuMjE3LDMxNy4xNmMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzYzLTE0LjYyOS0wLjUyMmwtMzMuNDM3LDMxLjg2OWwtMTQuMTA2LTE0LjYyOQ0KCQkJCWMtMy45MTktNC4xMzEtMTAuNDI1LTQuMzYzLTE0LjYyOS0wLjUyMmMtNC4wNDcsNC4yNC00LjA0NywxMC45MTEsMCwxNS4xNTFsMjEuNDIsMjEuOTQzYzEuODU0LDIuMDc2LDQuNTMyLDMuMjI0LDcuMzE0LDMuMTM1DQoJCQkJYzIuNzU2LTAuMDM5LDUuMzg1LTEuMTY2LDcuMzE0LTMuMTM1bDQwLjc1MS0zOC42NjFjNC4wNC0zLjcwNiw0LjMxLTkuOTg2LDAuNjAzLTE0LjAyNQ0KCQkJCUMxNzkuNjI4LDMxNy41NTQsMTc5LjQyNywzMTcuMzUzLDE3OS4yMTcsMzE3LjE2eiIvPg0KCQkJPHBhdGggZD0iTTMyOS4xNiwzMzkuNjI2SDIwOC45OTdjLTUuNzcxLDAtMTAuNDQ5LDQuNjc4LTEwLjQ0OSwxMC40NDlzNC42NzgsMTAuNDQ5LDEwLjQ0OSwxMC40NDlIMzI5LjE2DQoJCQkJYzUuNzcxLDAsMTAuNDQ5LTQuNjc4LDEwLjQ0OS0xMC40NDlTMzM0LjkzMSwzMzkuNjI2LDMyOS4xNiwzMzkuNjI2eiIvPg0KCQk8L2c+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=">
						<img class="empty-tasks-list-icon--dark" style="width: 100%; height: auto;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQzOC44OTEgNDM4Ljg5MSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZD0iTTM0Ny45NjgsNTcuNTAzaC0zOS43MDZWMzkuNzRjMC01Ljc0Ny02LjI2OS04LjM1OS0xMi4wMTYtOC4zNTloLTMwLjgyNGMtNy4zMTQtMjAuODk4LTI1LjYtMzEuMzQ3LTQ2LjQ5OC0zMS4zNDcgICAgIGMtMjAuNjY4LTAuNzc3LTM5LjQ2NywxMS44OTYtNDYuNDk4LDMxLjM0N2gtMzAuMzAyYy01Ljc0NywwLTExLjQ5NCwyLjYxMi0xMS40OTQsOC4zNTl2MTcuNzYzSDkwLjkyMyAgICAgYy0yMy41MywwLjI1MS00Mi43OCwxOC44MTMtNDMuODg2LDQyLjMxOHYyOTkuMzYzYzAsMjIuOTg4LDIwLjg5OCwzOS43MDYsNDMuODg2LDM5LjcwNmgyNTcuMDQ1ICAgICBjMjIuOTg4LDAsNDMuODg2LTE2LjcxOCw0My44ODYtMzkuNzA2Vjk5LjgyMkMzOTAuNzQ4LDc2LjMxNiwzNzEuNDk4LDU3Ljc1NCwzNDcuOTY4LDU3LjUwM3ogTTE1MS41MjcsNTIuMjc5aDI4LjczNSAgICAgYzUuMDE2LTAuNjEyLDkuMDQ1LTQuNDI4LDkuOTI3LTkuNDA0YzMuMDk0LTEzLjQ3NCwxNC45MTUtMjMuMTQ2LDI4LjczNS0yMy41MWMxMy42OTIsMC40MTUsMjUuMzM1LDEwLjExNywyOC4yMTIsMjMuNTEgICAgIGMwLjkzNyw1LjE0OCw1LjIzMiw5LjAxMywxMC40NDksOS40MDRoMjkuNzh2NDEuNzk2SDE1MS41MjdWNTIuMjc5eiBNMzcwLjk1NiwzOTkuMTg1YzAsMTEuNDk0LTExLjQ5NCwxOC44MDgtMjIuOTg4LDE4LjgwOCAgICAgSDkwLjkyM2MtMTEuNDk0LDAtMjIuOTg4LTcuMzE0LTIyLjk4OC0xOC44MDhWOTkuODIyYzEuMDY2LTExLjk2NCwxMC45NzgtMjEuMjAxLDIyLjk4OC0yMS40MmgzOS43MDZ2MjYuNjQ1ICAgICBjMC41NTIsNS44NTQsNS42MjIsMTAuMjMzLDExLjQ5NCw5LjkyN2gxNTQuMTIyYzUuOTgsMC4zMjcsMTEuMjA5LTMuOTkyLDEyLjAxNi05LjkyN1Y3OC40MDFoMzkuNzA2ICAgICBjMTIuMDA5LDAuMjIsMjEuOTIyLDkuNDU2LDIyLjk4OCwyMS40MlYzOTkuMTg1eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCQk8cGF0aCBkPSJNMTc5LjIxNywyMzMuNTY5Yy0zLjkxOS00LjEzMS0xMC40MjUtNC4zNjQtMTQuNjI5LTAuNTIybC0zMy40MzcsMzEuODY5bC0xNC4xMDYtMTQuNjI5ICAgICBjLTMuOTE5LTQuMTMxLTEwLjQyNS00LjM2My0xNC42MjktMC41MjJjLTQuMDQ3LDQuMjQtNC4wNDcsMTAuOTExLDAsMTUuMTUxbDIxLjQyLDIxLjk0M2MxLjg1NCwyLjA3Niw0LjUzMiwzLjIyNCw3LjMxNCwzLjEzNSAgICAgYzIuNzU2LTAuMDM5LDUuMzg1LTEuMTY2LDcuMzE0LTMuMTM1bDQwLjc1MS0zOC42NjFjNC4wNC0zLjcwNiw0LjMxLTkuOTg2LDAuNjAzLTE0LjAyNSAgICAgQzE3OS42MjgsMjMzLjk2MiwxNzkuNDI3LDIzMy43NjEsMTc5LjIxNywyMzMuNTY5eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCQk8cGF0aCBkPSJNMzI5LjE2LDI1Ni4wMzRIMjA4Ljk5N2MtNS43NzEsMC0xMC40NDksNC42NzgtMTAuNDQ5LDEwLjQ0OXM0LjY3OCwxMC40NDksMTAuNDQ5LDEwLjQ0OUgzMjkuMTYgICAgIGM1Ljc3MSwwLDEwLjQ0OS00LjY3OCwxMC40NDktMTAuNDQ5UzMzNC45MzEsMjU2LjAzNCwzMjkuMTYsMjU2LjAzNHoiIGZpbGw9IiNmZmZmZmYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD4KCQkJPHBhdGggZD0iTTE3OS4yMTcsMTQ5Ljk3N2MtMy45MTktNC4xMzEtMTAuNDI1LTQuMzY0LTE0LjYyOS0wLjUyMmwtMzMuNDM3LDMxLjg2OWwtMTQuMTA2LTE0LjYyOSAgICAgYy0zLjkxOS00LjEzMS0xMC40MjUtNC4zNjQtMTQuNjI5LTAuNTIyYy00LjA0Nyw0LjI0LTQuMDQ3LDEwLjkxMSwwLDE1LjE1MWwyMS40MiwyMS45NDNjMS44NTQsMi4wNzYsNC41MzIsMy4yMjQsNy4zMTQsMy4xMzUgICAgIGMyLjc1Ni0wLjAzOSw1LjM4NS0xLjE2Niw3LjMxNC0zLjEzNWw0MC43NTEtMzguNjYxYzQuMDQtMy43MDYsNC4zMS05Ljk4NiwwLjYwMy0xNC4wMjUgICAgIEMxNzkuNjI4LDE1MC4zNywxNzkuNDI3LDE1MC4xNjksMTc5LjIxNywxNDkuOTc3eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCQk8cGF0aCBkPSJNMzI5LjE2LDE3Mi40NDJIMjA4Ljk5N2MtNS43NzEsMC0xMC40NDksNC42NzgtMTAuNDQ5LDEwLjQ0OXM0LjY3OCwxMC40NDksMTAuNDQ5LDEwLjQ0OUgzMjkuMTYgICAgIGM1Ljc3MSwwLDEwLjQ0OS00LjY3OCwxMC40NDktMTAuNDQ5UzMzNC45MzEsMTcyLjQ0MiwzMjkuMTYsMTcyLjQ0MnoiIGZpbGw9IiNmZmZmZmYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD4KCQkJPHBhdGggZD0iTTE3OS4yMTcsMzE3LjE2Yy0zLjkxOS00LjEzMS0xMC40MjUtNC4zNjMtMTQuNjI5LTAuNTIybC0zMy40MzcsMzEuODY5bC0xNC4xMDYtMTQuNjI5ICAgICBjLTMuOTE5LTQuMTMxLTEwLjQyNS00LjM2My0xNC42MjktMC41MjJjLTQuMDQ3LDQuMjQtNC4wNDcsMTAuOTExLDAsMTUuMTUxbDIxLjQyLDIxLjk0M2MxLjg1NCwyLjA3Niw0LjUzMiwzLjIyNCw3LjMxNCwzLjEzNSAgICAgYzIuNzU2LTAuMDM5LDUuMzg1LTEuMTY2LDcuMzE0LTMuMTM1bDQwLjc1MS0zOC42NjFjNC4wNC0zLjcwNiw0LjMxLTkuOTg2LDAuNjAzLTE0LjAyNSAgICAgQzE3OS42MjgsMzE3LjU1NCwxNzkuNDI3LDMxNy4zNTMsMTc5LjIxNywzMTcuMTZ6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+CgkJCTxwYXRoIGQ9Ik0zMjkuMTYsMzM5LjYyNkgyMDguOTk3Yy01Ljc3MSwwLTEwLjQ0OSw0LjY3OC0xMC40NDksMTAuNDQ5czQuNjc4LDEwLjQ0OSwxMC40NDksMTAuNDQ5SDMyOS4xNiAgICAgYzUuNzcxLDAsMTAuNDQ5LTQuNjc4LDEwLjQ0OS0xMC40NDlTMzM0LjkzMSwzMzkuNjI2LDMyOS4xNiwzMzkuNjI2eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCTwvZz4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8L2c+PC9zdmc+">
					</template>
					<template #desc>
						<a :href="tasksLink">
							{{ t('mediadc', 'Create a new task or work on existing and resolve some!') }}
						</a>
					</template>
				</EmptyContent>
			</div>
		</Transition>
	</div>
</template>

<script>
import { getCurrentUser } from '@nextcloud/auth'
import { generateUrl } from '@nextcloud/router'

import Formats from '../../mixins/Formats.js'
import ResolvedListFile from './ResolvedListFile.vue'

import ActionButton from '@nextcloud/vue/dist/Components/ActionButton.js'
import Button from '@nextcloud/vue/dist/Components/Button.js'
import EmptyContent from '@nextcloud/vue/dist/Components/EmptyContent.js'
import ListItem from '@nextcloud/vue/dist/Components/ListItem.js'

import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'ResolvedList',
	components: {
		ActionButton,
		Button, // eslint-disable-line vue/no-reserved-component-names
		EmptyContent,
		ListItem,
		ResolvedListFile,
	},
	mixins: [
		Formats,
	],
	data() {
		return {
			thumbSize: 48,
			listView: true,
			goToPage: 0,
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
			this.$store.commit('updatePage', this.goToPage)
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
	position: absolute;
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
		position: initial;
		transform: none;
	}

	.resolved-list-heading h2 {
		margin: 0 10px;
		font-size: 18px;
	}
}
</style>