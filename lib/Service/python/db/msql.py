"""
Provides functions to work with MySQL/MariaDB databases.
"""

import os
import json
from . import execute_fetchall, execute_commit
from .manager import (
    get_task_table_name,
    get_task_details_table_name,
    get_image_table_name,
    get_video_table_name,
    get_settings_table_name,
    get_storage_table_name,
    get_mounts_table_name,
    get_ext_mounts_table_name,
    get_fs_table_name,
    get_mimetypes_table_name,
    get_time,
)


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


def get_tasks() -> list:
    """Look for description in `empty_impl.py` file."""
    query = f"SELECT id, target_directory_ids, exclude_list, collector_settings, files_scanned, " \
            f"updated_time , finished_time, errors, py_pid " \
            f"FROM {get_task_table_name()} " \
            f"WHERE 1;"
    tasks_list = execute_fetchall(query)
    for task in tasks_list:
        if isinstance(task['exclude_list'], str):
            task['exclude_list'] = json.loads(task['exclude_list'])
        if isinstance(task['collector_settings'], str):
            task['collector_settings'] = json.loads(task['collector_settings'])
        if isinstance(task['target_directory_ids'], str):
            task['target_directory_ids'] = json.loads(task['target_directory_ids'])
    return tasks_list


def clear_task_files_scanned_groups(task_id: int) -> int:
    """Look for description in `empty_impl.py` file."""
    query = f"UPDATE {get_task_table_name()} SET files_scanned = 0 WHERE id = {task_id};"
    execute_commit(query)
    query = f"DELETE FROM {get_task_details_table_name()} " \
            f"WHERE task_id = {task_id};"
    return execute_commit(query)


def increase_processed_files_count(task_id: int, count: int) -> None:
    """Look for description in `empty_impl.py` file."""
    query = f"UPDATE {get_task_table_name()} SET files_scanned = files_scanned + {count} WHERE id = {task_id};"
    execute_commit(query)


def lock_task(task_id: int, old_updated_time: int) -> bool:
    """Look for description in `empty_impl.py` file."""
    query = f"UPDATE {get_task_table_name()} " \
            f"SET py_pid = {os.getpid()}, finished_time = 0, updated_time = {get_time()}, errors = '' " \
            f"WHERE id = {task_id} AND updated_time = {old_updated_time};"
    if execute_commit(query) > 0:
        return True
    return False


def unlock_task(task_id: int) -> None:
    """Look for description in `empty_impl.py` file."""
    query = f"UPDATE {get_task_table_name()} SET py_pid = 0 WHERE id = {task_id};"
    execute_commit(query)


def finalize_task(task_id: int) -> None:
    """Look for description in `empty_impl.py` file."""
    query = f"UPDATE {get_task_table_name()} SET finished_time = {get_time()}" \
            f" WHERE id = {task_id};"
    execute_commit(query)


def append_task_error(task_id: int, errors: str, connection_id: int = 0) -> None:
    """Look for description in `empty_impl.py` file."""
    query = f"UPDATE {get_task_table_name()} SET errors = CONCAT(errors, %s, '\n') WHERE id = {task_id};"
    execute_commit(query, args=errors, connection_id=connection_id)


def set_task_keepalive(task_id: int, connection_id: int = 1) -> None:
    """Look for description in `empty_impl.py` file."""
    query = f"UPDATE {get_task_table_name()} SET updated_time = {get_time()} WHERE id = {task_id};"
    execute_commit(query, connection_id=connection_id)


def get_paths_by_ids(file_ids: list) -> list:
    """Look for description in `empty_impl.py` file."""
    query = f"SELECT path, fileid, storage " \
            f"FROM {get_fs_table_name()} " \
            f"WHERE fileid IN ({','.join(str(x) for x in file_ids)}) " \
            f"ORDER BY fileid ASC;"
    return execute_fetchall(query)


def get_directory_data_image(dir_id: int, dir_mimetype: int, img_mimetype: int, spike_fileid: list) -> list:
    """Look for description in `empty_impl.py` file."""
    mp_query = ''
    if spike_fileid:
        mp_query = f" OR fcache.fileid IN ({','.join(str(x) for x in spike_fileid)})"
    query = f"SELECT fcache.fileid, fcache.path, fcache.storage, fcache.mimetype, fcache.size, fcache.mtime, " \
            f"fcache.encrypted, " \
            f"imgcache.hash, imgcache.skipped " \
            f"FROM {get_fs_table_name()} AS fcache " \
            f"LEFT JOIN {get_image_table_name()} AS imgcache " \
            f"ON fcache.fileid = imgcache.fileid AND fcache.mtime = imgcache.mtime " \
            f"WHERE (fcache.parent = {dir_id}{mp_query}) " \
            f"AND (fcache.mimetype = {dir_mimetype}" \
            f" OR fcache.mimepart = {img_mimetype}" \
            f" OR fcache.name IN ('.nomedia', '.noimage'));"
    return execute_fetchall(query)


def get_directory_data_video(dir_id: int, dir_mimetype: int, video_mimetype: int, spike_fileid: list) -> list:
    """Look for description in `empty_impl.py` file."""
    mp_query = ''
    if spike_fileid:
        mp_query = f" OR fcache.fileid IN ({','.join(str(x) for x in spike_fileid)})"
    query = f"SELECT fcache.fileid, fcache.path, fcache.storage, fcache.mimetype, fcache.size, fcache.mtime, " \
            f"fcache.encrypted, " \
            f"vcache.duration, vcache.timestamps, vcache.hash, vcache.skipped " \
            f"FROM {get_fs_table_name()} AS fcache " \
            f"LEFT JOIN {get_video_table_name()} AS vcache " \
            f"ON fcache.fileid = vcache.fileid AND fcache.mtime = vcache.mtime " \
            f"WHERE (fcache.parent = {dir_id}{mp_query}) " \
            f"AND (fcache.mimetype = {dir_mimetype}" \
            f" OR fcache.mimepart = {video_mimetype}" \
            f" OR fcache.name IN ('.nomedia', '.noimage'));"
    dirs_list = execute_fetchall(query)
    for each_dir in dirs_list:
        if isinstance(each_dir['timestamps'], str):
            each_dir['timestamps'] = json.loads(each_dir['timestamps'])
    return dirs_list


def get_mimetype_id(mimetype: str) -> int:
    """Look for description in `empty_impl.py` file."""
    query = f"SELECT id " \
            f"FROM {get_mimetypes_table_name()} " \
            f"WHERE mimetype = {mimetype};"
    result = execute_fetchall(query)
    if not result:
        return 0
    return result[0]['id']


def get_storage_info(num_id: int = None) -> list:
    """Look for description in `empty_impl.py` file."""
    if execute_fetchall(f"SHOW TABLES LIKE \"{get_ext_mounts_table_name()}\";"):
        query = f"SELECT storage.numeric_id, storage.id, storage.available, " \
                f"mounts.mount_point, mounts.user_id, mounts.root_id, ext_mounts.storage_backend " \
                f"FROM {get_storage_table_name()} AS storage " \
                f"LEFT JOIN {get_mounts_table_name()}  AS mounts " \
                f"ON storage.numeric_id = mounts.storage_id " \
                f"LEFT JOIN {get_ext_mounts_table_name()} AS ext_mounts " \
                f"ON mounts.mount_id = ext_mounts.mount_id "
        if num_id is None:
            query += "WHERE 1;"
        else:
            query += f"WHERE storage.numeric_id = {num_id};"
    else:
        query = f"SELECT storage.numeric_id, storage.id, storage.available, " \
                f"mounts.mount_point, mounts.user_id, mounts.root_id " \
                f"FROM {get_storage_table_name()} AS storage " \
                f"LEFT JOIN {get_mounts_table_name()}  AS mounts " \
                f"ON storage.numeric_id = mounts.storage_id "
        if num_id is None:
            query += "WHERE 1;"
        else:
            query += f"WHERE storage.numeric_id = {num_id};"
    return execute_fetchall(query)


def store_image_hash(fileid: int, image_hash: str, mtime: int) -> None:
    """Look for description in `empty_impl.py` file."""
    query = f"REPLACE INTO {get_image_table_name()} (fileid,hash,mtime,skipped) " \
            f"VALUES({fileid},0x{image_hash},{mtime},0);"
    execute_commit(query)


def store_err_image_hash(fileid: int, mtime: int, skipped_count: int) -> None:
    """Look for description in `empty_impl.py` file."""
    query = f"REPLACE INTO {get_image_table_name()} (fileid,hash,mtime,skipped) " \
            f"VALUES({fileid},0x00,{mtime},{skipped_count});"
    execute_commit(query)


def store_video_hash(fileid: int, duration: int, timestamps: str, video_hash: str, mtime: int) -> None:
    """Look for description in `empty_impl.py` file."""
    query = f"REPLACE INTO {get_video_table_name()} (fileid,duration,timestamps,hash,mtime,skipped) " \
            f"VALUES({fileid},{duration},'{timestamps}'," \
            f"0x{video_hash},{mtime},0);"
    execute_commit(query)


def store_err_video_hash(fileid: int, duration: int, mtime: int, skipped_count: int) -> None:
    """Look for description in `empty_impl.py` file."""
    query = f"REPLACE INTO {get_video_table_name()} (fileid,duration,timestamps,hash,mtime,skipped) " \
            f"VALUES({fileid},{duration},'[0]'," \
            f"0x00,{mtime},{skipped_count});"
    execute_commit(query)


def store_task_files_group(task_id: int, group_id: int, file_id: int) -> None:
    """Look for description in `empty_impl.py` file."""
    query = f"INSERT INTO {get_task_details_table_name()} (task_id,group_id,fileid) " \
            f"VALUES({task_id},{group_id},{file_id});"
    execute_commit(query)


def get_remote_filesize_limit() -> int:
    """Look for description in `empty_impl.py` file."""
    query = f"SELECT value " \
            f"FROM {get_settings_table_name()} " \
            f"WHERE name='remote_filesize_limit';"
    result = execute_fetchall(query)
    if not result:
        return 0
    if isinstance(result[0]['value'], str):
        return json.loads(result[0]['value'])
    return result[0]['value']
