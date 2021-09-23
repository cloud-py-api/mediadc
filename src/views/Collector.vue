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
	<div v-if="!loading" class="container">
		<div class="heading">
			<h1>{{ rootTitle }}</h1>
			<p>
				{{ t('mediadc_collector_welcome',
					'Welcome to Media Duplicate Collector (MediaDC). ' +
						'Here you can manage your duplicate collection tasks and ' +
						'see the history of previous finished tasks.')
				}}
			</p>
		</div>
		<div class="mediadc-row">
			<TasksNew />
			<TasksList />
		</div>
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import { mapGetters } from 'vuex'

import Configure from '../mixins/Configure'
import TasksNew from '../components/tasks/TasksNew'
import TasksList from '../components/tasks/TasksList'

export default {
	name: 'Collector',
	components: {
		TasksNew,
		TasksList,
	},
	mixins: [
		Configure,
	],
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
	computed: {
		...mapGetters([
			'settings',
			'tasks',
		]),
	},
	beforeMount() {
		this.getContent()
	},
	methods: {
		async getContent() {
			this.$emit('update:loading', true)
			this.getTasks()
		},
		async getTasks() {
			axios.get(generateUrl('/apps/mediadc/api/v1/tasks')).then(res => {
				this.$store.dispatch('setTasks', res.data)
				this.$emit('update:loading', false)
			})
		},
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

h1 {
	font-size: 24px;
	font-weight: bold;
	text-align: center;
	margin: 20px 0 10px;
}

button {
	margin: 20px 0;
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
		justify-content: center;
	}
}
</style>
