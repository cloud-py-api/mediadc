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
					:name="t('mediadc', 'Tasks')"
					exact>
					<template #icon>
						<FormatListBulletedSquare :size="20" />
					</template>
				</NcAppNavigationItem>
				<NcAppNavigationItem :to="{name: 'resolved'}"
					:name="t('mediadc', 'Resolved')">
					<template #icon>
						<FormatListChecks :size="20" />
					</template>
				</NcAppNavigationItem>
			</template>
			<template #footer>
				<ul class="app-navigation-entry__settings">
					<NcAppNavigationItem :aria-label="t('mediadc', 'Open MediaDC settings')"
						:name="t('mediadc', 'Settings')"
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
import { NcContent, NcAppContent, NcAppNavigation, NcAppNavigationItem } from '@nextcloud/vue'
import Cog from 'vue-material-design-icons/Cog.vue'
import FormatListBulletedSquare from 'vue-material-design-icons/FormatListBulletedSquare.vue'
import FormatListChecks from 'vue-material-design-icons/FormatListChecks.vue'

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
		FormatListBulletedSquare,
		FormatListChecks,
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
