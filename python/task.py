import math
import threading
from enum import Enum
from time import perf_counter, sleep

from nc_py_api import (
    CONFIG,
    FsNodeInfo,
    close_connection,
    fs_apply_exclude_lists,
    fs_apply_ignore_flags,
    fs_extract_sub_dirs,
    fs_filter_by,
    fs_list_directory,
    fs_nodes_info,
    get_mimetype_id,
    get_time,
    mimetype,
    occ_call_decode,
)

from .db_requests import (
    append_task_error,
    clear_task_files_scanned_groups,
    finalize_task,
    increase_processed_files_count,
    lock_task,
    set_task_keepalive,
    unlock_task,
)
from .images import process_images, reset_images, save_image_results
from .log import logger as log
from .videos import process_videos, reset_videos, save_video_results

TASK_KEEP_ALIVE = 8


class TaskType(Enum):
    """Possible task types."""

    IMAGE = 0
    VIDEO = 1
    IMAGE_VIDEO = 2


def init_task_settings(task_info: dict) -> dict:
    """Prepares task for execution, returns a dictionary to pass to process_(image/video)_task functions."""

    if task_info["files_scanned"] > 0:
        clear_task_files_scanned_groups(task_info["id"])
    task_settings = {"id": task_info["id"], "data_dir": CONFIG["datadir"]}
    excl_all = task_info["exclude_list"]
    task_settings["exclude_mask"] = list(dict.fromkeys(excl_all["user"]["mask"] + excl_all["admin"]["mask"]))
    task_settings["exclude_fileid"] = list(dict.fromkeys(excl_all["user"]["fileid"] + excl_all["admin"]["fileid"]))
    task_settings["mime_dir"] = get_mimetype_id("httpd/unix-directory")
    task_settings["mime_image"] = get_mimetype_id("image")
    task_settings["mime_video"] = get_mimetype_id("video")
    collector_settings = task_info["collector_settings"]
    task_settings["hash_size"] = collector_settings["hash_size"]
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
    log.debug("Image hamming distance: %u", task_settings["precision_img"])
    log.debug("Video hamming distance between 4 frames: %u", task_settings["precision_vid"])
    log.debug("Hashing algo: %s", task_settings["hash_algo"])
    task_settings["type"] = collector_settings["target_mtype"]
    task_settings["target_dirs"] = task_info["target_directory_ids"]
    task_settings["target_dirs"] = sorted(list(map(int, task_settings["target_dirs"])))
    return task_settings


def reset_data_groups():
    """Reset any results from previous tasks if they present."""

    reset_images()
    reset_videos()


def analyze_and_lock(task_info: dict) -> bool:
    """Checks if can/need we to work on this task. Returns True if task was locked and must be processed."""

    sleep(1)
    if task_info["py_pid"] != 0:
        if get_time() > task_info["updated_time"] + int(TASK_KEEP_ALIVE) * 3:
            log.info("Task was in hanged state.")
        else:
            log.info("Task is already running.")
            return False
    if task_info["errors"]:
        log.info("Task was previously finished with errors.")
    else:
        if task_info["finished_time"] == 0 and task_info["files_scanned"] == 0:
            log.debug("Processing new task.")
    if not lock_task(task_info["id"], task_info["updated_time"]):
        log.warning("Cant lock task.")
        return False
    log.debug("Task locked.")
    return True


def updated_time_background_thread(task_id: int, exit_event):
    """Every {TASK_KEEP_ALIVE} seconds set `updated_time` of task to current time."""

    try:
        while True:
            exit_event.wait(timeout=float(TASK_KEEP_ALIVE))
            if exit_event.is_set():
                break
            log.debug("BT:Updating keepalive.")
            set_task_keepalive(task_id, connection_id=1)
    except Exception as exception_info:  # noqa # pylint: disable=broad-except
        log.exception("BT: exception:")
        append_task_error(
            task_id, f"BT:Exception({type(exception_info).__name__}): `{str(exception_info)}`", connection_id=1
        )
    log.debug("BT:Closing DB connection.")
    close_connection(1)
    log.debug("BT:Exiting.")


def start_background_thread(task_info: dict):
    """Starts background daemon update thread for value `updated_time` of specified task."""

    log.debug("Starting background thread.")
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


def process_task(task_info) -> None:
    """Top Level function. Checks if we can work on task, and if so - start to process it. Called from `main`."""

    log.debug("Processing task: id=%u", task_info["id"])
    if not analyze_and_lock(task_info):
        return
    _task_status = "error"
    try:
        reset_data_groups()
        task_settings = init_task_settings(task_info)
        start_background_thread(task_info)
        time_start = perf_counter()
        if TaskType(task_settings["type"]) == TaskType.IMAGE:
            process_image_task(task_settings)
        elif TaskType(task_settings["type"]) == TaskType.VIDEO:
            process_video_task(task_settings, 0)
        elif TaskType(task_settings["type"]) == TaskType.IMAGE_VIDEO:
            group_offset = process_image_task(task_settings)
            process_video_task(task_settings, group_offset)
        _task_status = "finished"
        log.info("Task execution_time: %d seconds", perf_counter() - time_start)
        finalize_task(task_info["id"])
    except Exception as exception_info:  # noqa # pylint: disable=broad-except
        log.exception("Exception during task execution.")
        append_task_error(task_info["id"], f"Exception({type(exception_info).__name__}): `{str(exception_info)}`")
    finally:
        if "b_thread" in task_info:
            task_info["exit_event"].set()
            task_info["b_thread"].join(timeout=2.0)
        unlock_task(task_info["id"])
        log.debug("Task unlocked.")
        if task_info.get("collector_settings", {}).get("finish_notification", False):
            occ_call_decode("mediadc:collector:tasks:notify", str(task_info["id"]), _task_status)


def process_image_task(task_settings: dict) -> int:
    """Top Level function to process image task. As input param expects dict from `init_task_settings` function."""

    fs_objs = fs_nodes_info(task_settings["target_dirs"])
    fs_apply_exclude_lists(fs_objs, task_settings["exclude_fileid"], task_settings["exclude_mask"])
    process_image_task_dirs(fs_objs, task_settings)
    return save_image_results(task_settings["id"])


def process_image_task_dirs(directories: list[FsNodeInfo], task_settings: dict):
    """Calls `process_directory_images` for each dir in `directories_ids`. Recursively does that for each sub dir."""

    for directory in directories:
        process_image_task_dirs(process_directory_images(directory, task_settings), task_settings)


def process_directory_images(directory: FsNodeInfo, task_settings: dict) -> list[FsNodeInfo]:
    """Process all files in `dir_id` with mimetype==mime_image and return list of sub dirs for this `dir_id`."""

    fs_objs = fs_list_directory(directory["id"])
    fs_apply_ignore_flags(fs_objs)
    fs_apply_exclude_lists(fs_objs, task_settings["exclude_fileid"], task_settings["exclude_mask"])
    sub_dirs = fs_extract_sub_dirs(fs_objs)
    fs_filter_by(fs_objs, "mimepart", [mimetype.IMAGE])
    process_images(task_settings, fs_objs)
    if fs_objs:
        increase_processed_files_count(task_settings["id"], len(fs_objs))
    return sub_dirs


def process_video_task(task_settings: dict, group_offset: int):
    """Top Level function to process video task. As input param expects dict from `init_task_settings` function."""

    fs_objs = fs_nodes_info(task_settings["target_dirs"])
    fs_apply_exclude_lists(fs_objs, task_settings["exclude_fileid"], task_settings["exclude_mask"])
    process_video_task_dirs(fs_objs, task_settings)
    save_video_results(task_settings["id"], group_offset)


def process_video_task_dirs(directories: list[FsNodeInfo], task_settings: dict):
    """Calls `process_directory_videos` for each dir in `directories_ids`. Recursively does that for each sub dir."""

    for directory in directories:
        process_video_task_dirs(process_directory_videos(directory, task_settings), task_settings)


def process_directory_videos(directory: FsNodeInfo, task_settings: dict) -> list[FsNodeInfo]:
    """Process all files in `dir_id` with mimetype==mime_video and return list of sub dirs for this `dir_id`."""

    fs_objs = fs_list_directory(directory["id"])
    fs_apply_ignore_flags(fs_objs)
    fs_apply_exclude_lists(fs_objs, task_settings["exclude_fileid"], task_settings["exclude_mask"])
    sub_dirs = fs_extract_sub_dirs(fs_objs)
    fs_filter_by(fs_objs, "mimepart", [mimetype.VIDEO])
    process_videos(task_settings, fs_objs)
    if fs_objs:
        increase_processed_files_count(task_settings["id"], len(fs_objs))
    return sub_dirs
