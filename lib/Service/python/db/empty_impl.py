"""
/**
 * @copyright Copyright (c) 2021 Andrey Borysenko <andrey18106x@gmail.com>
 *
 * @copyright Copyright (c) 2021 Alexander Piskun <bigcat88@icloud.com>
 *
 * @author 2021 Alexander Piskun <bigcat88@icloud.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
"""


def get_tasks() -> list:
    raise NotImplementedError('get_tasks')


def clear_task_files_scanned_groups(task_id: int) -> int:
    raise NotImplementedError('clear_task_files_scanned_groups')


def increase_processed_files_count(task_id: int, count: int) -> None:
    raise NotImplementedError('increase_processed_files_count')


def lock_task(task_id: int, old_updated_time: int) -> bool:
    raise NotImplementedError('lock_task')


def unlock_task(task_id: int) -> None:
    raise NotImplementedError('unlock_task')


def finalize_task(task_id: int) -> None:
    raise NotImplementedError('finalize_task')


def append_task_error(task_id: int, errors: str, connection_id: int = 0) -> None:
    raise NotImplementedError('append_task_error')


def set_task_keepalive(task_id: int, connection_id: int = 1) -> None:
    raise NotImplementedError('set_task_keepalive')


def get_paths_by_ids(file_ids: list) -> list:
    raise NotImplementedError('get_paths_by_ids')


def get_directory_data_image(dir_id: int, dir_mimetype: int, img_mimetype: int) -> list:
    raise NotImplementedError('get_directory_data_image')


def get_directory_data_video(dir_id: int, dir_mimetype: int, video_mimetype: int) -> list:
    raise NotImplementedError('get_directory_data_video')


def get_mimetype_id(mimetype: str) -> int:
    raise NotImplementedError('get_mimetype_id')


def get_all_storage_info(num_id: int = None) -> list:
    raise NotImplementedError('get_all_storage_info')


def store_image_hash(fileid: int, image_hash: str, mtime: int) -> None:
    raise NotImplementedError('store_image_hash')


def store_err_image_hash(fileid: int, mtime: int, skipped_count: int) -> None:
    raise NotImplementedError('store_err_image_hash')


def store_video_hash(fileid: int, duration: int, timestamps: str, video_hash: str, mtime: int) -> None:
    raise NotImplementedError('store_video_hash')


def store_err_video_hash(fileid: int, duration: int, mtime: int, skipped_count: int) -> None:
    raise NotImplementedError('store_err_video_hash')


def store_task_files_group(task_id: int, group_files_ids: str) -> None:
    raise NotImplementedError('store_task_files_group')


def get_remote_filesize_limit() -> int:
    raise NotImplementedError('get_remote_filesize_limit')
