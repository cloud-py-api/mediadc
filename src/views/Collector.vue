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
	<div v-if="!loading" class="container">
		<div class="heading">
			<h2>{{ rootTitle }}</h2>
			<p>
				{{ t('mediadc', 'Welcome to Media Duplicate Collector (MediaDC). ') }}
				{{ t('mediadc', 'Here you can manage your duplicate collection tasks and see the history of previous finished tasks.') }}
			</p>
		</div>
		<div class="mediadc-row">
			<TasksNew />
			<TasksList />
		</div>
	</div>
</template>

<script>
import TasksNew from '../components/tasks/TasksNew.vue'
import TasksList from '../components/tasks/TasksList.vue'
import { loadState } from '@nextcloud/initial-state'
import { mapActions } from 'vuex'

export default {
	name: 'Collector',
	components: {
		TasksNew,
		TasksList,
	},
	props: {
		rootTitle: {
			type: String,
			required: true,
		},
		loading: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		return {
			updating: false,
		}
	},
	beforeMount() {
		if (this.getTasks().length > 0) {
			this.$emit('update:loading', false)
		} else {
			const tasks = loadState('mediadc', 'tasks', false)
			const settings = loadState('mediadc', 'settings', false)
			if (tasks) {
				this.$store.commit('setTasks', tasks)
				this.$emit('update:loading', false)
				if (settings) {
					this.$store.commit('setSettings', settings)
					this.$emit('update:loading', false)
				} else {
					this.$store.dispatch('getSettings').then(() => {
						this.$emit('update:loading', false)
					})
				}
			} else {
				this.$store.dispatch('getTasks', true).then(() => {
					this.$store.dispatch('getSettings').then(() => {
						this.$emit('update:loading', false)
					})
				})
			}
		}
	},
	methods: {
		...mapActions(['getTasks', 'getSettings']),
	},
}
</script>

<style scoped>
.container {
	padding: 0 20px;
	width: 100%;
	max-width: 1440px;
	margin: 0 auto;
}

h2 {
	font-size: 24px;
	font-weight: bold;
	text-align: center;
	margin: 20px 0 10px;
}

p {
	padding: 0 10px;
	margin: 10px 0;
	text-align: center;
}

.mediadc-row {
	display: flex;
	justify-content: center;
}

@media (max-width: 960px) {
	.mediadc-row {
		flex-wrap: wrap;
	}
}
</style>
