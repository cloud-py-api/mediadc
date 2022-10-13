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
	<div v-if="!loading" class="container">
		<div class="heading">
			<h2>{{ rootTitle }}</h2>
			<p>
				{{ t('mediadc',
					'Here you can view resolved media files '
						+ '(removed from groups during the work on duplicates).')
				}}
				<br>
				{{ t('mediadc', 'This files won\'t be scanned in further tasks.') }}
			</p>
		</div>
		<div class="mediadc-row">
			<ResolvedList />
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import ResolvedList from '../components/resolved/ResolvedList'

export default {
	name: 'Resolved',
	components: {
		ResolvedList,
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
	computed: {
		...mapGetters([
			'page',
			'selectedType',
		]),
	},
	watch: {
		page() {
			this.$store.dispatch('getResolved')
		},
		selectedType() {
			this.$store.dispatch('getResolved')
		},
	},
	beforeMount() {
		this.$emit('update:loading', true)
		this.$store.dispatch('getResolved').then(res => {
			if (res.data.success) {
				this.$emit('update:loading', false)
			}
		}).catch(() => {
			this.$emit('update:loading', false)
		})
	},
}
</script>

<style scoped>
h2 {
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
	align-items: center;
	flex-direction: column;
}

@media (max-width: 960px) {
	.mediadc-row {
		flex-wrap: wrap;
		justify-content: center;
	}
}
</style>
