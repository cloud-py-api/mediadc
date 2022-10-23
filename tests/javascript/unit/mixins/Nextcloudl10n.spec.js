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

import MockComponent from '../stubs/MockComponent.vue'
import { shallowMount } from '@vue/test-utils'
import Nextcloudl10n from '../../../../src/mixins/Nextcludl10n'

jest.mock('@nextcloud/l10n', () => ({
	translate: jest.fn((app, msg) => msg),
	translatePlural: jest.fn((app, msgS, msgN, len) => {
		if (len === 0)
			return msgN

		if (len === 1)
			return msgS

		if (len > 1 && len <= 10)
			return msgN

		return msgS
	}),
	getLanguage: () => 'en',
	getLocale: () => 'en',
}))

describe('mixins/Nextcloudl10n test', () => {

	const wrapper = shallowMount(MockComponent, {
		mixins: [Nextcloudl10n]
	})

	it('should provide translate methods', () => {
		expect(wrapper.vm).toHaveProperty('t')
		expect(wrapper.vm).toHaveProperty('n')
	})

	it('should perform translate', () => {
		expect(wrapper.vm.t('mediadc', 'Test text')).toBe('Test text')
	})

	it.each([
		[0, 'Test texts'],
		[1, 'Test text'],
		[2, 'Test texts'],
		[3, 'Test texts'],
		[4, 'Test texts'],
		[5, 'Test texts'],
		[6, 'Test texts'],
		[7, 'Test texts'],
		[8, 'Test texts'],
		[9, 'Test texts'],
		[10, 'Test texts'],
	])('should perform translatePlural', (len, expected) => {
		expect(wrapper.vm.n('mediadc', 'Test text', 'Test texts', len)).toBe(expected)
	})

})