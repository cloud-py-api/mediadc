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
	<Content app-name="app-mediadc">
		<AppNavigation>
			<template #list>
				<AppNavigationItem :to="{name: 'collector'}"
					class="app-navigation__mediadc"
					:title="t('mediadc', 'Tasks')"
					icon="icon-category-app-bundles"
					exact />
				<AppNavigationItem v-if="showConfiguration"
					:to="{name: 'configuration'}"
					class="app-navigation__mediadc"
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

import Content from '@nextcloud/vue/dist/Components/Content'
import AppContent from '@nextcloud/vue/dist/Components/AppContent'
import AppNavigation from '@nextcloud/vue/dist/Components/AppNavigation'
import AppNavigationItem from '@nextcloud/vue/dist/Components/AppNavigationItem'
import AppNavigationSettings from '@nextcloud/vue/dist/Components/AppNavigationSettings'

import Configure from './mixins/Configure'
import DetailsListSettings from './components/settings/DetailsListSettings'

export default {
	name: 'MediaDC',
	components: {
		Content,
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
<style scoped>
.app-content {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	align-content: space-between;
}
</style>
