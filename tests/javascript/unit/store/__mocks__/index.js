/**
 * @copyright Copyright (c) 2022 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @copyright Copyright (c) 2022 Alexander Piskun <bigcat88@icloud.com>
 *
 * @author 2022 Andrey Borysenko <andrey18106x@gmail.com>
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

import Vue from 'vue';
import Vuex from 'vuex';

import settings from './settings'
import tasks from './tasks'
import details from './details'
import resolved from './resolved'

Vue.use(Vuex)

export function __createMocks(custom = { getters: {}, mutations: {}, actions: {}, state: {} }) {
	const mockGetters = Object.assign({}, getters, custom.getters)
	const mockMutations = Object.assign({}, mutations, custom.mutations)
	const mockActions = Object.assign({}, actions, custom.actions)
	const mockState = Object.assign({}, state, custom.state)

	return {
		getters: mockGetters,
		mutations: mockMutations,
		actions: mockActions,
		state: mockState,
		store: new Vuex.Store({
			modules: {
				settings,
				tasks,
				details,
				resolved,
			},
			getters: mockGetters,
			mutations: mockMutations,
			actions: mockActions,
			state: mockState,
		}),
	}
}

export const store = __createMocks().store
