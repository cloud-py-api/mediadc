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
	<div v-if="!loading" class="mediadc-configuration">
		<h2>{{ rootTitle }}</h2>
		<div v-if="isAdmin" class="configuration">
			<p>
				{{ t('mediadc', 'Welcome to MediaDC. You almost there! The last setup step - installation of Python dependencies.') }}
				<br>
				{{ t('mediadc', 'Here you can run automatic installation of Python MediaDC dependencies.') }}
				<br>
				{{ t('mediadc', 'This may take a few minutes (regarding on your system config).') }}
				<br>
				{{ t('mediadc', 'After checking or installing you can see the results below in a detailed table (installed packages, errors, requirements overview).') }}
				<br>
				{{ t('mediadc', 'You can install all dependencies with hands, please refer documentation for your OS how to do this:') }}
				<a href="https://github.com/andrey18106/mediadc/wiki">{{ t('mediadc', 'wikis') }}</a>.
				<br>
				{{ t('mediadc', 'If you have any additional questions contact us in') }} <a href="https://t.me/mediadc_support">{{ t('mediadc', 'Telegram chat') }}</a>.
			</p>
			<div class="installed">
				<CheckboxRadioSwitch :checked.sync="installed" disabled>
					{{ t('mediadc', 'Installed:') }} {{ installed }}
				</CheckboxRadioSwitch>
				<!-- <input id="installed"
					type="checkbox"
					name="installed"
					:v-model="installed"
					:checked="installed"
					disabled>
				<label for="installed">
					{{ t('mediadc', 'Installed:') }} {{ installed }}
				</label> -->
			</div>
			<button v-if="!installing" @click="install">
				{{ !installed ? t('mediadc', 'Install') : t('mediadc', 'Reinstall') }}
			</button>
			<button v-else disabled>
				<span class="icon-loading" />
			</button>
			<button v-if="!checking && !installing" @click="check">
				{{ t('mediadc', 'Check installation') }}
			</button>
			<button v-else disabled>
				<span class="icon-loading" />
			</button>
			<button v-if="installed" @click="finishConfiguration">
				{{ t('mediadc', 'Install finished') }}
			</button>
		</div>
		<div v-else-if="!isAdmin && !installed && !loading">
			<p>{{ t('mediadc', 'MediaDC application can be configured only by Administrator.') }}</p>
			<p>{{ t('mediadc', 'Please, contact your cloud Administrator.') }}</p>
		</div>
		<div v-else>
			<button v-if="installed" @click="finishConfiguration">
				{{ t('mediadc', 'Go to MediaDC') }}
			</button>
		</div>
		<div v-if="isAdmin" class="install-details">
			<div v-if="available_algorithms && installed"
				class="available_algorithms"
				style="margin: 20px 0 10px;">
				{{ t('mediadc', 'Available algorithms: ') }} {{ available_algorithms.join(', ') }}
			</div>
			<div v-if="installed && video_required.length > 0">
				<strong>{{ t('mediadc', 'Video processing won\'t work, video_required packages not installed.') }}</strong>
				<p>{{ t('mediadc', 'Not installed video_required packages:') }} {{ video_required }}</p>
				<p>{{ t('mediadc', 'video_required packages can\'t be installed automatically, this should be done by administrator manually and then recheck installation on this page.') }}</p>
			</div>
			<div v-if="installed_list && Object.keys(installed_list).length > 0" class="dependencies-table">
				<table>
					<div v-show="updating" class="action-blackout">
						<span class="icon-loading" />
					</div>
					<caption>{{ t('mediadc', 'Python dependecies list') }}</caption>
					<thead>
						<tr>
							<th><b>{{ t('mediadc', 'Type') }}</b></th>
							<th><b>{{ t('mediadc', 'Packages') }}</b></th>
							<th><b>{{ t('mediadc', 'Installed') }}</b></th>
							<th><b>{{ t('mediadc', 'Actions') }}</b></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="listName in Object.keys(installed_list).sort((first, second) => first > second)" :key="listName">
							<td>{{ listName }}</td>
							<td>
								<span v-for="(packageName, index) in Object.keys(installed_list[listName])" :key="packageName" class="package">
									<span class="package-title">
										{{ installed_list[listName][packageName].package }}{{ (index !== Object.keys(installed_list[listName]).length - 1) ? ', ' : '' }}
									</span>
									<div class="package-tooltip">
										<span v-if="installed_list[listName][packageName].version !== 'none'"
											class="tooltip-content">
											{{ installed_list[listName][packageName].location }}:
											{{ installed_list[listName][packageName].version }}
										</span>
										<span v-else class="tooltip-content">
											{{ t('mediadc', 'Not installed') }}
										</span>
									</div>
								</span>
							</td>
							<td>{{ not_installed_list[listName].length === 0 }}</td>
							<td>
								<button :disabled="Object.keys(not_installed_list[listName]).length === 0"
									@click="installDepsList(listName)">
									{{ t('mediadc', 'Install') }}
								</button>
								<button :disabled="Object.keys(not_installed_list[listName]).length > 0"
									@click="updateDepsList(listName)">
									{{ t('mediadc', 'Update') }}
								</button>
								<button :disabled="Object.keys(not_installed_list[listName]).length > 0"
									@click="deleteDepsList(listName)">
									{{ t('mediadc', 'Delete') }}
								</button>
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
import Configure from '../mixins/Configure'
import CheckboxRadioSwitch from '@nextcloud/vue/dist/Components/CheckboxRadioSwitch'

export default {
	name: 'Configuration',
	components: { CheckboxRadioSwitch },
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
}
</script>

<style scoped>
.mediadc-configuration {
	padding: 20px;
	text-align: center;
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

.package {
	position: relative;
}

.package-tooltip {
	display: none;
	padding: 0 5px;
	border-radius: 5px;
	background-color: #000;
	color: #fff;
	position: absolute;
	top: calc(-100% - 5px);
	left: 50%;
	transform: translateX(-50%);
	font-size: 12px;
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}

.package-tooltip:before {
	content: '';
	position: absolute;
	left: 50%;
	transform: translateX(-50%) rotateZ(45deg);
	bottom: -3px;
	width: 10px;
	height: 10px;
	background-color: #000;
	z-index: -1;
}

.package:hover .package-tooltip {
	display: block;
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
	border-radius: 10px;
}

.install-errors {
	max-height: 50vh;
	overflow-y: scroll;
	border: 1px solid #ff3333;
	border-radius: 5px;
	padding: 0 10px 10px;
	margin: 10px auto;
}

.errors-list-item {
	border-bottom: 1px solid #ffcccc;
	padding: 5px;
	text-align-last: left;
}

.install-warnings {
	max-height: 50vh;
	overflow-y: scroll;
	border: 1px solid #ffc629;
	border-radius: 5px;
	padding: 0 10px 10px;
	margin: 10px auto;
}

.warnings-list-item {
	border-bottom: 1px solid #f7ffcc;
	padding: 5px;
	text-align-last: left;
}
</style>
