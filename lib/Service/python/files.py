"""
Helper functions related to get files content or storages info.
"""

import db


# @copyright Copyright (c) 2021 Andrey Borysenko <andrey18106x@gmail.com>
#
# @copyright Copyright (c) 2021 Alexander Piskun <bigcat88@icloud.com>
#
# @author 2021 Alexander Piskun <bigcat88@icloud.com>
#
# @license AGPL-3.0-or-later
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.


StoragesInfo = []


def get_file_data(file_info: dict, data_dir: str, remote_filesize_limit: int) -> bytes:
    direct = can_directly_access_file(file_info)
    while direct:
        full_path = get_file_full_path(data_dir, file_info['storage'], file_info['path'])
        if not full_path:
            break
        try:
            with open(full_path, "rb") as h_file:
                data = h_file.read()
                return data
        except Exception as exception_info:
            print(f"Exception during reading: {full_path}\n {str(exception_info)}")
            break
    if file_info['size'] > remote_filesize_limit:
        return b''
    return request_file_from_php(file_info)


def request_file_from_php(file_info: dict) -> bytes:
    user_id = get_storage_user_id(file_info['storage'])
    if not user_id:
        return bytes(b'')
    success, err_or_data = db.occ_call('mediadc:tasks:filecontents', str(file_info['fileid']), user_id, decode=False)
    if not success:
        print('get_file_data:', err_or_data)
        return bytes(b'')
    return err_or_data


def get_file_full_path(data_dir: str, storage_id: int, relative_path: str) -> str:
    mount_point = get_storage_mount_point(storage_id)
    if not mount_point:
        return ''
    return data_dir.encode('utf-8') + mount_point + relative_path.encode('utf-8')


def can_directly_access_file(file_info: dict) -> bool:
    if file_info['encrypted'] == 1:
        return False
    storage_info = get_storage_info(file_info['storage'])
    if not storage_info:
        return False
    if storage_info['available'] == 0:
        return False
    if storage_info.get('storage_backend') is None:
        storage_txt_id = storage_info['id']
        supported_start_list = ('local::', 'home::')
        if storage_txt_id.startswith(supported_start_list):
            return True
    return False


def update_storages_info():
    global StoragesInfo
    StoragesInfo = db.get_all_storage_info()


def get_storage_info(storage_id: int):
    for storage_info in StoragesInfo:
        if storage_info['numeric_id'] == storage_id:
            return storage_info
    return {}


def get_storage_mount_point(storage_id: int) -> str:
    for storage_info in StoragesInfo:
        if storage_info['numeric_id'] == storage_id:
            return storage_info['mount_point'].encode('utf-8')
    return ''


def get_storage_user_id(storage_id: int) -> str:
    for storage_info in StoragesInfo:
        if storage_info['numeric_id'] == storage_id:
            return storage_info['user_id'].encode('utf-8')
    return ''
