import math
import threading
from enum import Enum
import db
from files import update_storages_info, is_path_in_exclude
from dc_images import dc_images_init, dc_process_images, reset_images, save_image_results
from dc_videos import dc_videos_init, dc_process_videos, reset_videos, save_video_results
from install import get_installed_algorithms_list
import time


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


TaskKeepaliveInterval = 8


class TaskType(Enum):
    Image = 0
    Video = 1
    ImageAndVideo = 2


def init_task_settings(task_info: dict) -> dict:
    if task_info['files_scanned'] > 0:
        db.clear_task_files_scanned_groups(task_info['id'])
    task_settings = {'id': task_info['id'], 'data_dir': db.Config['datadir']}
    excl_all = task_info['exclude_list']
    task_settings['exclude_mask'] = list(dict.fromkeys(excl_all['user']['mask'] + excl_all['admin']['mask']))
    task_settings['exclude_fileid'] = list(dict.fromkeys(excl_all['user']['fileid'] + excl_all['admin']['fileid']))
    task_settings['mime_dir'] = db.get_mimetype_id("'httpd/unix-directory'")
    task_settings['mime_image'] = db.get_mimetype_id("'image'")
    task_settings['mime_video'] = db.get_mimetype_id("'video'")
    collector_settings = task_info['collector_settings']
    task_settings['hash_size'] = collector_settings['hash_size']
    if not collector_settings['hashing_algorithm'] in get_installed_algorithms_list():
        db.append_task_error(task_settings['id'], f"`{collector_settings['hashing_algorithm']}` is not available.")
        return {}
    task_settings['hash_algo'] = collector_settings['hashing_algorithm']
    if collector_settings['similarity_threshold'] == 100:
        task_settings['precision_img'] = int(task_settings['hash_size'] / 8)
    else:
        number_of_bits = task_settings['hash_size']**2
        if task_settings['hash_size'] <= 8:
            task_settings['precision_img'] = number_of_bits - int(math.ceil(
                number_of_bits / 100.0 * collector_settings['similarity_threshold']))
            if task_settings['precision_img'] == 0:
                task_settings['precision_img'] = 1
        else:
            task_settings['precision_img'] = number_of_bits - int(math.floor(
                number_of_bits / 100.0 * collector_settings['similarity_threshold']))
    task_settings['precision_vid'] = task_settings['precision_img'] * 4
    print('Image hamming distance: ', task_settings['precision_img'])
    print('Video hamming distance between 4 frames: ', task_settings['precision_vid'])
    print('Hashing algo:', task_settings['hash_algo'])
    task_settings['type'] = collector_settings['target_mtype']
    task_settings['target_dirs'] = task_info['target_directory_ids']
    task_settings['target_dirs'] = sorted(list(map(int, task_settings['target_dirs'])))
    task_settings['remote_filesize_limit'] = db.get_remote_filesize_limit()
    return task_settings


def reset_data_groups():
    reset_images()
    reset_videos()


def analyze_and_lock(task_info: dict, forced: bool) -> bool:
    time.sleep(1)
    if task_info['py_pid'] != 0:
        if db.get_time() > task_info['updated_time'] + int(TaskKeepaliveInterval) * 3:
            print('Task was hanging.')
        else:
            print('Task already running.')
            return False
    elif not forced:
        if len(task_info['errors']):
            print('Task was previously finished with errors.')
        else:
            if task_info['finished_time'] == 0:
                if task_info['files_scanned'] > 0:
                    print('Task was interrupted.')
                else:
                    print('Processing new task.')
            else:
                print('Task was previously finished successfully.')
                return False
    if not db.lock_task(task_info['id'], task_info['updated_time']):
        print('Cant lock task.')
        return False
    print('Task locked.')
    return True


def updated_time_background_thread(task_id: int, exit_event):
    try:
        while True:
            exit_event.wait(timeout=float(TaskKeepaliveInterval))
            if exit_event.is_set():
                break
            print('BT:Updating keepalive.')
            db.set_task_keepalive(task_id, connection_id=1)
    except Exception as e:
        print(f"BT:Exception({type(e).__name__}): `{str(e)}`")
        db.append_task_error(task_id, f"BT:Exception({type(e).__name__}): `{str(e)}`", connection_id=1)
    print('BT:Close DB connection.')
    db.close_connection(1)
    print('BT:Exiting.')


def start_background_thread(task_settings: dict):
    print('Starting background thread.')
    task_settings['exit_event'] = threading.Event()
    task_settings['b_thread'] = threading.Thread(target=updated_time_background_thread, daemon=True,
                                                 args=(task_settings['id'], task_settings['exit_event'],))
    task_settings['b_thread'].start()


def process(task_info: dict, forced: bool):
    print(f"Processing task: id={task_info['id']}, forced={forced}")
    if not analyze_and_lock(task_info, forced):
        return
    try:
        reset_data_groups()
        update_storages_info()
        task_settings = init_task_settings(task_info)
        if len(task_settings):
            module_init_done = True
            task_type = TaskType(task_settings['type'])
            if task_type in (TaskType.Image, TaskType.Video, TaskType.ImageAndVideo):
                module_init_done &= dc_images_init(task_settings['id'])
            if task_type in (TaskType.Video, TaskType.ImageAndVideo) and module_init_done:
                module_init_done &= dc_videos_init(task_settings['id'])
            if module_init_done:
                start_background_thread(task_settings)
                time_start = time.perf_counter()
                if task_type == TaskType.Image:
                    process_image_task(task_settings)
                elif task_type == TaskType.Video:
                    process_video_task(task_settings)
                elif task_type == TaskType.ImageAndVideo:
                    process_image_task(task_settings)
                    process_video_task(task_settings)
                task_settings['exit_event'].set()
                task_settings['b_thread'].join(timeout=2.0)
                print(f"Task execution_time: {time.perf_counter() - time_start}")
                db.finalize_task(task_info['id'])
    except Exception as e:
        print(f"Exception({type(e).__name__}): `{str(e)}`")
        db.append_task_error(task_info['id'], f"Exception({type(e).__name__}): `{str(e)}`")
    finally:
        print('Task unlocked.')
        db.unlock_task(task_info['id'])


def process_image_task(task_settings: dict):
    directories_ids = task_settings['target_dirs']
    apply_exclude_list(db.get_paths_by_ids(directories_ids), task_settings, directories_ids)
    process_image_task_dirs(directories_ids, task_settings)
    save_image_results(task_settings['id'])


def process_image_task_dirs(directories_ids: list, task_settings: dict):
    for dir_id in directories_ids:
        process_image_task_dirs(process_directory_images(dir_id, task_settings), task_settings)


def process_video_task(task_settings: dict):
    directories_ids = task_settings['target_dirs']
    apply_exclude_list(db.get_paths_by_ids(directories_ids), task_settings, directories_ids)
    process_video_task_dirs(directories_ids, task_settings)
    save_video_results(task_settings['id'])


def process_video_task_dirs(directories_ids: list, task_settings: dict):
    for dir_id in directories_ids:
        process_video_task_dirs(process_directory_videos(dir_id, task_settings), task_settings)


def process_directory_images(dir_id: int, task_settings: dict) -> list:
    data = db.get_directory_data_image(dir_id, task_settings['mime_dir'], task_settings['mime_image'])
    if not data:
        return []
    apply_exclude_list(data, task_settings)
    sub_dirs = extract_sub_dirs(data, task_settings['mime_dir'])
    dc_process_images(task_settings, data)
    if len(data):
        db.increase_processed_files_count(task_settings['id'], len(data))
    return sub_dirs


def process_directory_videos(dir_id: int, task_settings: dict) -> list:
    data = db.get_directory_data_video(dir_id, task_settings['mime_dir'], task_settings['mime_video'])
    if not data:
        return []
    apply_exclude_list(data, task_settings)
    sub_dirs = extract_sub_dirs(data, task_settings['mime_dir'])
    dc_process_videos(task_settings, data)
    if len(data):
        db.increase_processed_files_count(task_settings['id'], len(data))
    return sub_dirs


def apply_exclude_list(data: list, task_settings: dict, where_to_purge=None) -> list:
    purge = []
    for n, x in enumerate(data):
        if x['fileid'] in task_settings['exclude_fileid']:
            purge.append(n)
        elif is_path_in_exclude(x['path'], task_settings['exclude_mask']):
            purge.append(n)
    if where_to_purge is None:
        for n in reversed(purge):
            del data[n]
    else:
        for n in reversed(purge):
            del where_to_purge[n]
    return purge


def extract_sub_dirs(data: list, mime_dir: int) -> list:
    sub_dirs = []
    purge = []
    for n, x in enumerate(data):
        if x['mimetype'] == mime_dir:
            sub_dirs.append(x['fileid'])
            purge.append(n)
    for n in reversed(purge):
        del data[n]
    return sub_dirs


def apply_whitelist(data: dict, whitelist: list):
    purge = []
    for n, x in enumerate(data):
        if not x['path'].lower().endswith(tuple(whitelist)):
            purge.append(n)
    for n in reversed(purge):
        del data[n]
