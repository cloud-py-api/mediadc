"""
Provides definitions for functions to work with databases.
"""

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
    """Return list of all tasks(each task is a dict)."""
    raise NotImplementedError("get_tasks")


def clear_task_files_scanned_groups(task_id: int) -> int:
    """Prepare task for re-run, cleat count of scanned files."""
    raise NotImplementedError(f"clear_task_files_scanned_groups:task_id={task_id}")


def increase_processed_files_count(task_id: int, count: int) -> None:
    """Increases number of processed files in task."""
    raise NotImplementedError(f"increase_processed_files_count:task_id={task_id},count={count}")


def lock_task(task_id: int, old_updated_time: int) -> bool:
    """Returns True if task was locked(set py_pid to id of current process, updated_time = current time)."""
    raise NotImplementedError(f"lock_task:task_id={task_id},old_updated_time={old_updated_time}")


def unlock_task(task_id: int) -> None:
    """Set `py_pid` to zero for specified task."""
    raise NotImplementedError(f"unlock_task:task_id={task_id}")


def finalize_task(task_id: int) -> None:
    """Set `finished_time` to zero for specified task."""
    raise NotImplementedError(f"finalize_task:task_id={task_id}")


def append_task_error(task_id: int, errors: str, connection_id: int = 0) -> None:
    """Append to `errors` text field a string with error, throw connection with `connection_id`."""
    raise NotImplementedError(f"append_task_error:task_id={task_id},errors={errors},connection_id={connection_id}")


def set_task_keepalive(task_id: int, connection_id: int = 1) -> None:
    """Update `updated_time` field to current time, throw connection with `connection_id`."""
    raise NotImplementedError(f"set_task_keepalive:task_id={task_id},connection_id={connection_id}")


def get_paths_by_ids(file_ids: list) -> list:
    """For each element of list in file_ids return [path, fileid, storage]. Order of file_ids is not preserved."""
    raise NotImplementedError(f"get_paths_by_ids:file_ids={file_ids}")


def get_directory_data_image(dir_id: int, dir_mimetype: int, img_mimetype: int, spike_fileid: list) -> list:
    """For dir_id returns list of records with mimetype specified by dir_mimetype or img_mimetype.
        Record(dict) contains: fileid,path,storage,mimetype,size,mtime,encrypted,hash,skipped."""
    raise NotImplementedError(f"get_directory_data_video:dir_id={dir_id},dir_mimetype={dir_mimetype},"
                              f"img_mimetype={img_mimetype},spike_fileid={spike_fileid}")


def get_directory_data_video(dir_id: int, dir_mimetype: int, video_mimetype: int, spike_fileid: list) -> list:
    """For dir_id returns list of records with mimetype specified by dir_mimetype or video_mimetype.
        Record(dict) contains: fileid,path,storage,mimetype,size,mtime,encrypted,duration,timestamps,hash,skipped."""
    raise NotImplementedError(f"get_directory_data_video:dir_id={dir_id},dir_mimetype={dir_mimetype},"
                              f"video_mimetype={video_mimetype},spike_fileid={spike_fileid}")


def get_mimetype_id(mimetype: str) -> int:
    """For string mimetype returns it number representation."""
    raise NotImplementedError(f"get_mimetype_id:mimetype={mimetype}")


def get_storage_info(num_id: int = None) -> list:
    """If num_id is None, return info for all storages.
        Returns list of dicts with: numeric_id,id,available,mount_point,user_id,storage_backend fields."""
    raise NotImplementedError(f"get_all_storage_info:num_id={num_id}")


def store_image_hash(fileid: int, image_hash: str, mtime: int) -> None:
    """Sets for fileid `mtime`,`hash`. `skipped` sets to zero."""
    raise NotImplementedError(f"store_image_hash:fileid={fileid},image_hash={image_hash},mtime={mtime}")


def store_err_image_hash(fileid: int, mtime: int, skipped_count: int) -> None:
    """Sets for fileid `mtime`,`skipped`. For `hash` set const value:`0x00`."""
    raise NotImplementedError(f"store_err_image_hash:fileid={fileid},mtime={mtime},skipped_count={skipped_count}")


def store_video_hash(fileid: int, duration: int, timestamps: str, video_hash: str, mtime: int) -> None:
    """Sets for fileid `duration`,`timestamps`,`mtime`,`hash`. `skipped` sets to zero."""
    raise NotImplementedError(f"store_video_hash:fileid={fileid},duration={duration},"
                              f"timestamps={timestamps},video_hash={video_hash},mtime={mtime}")


def store_err_video_hash(fileid: int, duration: int, mtime: int, skipped_count: int) -> None:
    """Sets for fileid `duration`,`mtime`,`skipped`. For `timestamps` and `hash` set const values:`[0],0x00`."""
    raise NotImplementedError(f"store_err_video_hash:fileid={fileid},duration={duration},"
                              f"mtime={mtime},skipped_count={skipped_count}")


def store_task_files_group(task_id: int, group_files_ids: str) -> None:
    """Add to table `task_details` one record with similar files."""
    raise NotImplementedError(f"store_task_files_group:task_id={task_id},group_files_ids={group_files_ids}")


def get_remote_filesize_limit() -> int:
    """Return `remote_filesize_limit` value from settings table."""
    raise NotImplementedError("get_remote_filesize_limit")
