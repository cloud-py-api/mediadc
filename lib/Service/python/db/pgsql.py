import os
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


def get_tasks() -> list:
    query = f"SELECT id, target_directory_ids, exclude_list, collector_settings, files_scanned, " \
            f"updated_time , finished_time, errors, py_pid " \
            f"FROM {get_task_table_name()};"
    return execute_fetchall(query)


def clear_task_files_scanned_groups(task_id: int) -> int:
    query = f"UPDATE {get_task_table_name()} SET files_scanned = 0 WHERE id = {task_id};"
    execute_commit(query)
    query = f"DELETE FROM {get_task_details_table_name()} " \
            f"WHERE task_id = {task_id};"
    return execute_commit(query)


def increase_processed_files_count(task_id: int, count: int) -> None:
    query = f"UPDATE {get_task_table_name()} SET files_scanned = files_scanned + {count} WHERE id = {task_id};"
    execute_commit(query)


def lock_task(task_id: int, old_updated_time: int) -> bool:
    query = f"UPDATE {get_task_table_name()} " \
            f"SET py_pid = {os.getpid()}, finished_time = 0, updated_time = {get_time()}, errors = '' " \
            f"WHERE id = {task_id} AND updated_time = {old_updated_time};"
    if execute_commit(query) > 0:
        return True
    return False


def unlock_task(task_id: int) -> None:
    query = f"UPDATE {get_task_table_name()} SET py_pid = 0 WHERE id = {task_id};"
    execute_commit(query)


def finalize_task(task_id: int) -> None:
    query = f"UPDATE {get_task_table_name()} SET finished_time = {get_time()}" \
            f" WHERE id = {task_id};"
    execute_commit(query)


def append_task_error(task_id: int, errors: str, connection_id: int = 0) -> None:
    query = f"UPDATE {get_task_table_name()} SET errors = errors || %s || '\n' WHERE id = {task_id};"
    execute_commit(query, args=(errors,), connection_id=connection_id)


def set_task_keepalive(task_id: int, connection_id: int = 1) -> None:
    query = f"UPDATE {get_task_table_name()} SET updated_time = {get_time()} WHERE id = {task_id};"
    execute_commit(query, connection_id=connection_id)


def get_paths_by_ids(file_ids: list) -> list:
    query = f"SELECT path, fileid " \
            f"FROM {get_fs_table_name()} " \
            f"WHERE fileid IN ({','.join(str(x) for x in file_ids)}) " \
            f"ORDER BY fileid ASC;"
    return execute_fetchall(query)


def get_directory_data_image(dir_id: int, dir_mimetype: int, img_mimetype: int) -> list:
    query = f"SELECT fcache.fileid, fcache.path, fcache.storage, fcache.mimetype, fcache.size, fcache.mtime, " \
            f"fcache.encrypted, " \
            f"imgcache.hash, imgcache.skipped " \
            f"FROM {get_fs_table_name()} AS fcache " \
            f"LEFT JOIN {get_image_table_name()} AS imgcache " \
            f"ON fcache.fileid = imgcache.fileid AND fcache.mtime = imgcache.mtime " \
            f"WHERE fcache.parent = {dir_id} " \
            f"AND (fcache.mimetype = {dir_mimetype} OR fcache.mimepart = {img_mimetype});"
    return execute_fetchall(query)


def get_directory_data_video(dir_id: int, dir_mimetype: int, video_mimetype: int) -> list:
    query = f"SELECT fcache.fileid, fcache.path, fcache.storage, fcache.mimetype, fcache.size, fcache.mtime, " \
            f"fcache.encrypted, " \
            f"vcache.duration, vcache.timestamps, vcache.hash, vcache.skipped " \
            f"FROM {get_fs_table_name()} AS fcache " \
            f"LEFT JOIN {get_video_table_name()} AS vcache " \
            f"ON fcache.fileid = vcache.fileid AND fcache.mtime = vcache.mtime " \
            f"WHERE fcache.parent = {dir_id} " \
            f"AND (fcache.mimetype = {dir_mimetype} OR fcache.mimepart = {video_mimetype});"
    return execute_fetchall(query)


def get_mimetype_id(mimetype: str) -> int:
    query = f"SELECT id " \
            f"FROM {get_mimetypes_table_name()} " \
            f"WHERE mimetype = {mimetype};"
    r = execute_fetchall(query)
    if not r:
        return 0
    return r[0]['id']


def get_all_storage_info(num_id: int = None) -> list:
    if execute_fetchall(f"SELECT * FROM pg_catalog.pg_tables WHERE tablename LIKE '{get_ext_mounts_table_name()}';"):
        query = f"SELECT storage.numeric_id, storage.id, storage.available, " \
                f"mounts.mount_point, mounts.user_id, ext_mounts.storage_backend " \
                f"FROM {get_storage_table_name()} AS storage " \
                f"LEFT JOIN {get_mounts_table_name()}  AS mounts " \
                f"ON storage.numeric_id = mounts.storage_id " \
                f"LEFT JOIN {get_ext_mounts_table_name()} AS ext_mounts " \
                f"ON mounts.id = ext_mounts.mount_id"
        if num_id is None:
            query += ";"
        else:
            query += f" WHERE storage.numeric_id = {num_id};"
    else:
        query = f"SELECT storage.numeric_id, storage.id, storage.available, " \
                f"mounts.mount_point, mounts.user_id " \
                f"FROM {get_storage_table_name()} AS storage " \
                f"LEFT JOIN {get_mounts_table_name()}  AS mounts " \
                f"ON storage.numeric_id = mounts.storage_id"
        if num_id is None:
            query += ";"
        else:
            query += f" WHERE storage.numeric_id = {num_id};"
    return execute_fetchall(query)


def store_image_hash(fileid: int, image_hash: str, mtime: int) -> None:
    query = f"INSERT INTO {get_image_table_name()} (fileid,hash,mtime,skipped) " \
            f"VALUES({fileid},'\\x{image_hash}',{mtime},0) " \
            f"ON CONFLICT (fileid) DO UPDATE " \
            f"SET hash = EXCLUDED.hash, " \
            f"mtime = EXCLUDED.mtime, " \
            f"skipped = EXCLUDED.skipped;"
    execute_commit(query)


def store_err_image_hash(fileid: int, mtime: int, skipped_count: int) -> None:
    query = f"INSERT INTO {get_image_table_name()} (fileid,hash,mtime,skipped) " \
            f"VALUES({fileid},'\\x00',{mtime},{skipped_count}) " \
            f"ON CONFLICT (fileid) DO UPDATE " \
            f"SET hash = EXCLUDED.hash, " \
            f"mtime = EXCLUDED.mtime, " \
            f"skipped = EXCLUDED.skipped;"
    execute_commit(query)


def store_video_hash(fileid: int, duration: int, timestamps: str, video_hash: str, mtime: int) -> None:
    query = f"INSERT INTO {get_video_table_name()} (fileid,duration,timestamps,hash,mtime,skipped) " \
            f"VALUES({fileid},{duration},'{timestamps}'," \
            f"'\\x{video_hash}',{mtime},0) " \
            f"ON CONFLICT (fileid) DO UPDATE " \
            f"SET hash = EXCLUDED.hash, " \
            f"duration = EXCLUDED.duration, " \
            f"timestamps = EXCLUDED.timestamps, " \
            f"mtime = EXCLUDED.mtime, " \
            f"skipped = EXCLUDED.skipped;"
    execute_commit(query)


def store_err_video_hash(fileid: int, duration: int, mtime: int, skipped_count: int) -> None:
    query = f"INSERT INTO {get_video_table_name()} (fileid,duration,timestamps,hash,mtime,skipped) " \
            f"VALUES({fileid},{duration},'[0]'," \
            f"'\\x00',{mtime},{skipped_count}) " \
            f"ON CONFLICT (fileid) DO UPDATE " \
            f"SET hash = EXCLUDED.hash, " \
            f"duration = EXCLUDED.duration, " \
            f"timestamps = EXCLUDED.timestamps, " \
            f"mtime = EXCLUDED.mtime, " \
            f"skipped = EXCLUDED.skipped;"
    execute_commit(query)


def store_task_files_group(task_id: int, group_files_ids: str) -> None:
    query = f"INSERT INTO {get_task_details_table_name()} (task_id,group_files_ids) " \
            f"VALUES({task_id},'{group_files_ids}');"
    execute_commit(query)


def get_remote_filesize_limit() -> int:
    query = f"SELECT value " \
            f"FROM {get_settings_table_name()} " \
            f"WHERE name='remote_filesize_limit';"
    r = execute_fetchall(query)
    if not r:
        return 0
    return r[0]['value']
