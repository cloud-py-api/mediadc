"""
Tasks process logic module.
"""

import fnmatch
import math
import os
import threading
import time
from enum import Enum
from pathlib import Path

import db
from dc_images import (
    dc_images_init,
    dc_process_images,
    reset_images,
    save_image_results,
)
from dc_videos import (
    dc_process_videos,
    dc_videos_init,
    reset_videos,
    save_video_results,
)
from files import get_mounts_to, update_storages_info
from install import get_installed_algorithms_list

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


TASK_KEEP_ALIVE = 8


class TaskType(Enum):
    """Possible task types."""

    IMAGE = 0
    VIDEO = 1
    IMAGE_VIDEO = 2


def init_task_settings(task_info: dict) -> dict:
    """Prepares task for execution, returns a dictionary to pass to process_(image/video)_task functions."""
    if task_info["files_scanned"] > 0:
        db.clear_task_files_scanned_groups(task_info["id"])
    task_settings = {"id": task_info["id"], "data_dir": db.Config["datadir"]}
    excl_all = task_info["exclude_list"]
    task_settings["exclude_mask"] = list(dict.fromkeys(excl_all["user"]["mask"] + excl_all["admin"]["mask"]))
    task_settings["exclude_fileid"] = list(dict.fromkeys(excl_all["user"]["fileid"] + excl_all["admin"]["fileid"]))
    task_settings["mime_dir"] = db.get_mimetype_id("'httpd/unix-directory'")
    task_settings["mime_image"] = db.get_mimetype_id("'image'")
    task_settings["mime_video"] = db.get_mimetype_id("'video'")
    collector_settings = task_info["collector_settings"]
    task_settings["hash_size"] = collector_settings["hash_size"]
    if not collector_settings["hashing_algorithm"] in get_installed_algorithms_list():
        db.append_task_error(task_settings["id"], f"`{collector_settings['hashing_algorithm']}` is not available.")
        return {}
    task_settings["hash_algo"] = collector_settings["hashing_algorithm"]
    if collector_settings["similarity_threshold"] == 100:
        task_settings["precision_img"] = int(task_settings["hash_size"] / 8)
    else:
        number_of_bits = task_settings["hash_size"] ** 2
        if task_settings["hash_size"] <= 8:
            task_settings["precision_img"] = number_of_bits - int(
                math.ceil(number_of_bits / 100.0 * collector_settings["similarity_threshold"])
            )
            if task_settings["precision_img"] == 0:
                task_settings["precision_img"] = 1
        else:
            task_settings["precision_img"] = number_of_bits - int(
                math.floor(number_of_bits / 100.0 * collector_settings["similarity_threshold"])
            )
    task_settings["precision_vid"] = task_settings["precision_img"] * 4
    print("Image hamming distance: ", task_settings["precision_img"])
    print("Video hamming distance between 4 frames: ", task_settings["precision_vid"])
    print("Hashing algo:", task_settings["hash_algo"])
    task_settings["type"] = collector_settings["target_mtype"]
    task_settings["target_dirs"] = task_info["target_directory_ids"]
    task_settings["target_dirs"] = sorted(list(map(int, task_settings["target_dirs"])))
    task_settings["remote_filesize_limit"] = db.get_remote_filesize_limit()
    return task_settings


def reset_data_groups():
    """Reset any results from previous tasks if they present."""
    reset_images()
    reset_videos()


def analyze_and_lock(task_info: dict, forced: bool) -> bool:
    """Checks if can/need we to work on this task. Returns True if task was locked and must be processed."""
    time.sleep(1)
    if task_info["py_pid"] != 0:
        if db.get_time() > task_info["updated_time"] + int(TASK_KEEP_ALIVE) * 3:
            print("Task was hanging.")
        else:
            print("Task already running.")
            return False
    elif not forced:
        if task_info["errors"]:
            print("Task was previously finished with errors.")
        else:
            if task_info["finished_time"] == 0:
                if task_info["files_scanned"] > 0:
                    print("Task was interrupted.")
                else:
                    print("Processing new task.")
            else:
                print("Task was previously finished successfully.")
                return False
    if not db.lock_task(task_info["id"], task_info["updated_time"]):
        print("Cant lock task.")
        return False
    print("Task locked.")
    return True


def updated_time_background_thread(task_id: int, exit_event):
    """Every {TASK_KEEP_ALIVE} seconds set `updated_time` of task to current time."""
    try:
        while True:
            exit_event.wait(timeout=float(TASK_KEEP_ALIVE))
            if exit_event.is_set():
                break
            print("BT:Updating keepalive.")
            db.set_task_keepalive(task_id, connection_id=1)
    except Exception as exception_info:
        print(f"BT:Exception({type(exception_info).__name__}): `{str(exception_info)}`")
        db.append_task_error(
            task_id, f"BT:Exception({type(exception_info).__name__}): `{str(exception_info)}`", connection_id=1
        )
    print("BT:Close DB connection.")
    db.close_connection(1)
    print("BT:Exiting.")


def start_background_thread(task_info: dict):
    """Starts background daemon update thread for value `updated_time` of specified task."""
    print("Starting background thread.")
    task_info["exit_event"] = threading.Event()
    task_info["b_thread"] = threading.Thread(
        target=updated_time_background_thread,
        daemon=True,
        args=(
            task_info["id"],
            task_info["exit_event"],
        ),
    )
    task_info["b_thread"].start()


def process(task_info: dict, forced: bool):
    """Top Level function. Checks if we can work on task, and if so - start to process it. Called from `main`."""
    print(f"Processing task: id={task_info['id']}, forced={forced}")
    if not analyze_and_lock(task_info, forced):
        return
    _taskStatus = "error"
    try:
        reset_data_groups()
        update_storages_info()
        task_settings = init_task_settings(task_info)
        if task_settings:
            module_init_done = True
            task_type = TaskType(task_settings["type"])
            if task_type in (TaskType.IMAGE, TaskType.VIDEO, TaskType.IMAGE_VIDEO):
                module_init_done &= dc_images_init(task_settings["id"])
            if task_type in (TaskType.VIDEO, TaskType.IMAGE_VIDEO) and module_init_done:
                module_init_done &= dc_videos_init(task_settings["id"])
            if module_init_done:
                start_background_thread(task_info)
                time_start = time.perf_counter()
                if task_type == TaskType.IMAGE:
                    process_image_task(task_settings)
                elif task_type == TaskType.VIDEO:
                    process_video_task(task_settings)
                elif task_type == TaskType.IMAGE_VIDEO:
                    process_image_task(task_settings)
                    process_video_task(task_settings)
                _taskStatus = "finished"
                print(f"Task execution_time: {time.perf_counter() - time_start}")
                db.finalize_task(task_info["id"])
    except Exception as exception_info:
        print(f"Exception({type(exception_info).__name__}): `{str(exception_info)}`")
        db.append_task_error(task_info["id"], f"Exception({type(exception_info).__name__}): `{str(exception_info)}`")
    finally:
        if "b_thread" in task_info:
            task_info["exit_event"].set()
            task_info["b_thread"].join(timeout=2.0)
        print("Task unlocked.")
        db.unlock_task(task_info["id"])
        if task_info.get("collector_settings", {}).get("finish_notification", False):
            db.occ_call("mediadc:collector:tasks:notify", str(task_info["id"]), _taskStatus)


def process_image_task(task_settings: dict):
    """Top Level function to process image task. As input param expects dict from `init_task_settings` function."""
    directories_ids = task_settings["target_dirs"]
    apply_exclude_list(db.get_paths_by_ids(directories_ids), task_settings, directories_ids)
    process_image_task_dirs(directories_ids, task_settings)
    save_image_results(task_settings["id"])


def process_image_task_dirs(directories_ids: list, task_settings: dict):
    """Calls `process_directory_images` for each dir in `directories_ids`. Recursively does that for each sub dir."""
    for dir_id in directories_ids:
        process_image_task_dirs(process_directory_images(dir_id, task_settings), task_settings)


def process_video_task(task_settings: dict):
    """Top Level function to process video task. As input param expects dict from `init_task_settings` function."""
    directories_ids = task_settings["target_dirs"]
    apply_exclude_list(db.get_paths_by_ids(directories_ids), task_settings, directories_ids)
    process_video_task_dirs(directories_ids, task_settings)
    save_video_results(task_settings["id"])


def process_video_task_dirs(directories_ids: list, task_settings: dict):
    """Calls `process_directory_videos` for each dir in `directories_ids`. Recursively does that for each sub dir."""
    for dir_id in directories_ids:
        process_video_task_dirs(process_directory_videos(dir_id, task_settings), task_settings)


def process_directory_images(dir_id: int, task_settings: dict) -> list:
    """Process all files in `dir_id` with mimetype==mime_image and return list of sub dirs for this `dir_id`."""
    dir_info = db.get_paths_by_ids([dir_id])
    file_mounts = []
    if dir_info:
        file_mounts = get_mounts_to(dir_info[0]["storage"], dir_info[0]["path"])
    fs_records = db.get_directory_data_image(
        dir_id, task_settings["mime_dir"], task_settings["mime_image"], file_mounts
    )
    if get_ignore_flag(fs_records):
        fs_records.clear()
    if not fs_records:
        return []
    apply_exclude_list(fs_records, task_settings)
    sub_dirs = extract_sub_dirs(fs_records, task_settings["mime_dir"])
    dc_process_images(task_settings, fs_records)
    if fs_records:
        db.increase_processed_files_count(task_settings["id"], len(fs_records))
    return sub_dirs


def process_directory_videos(dir_id: int, task_settings: dict) -> list:
    """Process all files in `dir_id` with mimetype==mime_video and return list of sub dirs for this `dir_id`."""
    dir_info = db.get_paths_by_ids([dir_id])
    file_mounts = []
    if dir_info:
        file_mounts = get_mounts_to(dir_info[0]["storage"], dir_info[0]["path"])
    fs_records = db.get_directory_data_video(
        dir_id, task_settings["mime_dir"], task_settings["mime_video"], file_mounts
    )
    if get_ignore_flag(fs_records):
        fs_records.clear()
    if not fs_records:
        return []
    apply_exclude_list(fs_records, task_settings)
    sub_dirs = extract_sub_dirs(fs_records, task_settings["mime_dir"])
    dc_process_videos(task_settings, fs_records)
    if fs_records:
        db.increase_processed_files_count(task_settings["id"], len(fs_records))
    return sub_dirs


def apply_exclude_list(fs_records: list, task_settings: dict, where_to_purge=None) -> list:
    """Purge all records according to exclude_(mask/fileid) from `where_to_purge`(or from fs_records)."""
    indexes_to_purge = []
    for index, fs_record in enumerate(fs_records):
        if fs_record["fileid"] in task_settings["exclude_fileid"]:
            indexes_to_purge.append(index)
        elif is_path_in_exclude(fs_record["path"], task_settings["exclude_mask"]):
            indexes_to_purge.append(index)
    if where_to_purge is None:
        for index in reversed(indexes_to_purge):
            del fs_records[index]
    else:
        for index in reversed(indexes_to_purge):
            del where_to_purge[index]
    return indexes_to_purge


def extract_sub_dirs(fs_records: list, mime_dir: int) -> list:
    """Remove all records from `fs_records` that has `mimetype`=='mime_dir' and return them."""
    sub_dirs = []
    indexes_to_purge = []
    for index, fs_record in enumerate(fs_records):
        if fs_record["mimetype"] == mime_dir:
            sub_dirs.append(fs_record["fileid"])
            indexes_to_purge.append(index)
    for index in reversed(indexes_to_purge):
        del fs_records[index]
    return sub_dirs


def is_path_in_exclude(path: str, exclude_patterns: list) -> bool:
    """Checks with fnmatch if `path` is in `exclude_patterns`. Returns true if yes."""
    name = os.path.basename(path)
    for pattern in exclude_patterns:
        if fnmatch.fnmatch(name, pattern):
            return True
    return False


def get_ignore_flag(fs_records: list) -> bool:
    for fs_record in fs_records:
        if Path(fs_record["path"]).name in (".noimage", ".nomedia"):
            return True
    return False
