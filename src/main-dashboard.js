/**
 * @copyright Copyright (c) 2021 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @copyright Copyright (c) 2021 Alexander Piskun <bigcat88@icloud.com>
 *
 * @author Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { generateFilePath } from '@nextcloud/router'
import { getRequestToken } from '@nextcloud/auth'
import Nextcloudl10n from './mixins/Nextcludl10n'

import Vue from 'vue'
import Dashboard from './views/Dashboard'

// eslint-disable-next-line
__webpack_nonce__ = btoa(getRequestToken())
// eslint-disable-next-line
__webpack_public_path__ = generateFilePath('mediadc', '', 'js/')

Vue.mixin(Nextcloudl10n)

document.addEventListener('DOMContentLoaded', () => {
	const register = OCA?.Dashboard?.register || (() => {})

	register('mediadc-tasks', (el) => {
		const View = Vue.extend(Dashboard)
		new View().$mount(el)
	})
})
