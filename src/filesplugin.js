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

import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'

// eslint-disable-next-line
function getSettings() {
	return axios.get(generateUrl('/apps/mediadc/api/v1/settings')).then(res => {
		return res.data
	})
}

// eslint-disable-next-line
function settingByName(settings, name) {
	return settings.find(s => s.name === name)
}

// eslint-disable-next-line
function createNewTaskFromFolder(folderId) {
	return getSettings().then((settings) => {
		const data = {
			targetDirectoryIds: JSON.stringify([folderId]),
			excludeList: {
				user: { mask: [], fileid: [] },
				admin: JSON.parse(settingByName(settings, 'exclude_list').value) || { mask: [], fileid: [] },
			},
			collectorSettings: {
				hashing_algorithm: JSON.parse(settingByName(settings, 'hashing_algorithm').value) || 'dhash',
				similarity_threshold: settingByName(settings, 'similarity_threshold').value,
				hash_size: settingByName(settings, 'hash_size').value || 16,
				target_mtype: 2,
				finish_notification: true,
			},
		}
		return axios.post(generateUrl('/apps/mediadc/api/v1/tasks/run'), data)
	})
}

OCA.Files.fileActions.registerAction({
	name: 'mediadcScan',
	displayName: t('mediadc', 'Scan for duplicates'),
	mime: 'dir',
	permissions: OC.PERMISSION_READ,
	order: 80,
	iconClass: 'icon-mediadc',
	actionHandler: (name, context) => {
		createNewTaskFromFolder(context.fileInfoModel.attributes.id).then((res) => {
			OC.dialogs.info(t('mediadc', 'New task for folder scan successfully created'), 'MediaDC')
		})
	},
})
