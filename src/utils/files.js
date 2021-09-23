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

import { generateRemoteUrl } from '@nextcloud/router'
import { getCurrentUser } from '@nextcloud/auth'
import axios from '@nextcloud/axios'

const davRequest = `<?xml version="1.0"?>
	<d:propfind xmlns:d="DAV:" xmlns:oc="http://owncloud.org/ns"
				xmlns:nc="http://nextcloud.org/ns"
				xmlns:ocs="http://open-collaboration-services.org/ns">
		<d:prop>
			<oc:fileid />
			<d:getcontenttype />
		</d:prop>
	</d:propfind>`

const getFileId = (xml) => {
	if (window.DOMParser) {
		const parser = new DOMParser()
		const xmlDoc = parser.parseFromString(xml, 'text/xml')
		const fileid = xmlDoc.getElementsByTagName('oc:fileid')[0].innerHTML
		return fileid
	} else {
		return -1
	}
}

const getContentType = (xml) => {
	if (window.DOMParser) {
		const parser = new DOMParser()
		const xmlDoc = parser.parseFromString(xml, 'text/xml')
		const contentType = xmlDoc.getElementsByTagName('d:getcontenttype')[0].innerHTML
		return contentType
	} else {
		return null
	}
}

const requestFileInfo = async (path) => {
	const davPath = `${generateRemoteUrl('dav')}/files/${getCurrentUser().uid}${path}`
	return await axios({
		method: 'PROPFIND',
		url: davPath,
		data: davRequest,
		headers: { details: true, depth: 0 },
	})
}

const formatBytes = (bytes, decimals = 2) => {
	if (bytes === 0) return '0 B'
	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export {
	requestFileInfo,
	getFileId,
	getContentType,
	formatBytes,
}
