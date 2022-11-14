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
	<div v-if="!loading" class="container" style="text-align: center;">
		<h2>{{ rootTitle }}</h2>
		<div v-if="isAdmin">
			<p>
				{{ t('mediadc', 'Welcome to MediaDC. You\'re almost there! The last setup step - installation of Python dependencies.') }}
				<br>
				{{ t('mediadc', 'Here you can run automatic installation of Python MediaDC dependencies.') }}
				<br>
				{{ t('mediadc', 'This may take a few minutes (depending on your system config).') }}
				<br>
				{{ t('mediadc', 'After checking or installing you can see the results below in a detailed table (installed packages, errors, requirements overview).') }}
				<br>
				{{ t('mediadc', 'You can install all dependencies manually, please refer documentation for your OS how to do this:') }}
				<a href="https://github.com/andrey18106/mediadc/wiki">{{ t('mediadc', 'wikis') }}</a>.
				<br>
				{{ t('mediadc', 'If you have any additional questions contact us in') }} <a href="https://t.me/mediadc_support">{{ t('mediadc', 'Telegram chat') }}</a>.
			</p>
			<div class="installed">
				<NcCheckboxRadioSwitch v-tooltip="installed
						? t('mediadc', 'Required packages installed')
						: t('mediadc', 'Required package not installed')"
					:checked.sync="installed"
					style="margin: 10px auto;"
					disabled>
					{{ t('mediadc', 'Installed:') }} {{ installed }}
				</NcCheckboxRadioSwitch>
			</div>
			<div class="general-actions">
				<NcButton class="mediadc-button-vue"
					type="secondary"
					:disabled="installing"
					@click="install">
					<template #default>
						{{ !installed ? t('mediadc', 'Install') : t('mediadc', 'Reinstall') }}
					</template>
					<template v-if="installing" #icon>
						<span class="icon-loading" />
					</template>
				</NcButton>
				<NcButton class="mediadc-button-vue"
					type="secondary"
					style="margin: 0 10px"
					:disabled="checking || installing"
					@click="check">
					<template #default>
						{{ t('mediadc', 'Check installation') }}
					</template>
					<template v-if="checking || installing" #icon>
						<span class="icon-loading" />
					</template>
				</NcButton>
				<NcButton v-if="installed"
					class="mediadc-button-vue"
					type="secondary"
					@click="finishConfiguration">
					{{ t('mediadc', 'Install finished') }}
				</NcButton>
			</div>
		</div>
		<div v-else-if="!isAdmin && !installed && !loading">
			<p>{{ t('mediadc', 'MediaDC application can be configured only by administration.') }}</p>
			<p>{{ t('mediadc', 'Please contact your cloud administration.') }}</p>
		</div>
		<div v-else>
			<NcButton v-if="installed" class="mediadc-button-vue" @click="finishConfiguration">
				{{ t('mediadc', 'Go to MediaDC') }}
			</NcButton>
		</div>
		<div v-if="isAdmin" class="install-details">
			<div v-if="available_algorithms && available_algorithms.length > 0 && installed"
				class="available_algorithms"
				style="margin: 20px 0 10px;">
				{{ t('mediadc', 'Available algorithms: ') }} {{ available_algorithms.join(', ') }}
			</div>
			<div v-if="installed && video_required && video_required.length > 0">
				<strong>{{ t('mediadc', 'Video processing won\'t work, video_required packages not installed.') }}</strong>
				<p>{{ t('mediadc', 'Not installed video_required packages:') }} {{ video_required }}</p>
				<p>{{ t('mediadc', 'video_required packages can\'t be installed automatically, this should be done by administrator manually and then recheck installation on this page.') }}</p>
			</div>
			<div v-if="installed_list && Object.keys(installed_list).length > 0" class="dependencies-table">
				<table>
					<div v-show="updating" class="action-blackout">
						<span class="icon-loading" />
					</div>
					<caption>{{ t('mediadc', 'Python dependencies list') }}</caption>
					<thead>
						<tr>
							<th><b>{{ t('mediadc', 'Type') }}</b></th>
							<th><b>{{ t('mediadc', 'Packages') }}</b></th>
							<th><b>{{ t('mediadc', 'Installed') }}</b></th>
							<th><b>{{ t('mediadc', 'Actions') }}</b></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="listName in Object.keys(installed_list).sort().reverse()" :key="listName">
							<td>{{ listName }}</td>
							<td>
								<span v-for="(packageName, index) in Object.keys(installed_list[listName]).sort()" :key="packageName" class="package">
									<span v-tooltip="getPackageTooltip(listName, packageName)">
										{{ installed_list[listName][packageName].package }}{{ (index !== Object.keys(installed_list[listName]).length - 1) ? ', ' : '' }}
									</span>
								</span>
							</td>
							<td>{{ not_installed_list[listName].length === 0 }}</td>
							<td style="display: flex; align-items: center; justify-content: center;">
								<NcButton class="mediadc-button-vue"
									:disabled="Object.keys(not_installed_list[listName]).length === 0"
									@click="installDepsList(listName)">
									{{ t('mediadc', 'Install') }}
								</NcButton>
								<NcButton class="mediadc-button-vue"
									:disabled="Object.keys(not_installed_list[listName]).length > 0"
									style="margin: 0 10px"
									@click="updateDepsList(listName)">
									{{ t('mediadc', 'Update') }}
								</NcButton>
								<NcButton class="mediadc-button-vue"
									:disabled="Object.keys(not_installed_list[listName]).length > 0"
									@click="deleteDepsList(listName)">
									{{ t('mediadc', 'Delete') }}
								</NcButton>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div v-if="errors && errors.length > 0" class="install-errors">
			<h3>
				<span class="icon-error" />
				{{ t('mediadc', 'Configuration errors') }}
			</h3>
			<div class="errors-list">
				<div v-for="error in errors" :key="error" class="errors-list-item">
					<pre>{{ error }}</pre>
				</div>
			</div>
		</div>
		<div v-if="warnings && warnings.length > 0" class="install-warnings">
			<h3>
				<span class="icon-alert-outline" />
				{{ t('mediadc', 'Configuration warnings') }}
			</h3>
			<div class="warnings-list">
				<div v-for="warning in warnings" :key="warning" class="warnings-list-item">
					<pre>{{ warning }}</pre>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getCurrentUser } from '@nextcloud/auth'

import Configure from '../mixins/Configure.js'

import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import NcCheckboxRadioSwitch from '@nextcloud/vue/dist/Components/NcCheckboxRadioSwitch.js'

export default {
	name: 'Configuration',
	components: {
		NcButton,
		NcCheckboxRadioSwitch,
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
			isAdmin: getCurrentUser() === null ? false : getCurrentUser().isAdmin,
		}
	},
	methods: {
		getPackageTooltip(listName, packageName) {
			if (this.installed_list[listName][packageName].version !== 'none') {
				return `${this.installed_list[listName][packageName].location}: ${this.installed_list[listName][packageName].version}`
			}
			return 'Not installed'
		},
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

a {
	text-decoration: underline;
}

.installed {
	display: flex;
	align-items: center;
	justify-content: center;
}

.installed input {
	margin: 0 10px;
}

.general-actions {
	display: flex;
	align-items: center;
	justify-content: center;
}

.dependencies-table {
	width: 100%;
	overflow-x: scroll;
	margin: 20px auto;
}

.dependencies-table table {
	margin: 0 auto;
	position: relative;
}

.dependencies-table table caption {
	padding: 5px 10px;
	border-bottom: 1px solid #dadada;
}

.dependencies-table table th, .dependencies-table table td {
	padding: 5px 10px;
	border-bottom: 1px solid #dadada;
	border-right: 1px solid #dadada;
}

.dependencies-table table th:last-child, .dependencies-table table td:last-child {
	border-right: none;
}

.action-blackout {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(0, 0, 0, 0.3);
	z-index: 10;
	border-top-left-radius: var(--border-radius-large);
	border-top-right-radius: var(--border-radius-large);
}

.install-errors {
	max-height: 50vh;
	overflow-y: scroll;
	border: 1px solid var(--color-error);
	border-radius: 5px;
	padding: 0 10px 10px;
	margin: 10px auto;
}

.errors-list-item {
	border-bottom: 1px solid var(--color-error);
	padding: 5px;
	text-align-last: left;
}

.install-warnings {
	max-height: 50vh;
	overflow-y: scroll;
	border: 1px solid var(--color-warning);
	border-radius: 5px;
	padding: 0 10px 10px;
	margin: 10px auto;
}

.warnings-list-item {
	border-bottom: 1px solid var(--color-warning);
	padding: 5px;
	text-align-last: left;
}
</style>
