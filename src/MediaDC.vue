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
				<NcAppNavigationItem v-if="showConfiguration"
					:to="{name: 'configuration'}"
					:title="t('mediadc', 'Configuration')"
					icon="icon-user-admin" />
			</template>
			<template #footer>
				<NcAppNavigationSettings :title="t('mediadc', 'Settings')" :open="false">
					<DetailsListSettings />
				</NcAppNavigationSettings>
			</template>
		</NcAppNavigation>
		<NcAppContent :class="{ 'icon-loading': loading }">
			<router-view v-show="!loading" :loading.sync="loading" />
		</NcAppContent>
	</NcContent>
</template>

<script>
import { getCurrentUser } from '@nextcloud/auth'

import NcContent from '@nextcloud/vue/dist/Components/NcContent.js'
import NcAppContent from '@nextcloud/vue/dist/Components/NcAppContent.js'
import NcAppNavigation from '@nextcloud/vue/dist/Components/NcAppNavigation.js'
import NcAppNavigationItem from '@nextcloud/vue/dist/Components/NcAppNavigationItem.js'
import NcAppNavigationSettings from '@nextcloud/vue/dist/Components/NcAppNavigationSettings.js'

import Configure from './mixins/Configure.js'
import DetailsListSettings from './components/settings/DetailsListSettings.vue'

export default {
	name: 'MediaDC',
	components: {
		NcContent,
		NcAppContent,
		NcAppNavigation,
		NcAppNavigationItem,
		NcAppNavigationSettings,
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
