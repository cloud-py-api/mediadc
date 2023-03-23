<!--
 - @copyright Copyright (c) 2021-2023 Andrey Borysenko <andrey18106x@gmail.com>
 -
 - @copyright Copyright (c) 2021-2023 Alexander Piskun <bigcat88@icloud.com>
 -
 - @author 2021-2023 Andrey Borysenko <andrey18106x@gmail.com>
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
	<NcContent app-name="mediadc">
		<NcAppNavigation>
			<template #list>
				<NcAppNavigationItem :to="{name: 'collector'}"
					:title="t('mediadc', 'Tasks')"
					icon="icon-toggle-filelist"
					exact />
				<NcAppNavigationItem :to="{name: 'resolved'}"
					:title="t('mediadc', 'Resolved')"
					icon="icon-video-off" />
			</template>
			<template #footer>
				<ul class="app-navigation-entry__settings">
					<NcAppNavigationItem :aria-label="t('mediadc', 'Open MediaDC settings')"
						:title="t('mediadc', 'Settings')"
						@click.prevent.stop="openSettingsModal">
						<Cog slot="icon" :size="20" />
					</NcAppNavigationItem>
				</ul>
			</template>
			<AppSettings :open.sync="settingsOpened"
				@close="closeSettingsModal" />
		</NcAppNavigation>
		<NcAppContent :class="{ 'icon-loading': loading }">
			<router-view v-show="!loading" :loading.sync="loading" />
		</NcAppContent>
	</NcContent>
</template>

<script>
import NcContent from '@nextcloud/vue/dist/Components/NcContent.js'
import NcAppContent from '@nextcloud/vue/dist/Components/NcAppContent.js'
import NcAppNavigation from '@nextcloud/vue/dist/Components/NcAppNavigation.js'
import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem.js'
import Cog from 'vue-material-design-icons/Cog.vue'

import AppSettings from './components/settings/AppSettings.vue'

export default {
	name: 'MediaDC',
	components: {
		NcContent,
		NcAppContent,
		NcAppNavigation,
		NcAppNavigationItem,
		AppSettings,
		Cog,
	},
	data() {
		return {
			loading: true,
			settingsOpened: false,
		}
	},
	methods: {
		openSettingsModal() {
			this.settingsOpened = true
		},
		closeSettingsModal() {
			this.settingsOpened = false
		},
	},
}
</script>

<style scoped>
.app-navigation-entry__settings {
	height: auto !important;
	overflow: hidden !important;
	padding-top: 0 !important;
	flex: 0 0 auto;
}
</style>
