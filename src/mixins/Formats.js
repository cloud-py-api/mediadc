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

import { formatBytes } from '../utils/files'
import moment from 'moment'

const keepAliveInterval = 8
const targetMType = [
	t('mediadc', 'Photos'),
	t('mediadc', 'Videos'),
	t('mediadc', 'Photos&Videos'),
]

export default {
	methods: {
		formatBytes,
		parseUnixTimestamp(time) {
			return moment.unix(Number(time)).format('YYYY-MM-DD HH:mm:ss')
		},
		getStatusBadge(task) {
			if (task === null || task === undefined) {
				return ''
			}
			if (task.errors !== '') {
				return 'error'
			} else {
				if (Number(task.py_pid) === 0 && Number(task.finished_time) === 0
					&& Number(task.updated_time) > 0 && Number(task.files_scanned) > 0) {
					return 'terminated'
				}
				if (Number(task.py_pid) > 0) {
					if (moment().unix() > Number(task.updated_time) + keepAliveInterval * 3) {
						return 'error'
					} else {
						return 'running'
					}
				}
				if (Number(task.finished_time) > 0 && Number(task.py_pid) === 0) {
					return 'finished'
				}
				return 'pending'
			}
		},
		parseTargetMtype(task) {
			if (task) {
				try {
					return targetMType[Number(JSON.parse(task.collector_settings).target_mtype)]
				} catch {
					return ''
				}
			}
			return ''
		},
	},
}
