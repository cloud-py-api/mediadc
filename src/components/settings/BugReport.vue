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
	<div class="bug-report">
		<p style="margin: 0 0 20px;">
			{{ t('mediadc', 'Collect non sensitive system info for bug report') }}
		</p>
		<NcButton class="mediadc-button-vue"
			type="secondary"
			:disabled="updating"
			:aria-label="t('mediadc', 'Collect system info')"
			@click="collectSystemInfo">
			{{ t('mediadc', 'Collect system info') }}
			<template v-if="updating" #icon>
				<span class="icon-loading-small" />
			</template>
		</NcButton>
		<div v-if="systemInfo" class="system-info">
			<h3>{{ t('mediadc', 'System info') }}</h3>
			<NcButton v-if="systemInfo"
				type="tertiary"
				class="mediadc-button-vue"
				@click="copySystemInfoToClipboard">
				{{ t('mediadc', 'Copy to clipboard') }}
				<template #icon>
					<ContentCopy :size="16" />
				</template>
			</NcButton>
			<p>
				<pre>{{ systemInfo }}</pre>
			</p>
		</div>
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'
import { showSuccess } from '@nextcloud/dialogs'

import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import ContentCopy from 'vue-material-design-icons/ContentCopy.vue'

export default {
	name: 'BugReport',
	components: {
		NcButton,
		ContentCopy,
	},
	data() {
		return {
			systemInfo: null,
			updating: false,
		}
	},
	methods: {
		collectSystemInfo() {
			this.updating = true
			axios.get(generateUrl('/apps/mediadc/api/v1/system-info')).then(res => {
				this.systemInfo = res.data
				this.updating = false
			}).catch(err => {
				console.debug(err)
				this.updating = false
			})
		},
		copySystemInfoToClipboard() {
			navigator.clipboard.writeText(JSON.stringify(this.systemInfo, null, 2))
			showSuccess(this.t('mediadc', 'Copied to clipboard'))
		},
	},
}
</script>

<style scoped>
.bug-report {
	padding: 20px 0;
	border-top: 1px solid var(--color-error);
	border-bottom: 1px solid var(--color-error);
}

.system-info pre {
	border: 1px solid var(--color-border);
	padding: 10px 20px;
	margin: 20px 0;
	border-radius: var(--border-radius);
}
</style>
