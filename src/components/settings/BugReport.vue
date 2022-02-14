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
	<div class="bug-report">
		<h2>{{ t('mediadc', 'Bug report') }}</h2>
		<p>{{ t('mediadc', 'Collect not sensitive system info for bug report') }}</p>
		<div class="actions">
			<button v-if="!loading" style="margin: 10px 0;" @click="collectSystemInfo">
				{{ t('mediadc', 'Collect system info') }}
			</button>
			<button v-else style="margin: 10px 0;" disabled>
				<span class="icon-loading" />
			</button>
			<button v-if="systemInfo" @click="copySystemInfoToClipboard">
				{{ t('mediadc', 'Copy to clipboard') }}
			</button>
		</div>
		<div v-if="systemInfo" class="system-info">
			<h3>System info</h3>
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

export default {
	name: 'BugReport',
	data() {
		return {
			systemInfo: null,
			loading: false,
		}
	},
	methods: {
		collectSystemInfo() {
			this.loading = true
			axios.get(generateUrl('/apps/mediadc/api/v1/system-info')).then(res => {
				this.systemInfo = res.data
				this.loading = false
			}).catch(err => {
				console.debug(err)
				this.loading = false
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
	padding: 20px;
	border-radius: 5px;
	border: 1px solid #ff1414;
}
</style>
