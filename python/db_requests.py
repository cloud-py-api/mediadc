import os
from json import loads

from nc_py_api import CONFIG, TABLES, execute_commit, execute_fetchall, get_time

from .db_tables import MDC_TABLES


def get_tasks() -> list:
    """Return list of all tasks(each task is a dict)."""

    _where = ""
    if CONFIG["dbtype"] == "mysql":
        _where = " WHERE 1"
    query = (
        "SELECT id, target_directory_ids, exclude_list, collector_settings, files_scanned, "
        "updated_time , finished_time, errors, py_pid "
        f"FROM {MDC_TABLES.tasks}{_where};"
    )
    tasks_list = execute_fetchall(query)
    if CONFIG["dbtype"] == "mysql":
        for task in tasks_list:
            if isinstance(task["exclude_list"], str):
                task["exclude_list"] = loads(task["exclude_list"])
            if isinstance(task["collector_settings"], str):
                task["collector_settings"] = loads(task["collector_settings"])
            if isinstance(task["target_directory_ids"], str):
                task["target_directory_ids"] = loads(task["target_directory_ids"])
    return tasks_list


def lock_task(task_id: int, old_updated_time: int) -> bool:
    """Returns True if task was locked(set py_pid to id of current process, updated_time = current time)."""

    query = (
        f"UPDATE {MDC_TABLES.tasks} "
        f"SET py_pid = {os.getpid()}, finished_time = 0, updated_time = {get_time()}, errors = '' "
        f"WHERE id = {task_id} AND updated_time = {old_updated_time};"
    )
    if execute_commit(query) > 0:
        return True
    return False


def unlock_task(task_id: int) -> None:
    """Set `py_pid` to zero for specified task."""

    query = f"UPDATE {MDC_TABLES.tasks} SET py_pid = 0 WHERE id = {task_id};"
    execute_commit(query)


def finalize_task(task_id: int) -> None:
    """Set `finished_time` to zero for specified task."""

    query = f"UPDATE {MDC_TABLES.tasks} SET finished_time = {get_time()} WHERE id = {task_id};"
    execute_commit(query)


def clear_task_files_scanned_groups(task_id: int) -> int:
    """Prepare task for re-run, cleat count of scanned files."""

    query = f"UPDATE {MDC_TABLES.tasks} SET files_scanned = 0 WHERE id = {task_id};"
    execute_commit(query)
    query = f"DELETE FROM {MDC_TABLES.tasks_details} WHERE task_id = {task_id};"
    return execute_commit(query)


def increase_processed_files_count(task_id: int, count: int) -> None:
    """Increases number of processed files in task."""

    query = f"UPDATE {MDC_TABLES.tasks} SET files_scanned = files_scanned + {count} WHERE id = {task_id};"
    execute_commit(query)


def append_task_error(task_id: int, errors: str, connection_id: int = 0) -> None:
    """Append to `errors` text field a string with error, throw connection with `connection_id`."""

    if CONFIG["dbtype"] == "mysql":
        query = f"UPDATE {MDC_TABLES.tasks} SET errors = CONCAT(errors, %s, '\n') WHERE id = {task_id};"
        execute_commit(query, args=errors, connection_id=connection_id)
    else:
        query = f"UPDATE {MDC_TABLES.tasks} SET errors = errors || %s || '\n' WHERE id = {task_id};"
        execute_commit(query, args=(errors,), connection_id=connection_id)


def set_task_keepalive(task_id: int, connection_id: int = 1) -> None:
    """Update `updated_time` field to current time, throw connection with `connection_id`."""

    query = f"UPDATE {MDC_TABLES.tasks} SET updated_time = {get_time()} WHERE id = {task_id};"
    execute_commit(query, connection_id=connection_id)


def get_images_caches(file_ids: list[int]) -> list:
    query = (
        "SELECT fcache.fileid, imgcache.hash, imgcache.skipped "
        f"FROM {TABLES.file_cache} AS fcache "
        f"LEFT JOIN {MDC_TABLES.photos} AS imgcache "
        "ON fcache.fileid = imgcache.fileid AND fcache.mtime = imgcache.mtime "
        f"WHERE fcache.fileid IN({','.join(str(x) for x in file_ids)}) "
        "ORDER BY fileid ASC;"
    )
    return execute_fetchall(query)


def get_videos_caches(file_ids: list[int]) -> list:
    query = (
        "SELECT fcache.fileid, vcache.duration, vcache.timestamps, vcache.hash, vcache.skipped "
        f"FROM {TABLES.file_cache} AS fcache "
        f"LEFT JOIN {MDC_TABLES.videos} AS vcache "
        "ON fcache.fileid = vcache.fileid AND fcache.mtime = vcache.mtime "
        f"WHERE fcache.fileid IN({','.join(str(x) for x in file_ids)}) "
        "ORDER BY fileid ASC;"
    )
    result = execute_fetchall(query)
    if CONFIG["dbtype"] == "mysql":
        for each_record in result:
            if isinstance(each_record["timestamps"], str):
                each_record["timestamps"] = loads(each_record["timestamps"])
    return result


def store_task_files_group(task_id: int, group_id: int, file_id: int) -> None:
    """Add to table `task_details` one record with similar files."""

    query = f"INSERT INTO {MDC_TABLES.tasks_details} (task_id,group_id,fileid) VALUES({task_id},{group_id},{file_id});"
    execute_commit(query)


def store_image_hash(fileid: int, image_hash: str, mtime: int) -> None:
    """Sets for fileid `mtime`,`hash`. `skipped` sets to zero."""
    if CONFIG["dbtype"] == "mysql":
        query = (
            f"REPLACE INTO {MDC_TABLES.photos} (fileid,hash,mtime,skipped) VALUES({fileid},0x{image_hash},{mtime},0);"
        )
    else:
        query = (
            f"INSERT INTO {MDC_TABLES.photos} (fileid,hash,mtime,skipped) "
            f"VALUES({fileid},'\\x{image_hash}',{mtime},0) "
            "ON CONFLICT (fileid) DO UPDATE "
            "SET hash = EXCLUDED.hash, "
            "mtime = EXCLUDED.mtime, "
            "skipped = EXCLUDED.skipped;"
        )
    execute_commit(query)


def store_err_image_hash(fileid: int, mtime: int, skipped_count: int) -> None:
    """Sets for fileid `mtime`,`skipped`. For `hash` set const value:`0x00`."""

    if CONFIG["dbtype"] == "mysql":
        query = (
            f"REPLACE INTO {MDC_TABLES.photos} (fileid,hash,mtime,skipped) "
            f"VALUES({fileid},0x00,{mtime},{skipped_count});"
        )
    else:
        query = (
            f"INSERT INTO {MDC_TABLES.photos} (fileid,hash,mtime,skipped) "
            f"VALUES({fileid},'\\x00',{mtime},{skipped_count}) "
            "ON CONFLICT (fileid) DO UPDATE "
            "SET hash = EXCLUDED.hash, "
            "mtime = EXCLUDED.mtime, "
            "skipped = EXCLUDED.skipped;"
        )
    execute_commit(query)


def store_video_hash(fileid: int, duration: int, timestamps: str, video_hash: str, mtime: int) -> None:
    """Sets for fileid `duration`,`timestamps`,`mtime`,`hash`. `skipped` sets to zero."""
    if CONFIG["dbtype"] == "mysql":
        query = (
            f"REPLACE INTO {MDC_TABLES.videos} (fileid,duration,timestamps,hash,mtime,skipped) "
            f"VALUES({fileid},{duration},'{timestamps}',"
            f"0x{video_hash},{mtime},0);"
        )
    else:
        query = (
            f"INSERT INTO {MDC_TABLES.videos} (fileid,duration,timestamps,hash,mtime,skipped) "
            f"VALUES({fileid},{duration},'{timestamps}',"
            f"'\\x{video_hash}',{mtime},0) "
            "ON CONFLICT (fileid) DO UPDATE "
            "SET hash = EXCLUDED.hash, "
            "duration = EXCLUDED.duration, "
            "timestamps = EXCLUDED.timestamps, "
            "mtime = EXCLUDED.mtime, "
            "skipped = EXCLUDED.skipped;"
        )
    execute_commit(query)


def store_err_video_hash(fileid: int, duration: int, mtime: int, skipped_count: int) -> None:
    """Sets for fileid `duration`,`mtime`,`skipped`. For `timestamps` and `hash` set const values:`[0],0x00`."""

    if CONFIG["dbtype"] == "mysql":
        query = (
            f"REPLACE INTO {MDC_TABLES.videos} (fileid,duration,timestamps,hash,mtime,skipped) "
            f"VALUES({fileid},{duration},'[0]',"
            f"0x00,{mtime},{skipped_count});"
        )
    else:
        query = (
            f"INSERT INTO {MDC_TABLES.videos} (fileid,duration,timestamps,hash,mtime,skipped) "
            f"VALUES({fileid},{duration},'[0]',"
            f"'\\x00',{mtime},{skipped_count}) "
            "ON CONFLICT (fileid) DO UPDATE "
            "SET hash = EXCLUDED.hash, "
            "duration = EXCLUDED.duration, "
            "timestamps = EXCLUDED.timestamps, "
            "mtime = EXCLUDED.mtime, "
            "skipped = EXCLUDED.skipped;"
        )
    execute_commit(query)
