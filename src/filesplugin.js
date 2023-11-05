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
import { FileAction, registerFileAction, FileType } from '@nextcloud/files'

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
function createNewTaskFromFolder(folderId, folderName = null) {
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
				exif_transpose: !settingByName(settings, 'ignore_orientation').value || true,
			},
			name: folderName,
		}
		return axios.post(generateUrl('/apps/mediadc/api/v1/tasks/run'), data)
	})
}

// eslint-disable-next-line
function getStaticAppSvgInlineIcon() {
	return '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="512" height="512" enable-background="new 0 0 512 512" version="1.1" viewBox="0 0 300 300" style="filter: var(--background-invert-if-dark);" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><metadata><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/><dc:title/></cc:Work></rdf:RDF></metadata><g transform="matrix(1.31 0 0 1.31 -46.502 -46.502)"><g fill="#000"><path class="" d="m131.52 78.484c0.781 0.781 1.805 1.172 2.828 1.172s2.047-0.391 2.828-1.172l2.828-2.828 2.828 2.828c0.781 0.781 1.805 1.172 2.828 1.172s2.047-0.391 2.828-1.172c1.562-1.562 1.562-4.094 0-5.656l-2.828-2.828 2.828-2.828c1.562-1.562 1.562-4.094 0-5.656s-4.094-1.562-5.656 0l-2.828 2.828-2.828-2.828c-1.562-1.562-4.094-1.562-5.656 0s-1.562 4.094 0 5.656l2.828 2.828-2.828 2.828c-1.563 1.563-1.563 4.094 0 5.656z" data-original="#000000"/><circle class="" cx="184" cy="86" r="4" data-original="#000000"/><circle class="" cx="172" cy="42" r="4" data-original="#000000"/><path class="" d="m240 102h-114.35l-7.783-16.145c-0.105-0.219-0.23-0.426-0.373-0.621-3.422-4.688-8.971-7.484-14.842-7.484h-44.568c-9.975 0-18.088 7.973-18.088 17.773v135.86c0 9.446 7.22 17.184 16.508 18.378 1.722 7.147 8.026 12.244 15.492 12.244h160c7.824 0 14.427-5.573 15.756-13.264 7.137-2.674 12.244-9.417 12.244-17.357v-109.38c0-11.027-8.973-20-20-20zm12 129.38c0 5.855-4.914 10.621-10.955 10.621h-140.28c-2.209 0-4 1.789-4 4s1.791 4 4 4h138.18c-1.388 2.421-3.991 4-6.938 4h-160c-2.948 0-5.55-1.579-6.938-4h15.04c2.209 0 4-1.789 4-4s-1.791-4-4-4h-21.147c-6.041 0-10.955-4.766-10.955-10.621v-135.86c0-5.391 4.525-9.773 10.088-9.773h44.568c3.213 0 6.246 1.465 8.18 3.938l5.936 12.312h-20.772c-2.209 0-4 1.789-4 4s1.791 4 4 4h144c6.617 0 12 5.383 12 12z" data-original="#000000"/><path class="" d="m224 138h-64c-2.209 0-4 1.789-4 4v68c0 2.211 1.791 4 4 4h64c2.209 0 4-1.789 4-4v-68c0-2.211-1.791-4-4-4zm-4 68h-56v-60h56z" data-original="#000000"/><path class="" d="m173.98 197.45c0.623 0.363 1.322 0.547 2.02 0.547 0.676 0 1.352-0.172 1.961-0.516l32-18c1.26-0.707 2.039-2.039 2.039-3.484s-0.779-2.777-2.039-3.484l-32-18c-1.238-0.703-2.754-0.688-3.98 0.031s-1.981 2.031-1.981 3.453v36c0 1.422 0.754 2.734 1.98 3.453zm6.02-32.613 19.842 11.16-19.842 11.16z" data-original="#000000"/><path class="" d="m140 138h-64c-2.209 0-4 1.789-4 4v68c0 2.211 1.791 4 4 4h64c2.209 0 4-1.789 4-4v-68c0-2.211-1.791-4-4-4zm-4 8v13.996l-18.529 21.285-18.732-7.027c-1.422-0.535-3.027-0.211-4.141 0.828l-14.598 13.685v-42.767zm0 26.179v21.821h-49.885l12.141-11.383 19.006 7.129c1.555 0.586 3.322 0.137 4.422-1.121zm-56 33.821v-4h56v4z" data-original="#000000"/><path class="" d="m94 170c5.514 0 10-4.484 10-10s-4.486-10-10-10-10 4.484-10 10 4.486 10 10 10zm0-12c1.104 0 2 0.898 2 2s-0.896 2-2 2-2-0.898-2-2 0.896-2 2-2z" data-original="#000000"/></g></g></svg>\n'
}

window.addEventListener('DOMContentLoaded', () => {
	if (OCA.Files && OCA.Files.fileActions) {
		OCA.Files.fileActions.registerAction({
			name: 'mediadcScan',
			displayName: t('mediadc', 'Scan for duplicates'),
			mime: 'dir',
			permissions: OC.PERMISSION_READ,
			order: 80,
			iconClass: 'icon-mediadc',
			actionHandler: (name, context) => {
				createNewTaskFromFolder(context.fileInfoModel.attributes.id, context.fileInfoModel.attributes.path + context.fileInfoModel.attributes.name).then((res) => {
					OC.dialogs.info(t('mediadc', 'New task for folder scan successfully created'), 'MediaDC')
				})
			},
		})
		return
	} else {
		// Try to register with new API
		const action = new FileAction({
			id: 'mediadc-scan',
			displayName: () => t('mediadc', 'Scan for duplicates'),
			iconSvgInline: () => getStaticAppSvgInlineIcon(),
			order: 80,
			enabled(nodes) {
				if (nodes.length !== 1) {
					return false
				}

				return (nodes[0].type === FileType.Folder)
			},
			async exec(node) {
				createNewTaskFromFolder(node.fileid, node.dirname + node.basename).then((res) => {
					OC.dialogs.info(t('mediadc', 'New task for folder scan successfully created'), 'MediaDC')
				})
				return null
			},
		})
		registerFileAction(action)
	}
	console.error('Failed to register fileAction')
})
