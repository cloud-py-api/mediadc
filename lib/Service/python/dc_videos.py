"""
Videos processing functions.
"""

# pylint: disable=undefined-variable

import json
import traceback
from files import can_directly_access_file, get_file_full_path, request_file_from_php
from ffmpeg_probe import ffprobe_get_video_info, stub_call_ff
from db import store_video_hash, store_err_video_hash, store_task_files_group, append_task_error
from install import import_packages, check_video
from dc_images import arr_hash_to_string, arr_hash_from_bytes, calc_hash


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


class InvalidVideo(Exception):
    """Exception for use inside `process_video_hash` function."""


VideoGroups = {}  # {group1:[fileid1,fileid2],group2:[fileid3,fileid4]}
SetOfGroups = []  # hashes[ABCD+EFGH+IMGH+ZXCV,xx1+xx2+xx3+xx4]
GroupsCount = 0   # number of elements in SetOfGroups
Imported = False
CHamming = False  # is hexhamming present. Changes state in dc_videos_init.
MinVideoDuration_ms = 3000
FirstFrameResolution = 64


def dc_videos_init(task_id: int) -> bool:
    global Imported, CHamming
    results = check_video()
    if results:
        append_task_error(task_id, f"Cant find: {results}")
        return False
    if Imported:
        return True
    results = import_packages(['numpy', 'PIL', 'imagehash'], dest_sym_table=globals())
    if not results:
        Imported = True
        results = import_packages(['hexhamming'], dest_sym_table=globals())
        if not results:
            CHamming = True
            print('Videos: HexHamming module - enabled.')
    else:
        append_task_error(task_id, f"Cant import: {results}")
    return Imported


def dc_process_videos(settings: dict, video_records: list):
    for video_record in video_records:
        if video_record['skipped'] is not None:
            if video_record['skipped'] >= 2:
                continue
            if video_record['skipped'] != 0:
                video_record['hash'] = None
        else:
            video_record['skipped'] = 0
        if video_record['hash'] is None:
            process_video_hash(settings['hash_algo'], settings['hash_size'], video_record, settings['data_dir'],
                               settings['remote_filesize_limit'])
        else:
            if CHamming:
                video_record['hash'] = video_record['hash'].hex()
            else:
                video_record['hash'] = arr_hash_from_bytes(video_record['hash'])
        if video_record['hash'] is not None:
            process_video_record(settings['precision_vid'], video_record['hash'], video_record['fileid'])


def process_video_record(precision: int, video_hash, fileid: int):
    global VideoGroups, SetOfGroups, GroupsCount
    if CHamming:
        for i in range(GroupsCount):
            if hexhamming.check_hexstrings_within_dist(SetOfGroups[i], video_hash, precision):
                VideoGroups[i].append(fileid)
                return
    else:
        for i in range(GroupsCount):
            if numpy.count_nonzero(SetOfGroups[i] != video_hash) <= precision:
                VideoGroups[i].append(fileid)
                return
    SetOfGroups.append(video_hash)
    VideoGroups[GroupsCount] = [fileid]
    GroupsCount += 1


def reset_videos():
    global VideoGroups, SetOfGroups, GroupsCount
    VideoGroups = {}
    SetOfGroups = []
    GroupsCount = 0


def process_video_hash(algo: str, hash_size: int, file_info: dict, data_dir: str, remote_filesize_limit: int):
    video_info = {}
    try:
        while True:
            if not can_directly_access_file(file_info):
                break
            full_path = get_file_full_path(data_dir, file_info['storage'], file_info['path'])
            if not full_path:
                break
            video_info = ffprobe_get_video_info(full_path, None)
            if not video_info:
                break
            if not do_hash_video(algo, hash_size, video_info, file_info, full_path, None):
                raise InvalidVideo
            return
        if file_info['size'] > remote_filesize_limit:
            return
        if file_info['path'].lower().endswith(('.mkv',)):
            return
        data = request_file_from_php(file_info)
        if len(data) == 0:
            return
        video_info = ffprobe_get_video_info(None, data)
        if not video_info.get('fast_start', False):
            raise InvalidVideo
        if not do_hash_video(algo, hash_size, video_info, file_info, None, data):
            raise InvalidVideo
    except Exception as exception_info:
        store_err_video_hash(file_info['fileid'], video_info.get('duration', 0),
                             file_info['mtime'], file_info['skipped'] + 1)
        exception_name = type(exception_info).__name__
        if exception_name != 'InvalidVideo':
            print(f"Exception({exception_name}): `{file_info['path']}`:\n`{str(traceback.format_exc())}`")


def do_hash_video(algo: str, hash_size: int, video_info: dict, file_info: dict, path, data) -> bool:
    """Accepts path(bytes/str) or data for processing in memory."""
    if video_info['duration'] < MinVideoDuration_ms:
        return False
    if video_info['duration'] > 24 * 60 * 60 * 1000:   # let's only process videos with duration <= 24 hours.
        return False
    first_timestamp = get_first_timestamp(video_info, path, data)
    if first_timestamp == -1:
        return False
    frames_timestamps = build_times_for_hashes(video_info['duration'], first_timestamp)
    ex = ()
    res = get_frames(frames_timestamps, path, data, *ex)
    if not res[0]:
        return False
    if any(len(x) == 0 for x in res[1:]):
        return False
    hashes_l = [calc_hash(algo, hash_size, '', res[1]),
                calc_hash(algo, hash_size, '', res[2]),
                calc_hash(algo, hash_size, '', res[3]),
                calc_hash(algo, hash_size, '', res[4])]
    if any(x is None for x in hashes_l):
        return False
    hashes = numpy.concatenate((hashes_l[0], hashes_l[1], hashes_l[2], hashes_l[3]), axis=0)
    hashes_str = arr_hash_to_string(hashes)
    if CHamming:
        file_info['hash'] = hashes_str
    else:
        file_info['hash'] = hashes
    file_info['timestamps'] = frames_timestamps
    file_info['duration'] = video_info['duration']
    store_video_hash(file_info['fileid'], video_info['duration'],
                     json.dumps(frames_timestamps), hashes_str, file_info['mtime'])
    return True


def build_times_for_hashes(total_duration_ms: int, first_hash_timestamp: int) -> list:
    pre_interval = int((total_duration_ms - first_hash_timestamp) / 10)
    round_factor = len(str(pre_interval)) - 1
    rounded_hash_timestamp = round(pre_interval, ndigits=-round_factor)
    return [first_hash_timestamp, rounded_hash_timestamp, rounded_hash_timestamp * 2, rounded_hash_timestamp * 4]


def get_max_first_frame_time(duration_ms) -> int:
    max_timestamp = int(duration_ms / 10)
    if max_timestamp > 14 * 1000:
        return 14 * 1000
    return max_timestamp


def get_first_timestamp(video_info: dict, path, data) -> int:
    """Accepts path(bytes/str) or data for processing in memory."""
    max_timestamp = get_max_first_frame_time(video_info['duration'])
    ffmpeg_input_params = ['-hide_banner', '-loglevel', 'fatal', '-an', '-sn', '-dn', '-to', f'{max_timestamp}ms']
    if path is not None:
        result, err = stub_call_ff('ffmpeg', *ffmpeg_input_params, '-i', path,
                                   '-f', 'rawvideo', '-s', f'{FirstFrameResolution}x{FirstFrameResolution}',
                                   '-pix_fmt', 'rgb24', 'pipe:'
                                   )
    elif data is not None:
        result, err = stub_call_ff('ffmpeg', *ffmpeg_input_params, '-i', 'pipe:0',
                                   '-f', 'rawvideo', '-s', f'{FirstFrameResolution}x{FirstFrameResolution}',
                                   '-pix_fmt', 'rgb24', 'pipe:1',
                                   stdin_data=data)
    else:
        raise ValueError("`path` or `data` argument must be specified.")
    if err:
        print('DEBUG:', err)
        return -1
    frame_size = FirstFrameResolution * FirstFrameResolution * 3
    frames_count = int(len(result.stdout) / frame_size)
    frames_per_second = round(frames_count / (max_timestamp / 1000))
    if frames_per_second == 0:
        frames_per_second = 1
    video_info['fps'] = frames_per_second
    for i in range(frames_count):
        if is_frame_too_dark(result.stdout, i, frame_size):
            continue
        if is_frame_too_bright(result.stdout, i, frame_size):
            continue
        return int(i / frames_per_second * 1000)
    return 0


def get_frames(timestamps: list, path, data, *ffmpeg_out_params) -> list:
    """Accepts path(bytes/str) or data for processing in memory."""
    ret = [False]
    for _ in range(len(timestamps)):
        ret.append(b'')
    if path is None and data is None:
        raise ValueError("`path` or `data` argument must be specified.")
    ffmpeg_input_params = ['-hide_banner', '-loglevel', 'fatal', '-an', '-sn', '-dn']
    for index, timestamp in enumerate(timestamps):
        if path is not None:
            result, err = stub_call_ff('ffmpeg', *ffmpeg_input_params,
                                       '-ss', f'{timestamp}ms', '-i', path,
                                       '-f', 'image2', '-c:v', 'bmp', '-frames', '1', *ffmpeg_out_params, 'pipe:'
                                       )
        else:
            result, err = stub_call_ff('ffmpeg', *ffmpeg_input_params,
                                       '-ss', f'{timestamp}ms', '-i', 'pipe:0',
                                       '-f', 'image2', '-c:v', 'bmp', '-frames', '1', *ffmpeg_out_params, 'pipe:1',
                                       stdin_data=data)
        if err:
            print('DEBUG:', err)
            return ret
        ret[index + 1] = result.stdout
    ret[0] = True
    return ret


def is_frame_too_dark(data: bytes, frame_offset: int, frame_size: int) -> bool:
    dark_allow_percent = 80
    total_allowed_dark_pixels = int(((frame_size / 3) / 100) * dark_allow_percent)
    dark_pixels = 0
    frame_bytes = data[frame_size * frame_offset:frame_size * (frame_offset + 1)]
    for pixel_index in range(int(len(frame_bytes) / 3)):
        pixel_data = frame_bytes[pixel_index * 3:pixel_index * 3 + 3]
        if pixel_data[0] <= 0x20 and pixel_data[1] <= 0x20 and pixel_data[2] <= 0x20:
            dark_pixels += 1
    if dark_pixels > total_allowed_dark_pixels:
        return True
    return False


def is_frame_too_bright(data: bytes, frame_offset: int, frame_size: int) -> bool:
    bright_allow_percent = 90
    total_allowed_bright_pixels = int(((frame_size / 3) / 100) * bright_allow_percent)
    bright_pixels = 0
    frame_bytes = data[frame_size * frame_offset:frame_size * (frame_offset + 1)]
    for pixel_index in range(int(len(frame_bytes) / 3)):
        pixel_data = frame_bytes[pixel_index * 3:pixel_index * 3 + 3]
        brightness = int(sum([pixel_data[0], pixel_data[1], pixel_data[2]]) / 3)
        if brightness >= 0xFA:
            bright_pixels += 1
    if bright_pixels > total_allowed_bright_pixels:
        return True
    return False


def remove_solo_groups():
    groups_to_remove = []
    for group_key, files_id in VideoGroups.items():
        if len(files_id) == 1:
            groups_to_remove.append(group_key)
    for key in groups_to_remove:
        del VideoGroups[key]


def save_video_results(task_id: int):
    remove_solo_groups()
    print('Videos: Number of groups:', len(VideoGroups))
    for files_id in VideoGroups.values():
        store_task_files_group(task_id, json.dumps(files_id))
