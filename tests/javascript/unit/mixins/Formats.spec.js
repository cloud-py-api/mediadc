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
import Formats from '../../../../src/mixins/Formats'

const task = {
	id: 124,
	type: "manual",
	owner: "admin",
	target_directory_ids: "[\"958\"]","exclude_list":"{\"user\": {\"mask\": [], \"fileid\": [977, 9225]}, \"admin\": {\"mask\": [\"__MACOSX\"], \"fileid\": []}}",
	collector_settings: "{\"hash_size\": 8, \"target_mtype\": 1, \"hashing_algorithm\": \"dhash\", \"finish_notification\": true, \"similarity_threshold\": 95}",
	files_scanned: 8,
	files_total: 8,
	files_total_size: 31704288,
	deleted_files_count: 0,
	deleted_files_size: 0,
	created_time: 1664706674,
	finished_time: 1664706687,
	updated_time: 1664706687,
	py_pid: 0,
	errors: ""
}

describe('mixins/Formats test', () => {

	const wrapper = shallowMount(MockComponent, {
		mixins: [Formats]
	})

	it('should return formatted bytes', () => {
		expect(wrapper.vm.formatBytes(task.deleted_files_size)).toBe('0 B')
	})

	it('should return formatted time', () => {
		expect(wrapper.vm.parseUnixTimestamp(task.created_time)).toBe('2022-10-02 13:31:14')
	})

	it('should return task status', () => {
		expect(wrapper.vm.getStatusBadge(task)).toBe('finished')
	})

	it('should return target mime type', () => {
		expect(wrapper.vm.parseTargetMtype(task)).toBe('Videos')
	})
})
