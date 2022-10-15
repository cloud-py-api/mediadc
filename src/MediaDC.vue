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
	<Content app-name="mediadc">
		<AppNavigation>
			<template #list>
				<AppNavigationItem :to="{name: 'collector'}"
					:title="t('mediadc', 'Tasks')"
					icon="icon-toggle-filelist"
					exact />
				<AppNavigationItem :to="{name: 'resolved'}"
					:title="t('mediadc', 'Resolved')"
					icon="icon-video-off" />
				<AppNavigationItem v-if="showConfiguration"
					:to="{name: 'configuration'}"
					:title="t('mediadc', 'Configuration')"
					icon="icon-user-admin" />
			</template>
			<template #footer>
				<AppNavigationSettings :title="t('mediadc', 'Settings')">
					<DetailsListSettings />
				</AppNavigationSettings>
			</template>
		</AppNavigation>
		<AppContent :class="{ 'icon-loading': loading }">
			<router-view v-show="!loading" :loading.sync="loading" />
		</AppContent>
	</Content>
</template>

<script>
import { getCurrentUser } from '@nextcloud/auth'

import Content from '@nextcloud/vue/dist/Components/Content.js'
import AppContent from '@nextcloud/vue/dist/Components/AppContent.js'
import AppNavigation from '@nextcloud/vue/dist/Components/AppNavigation.js'
import AppNavigationItem from '@nextcloud/vue/dist/Components/AppNavigationItem.js'
import AppNavigationSettings from '@nextcloud/vue/dist/Components/AppNavigationSettings.js'

import Configure from './mixins/Configure.js'
import DetailsListSettings from './components/settings/DetailsListSettings.vue'

export default {
	name: 'MediaDC',
	components: {
		Content, // eslint-disable-line vue/no-reserved-component-names
		AppContent,
		AppNavigation,
		AppNavigationItem,
		AppNavigationSettings,
		DetailsListSettings,
	},
	mixins: [Configure],
	data() {
		return {
			loading: true,
			showConfiguration: getCurrentUser() === null ? false : getCurrentUser().isAdmin,
		}
	},
}
</script>
