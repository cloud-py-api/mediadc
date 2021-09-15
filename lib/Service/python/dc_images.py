"""
Images processing functions.
"""

import io
import json
from files import get_file_data
from db import store_image_hash, store_err_image_hash, store_task_files_group, append_task_error
from install import import_packages


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


ImagesGroups = {}   # {group1:[fileid1,fileid2],group2:[fileid3,fileid4]}
SetOfGroups = []    # [flat_numpy_array1,flat_numpy_array2,flat_numpy_array3]
GroupsCount = 0     # number of elements in SetOfGroups
Imported = False    # (group_hash1,group_hash2)
Heif_AV1 = False
CHamming = False    # is hexhamming present. Changes state in dc_images_init.


def dc_images_init(task_id: int) -> bool:
    global Imported, Heif_AV1, CHamming
    if Imported:
        return True
    results = import_packages(['numpy', 'PIL', 'imagehash'], dest_sym_table=globals())
    if not results:
        Imported = True
        results = import_packages(['pillow_heif'], dest_sym_table=globals())
        if not results:
            Heif_AV1 = True
            print('Images: HEIC(Apple) decoder - enabled.')
        results = import_packages(['hexhamming'], dest_sym_table=globals())
        if not results:
            CHamming = True
            print('Images: HexHamming module - enabled.')
    else:
        append_task_error(task_id, f"Cant import: {results}")
    return Imported


def dc_process_images(settings: dict, data: list):
    for x in data:
        if x['skipped'] is not None:
            if x['skipped'] >= 2:
                continue
            if x['skipped'] != 0:
                x['hash'] = None
        else:
            x['skipped'] = 0
        if x['hash'] is None:
            x['hash'] = process_hash(settings['hash_algo'], settings['hash_size'], x, settings['data_dir'],
                                     settings['remote_filesize_limit'])
        else:
            if CHamming:
                x['hash'] = x['hash'].hex()
            else:
                x['hash'] = arr_hash_from_bytes(x['hash'])
        if x['hash'] is not None:
            process_image_record(settings['precision_img'], x['hash'], x['fileid'])


def process_hash(algo: str, hash_size: int, image_info: dict, data_dir: str, remote_filesize_limit: int):
    data = get_file_data(image_info, data_dir, remote_filesize_limit)
    if len(data) == 0:
        return None
    hash_of_image = calc_hash(algo, hash_size, image_info['path'], data)
    if hash_of_image is None:
        store_err_image_hash(image_info['fileid'], image_info['mtime'], image_info['skipped'] + 1)
        return None
    hash_str = arr_hash_to_string(hash_of_image)
    store_image_hash(image_info['fileid'], hash_str, image_info['mtime'])
    if CHamming:
        return hash_str
    return hash_of_image


def arr_hash_from_bytes(buf: bytes):
    return numpy.unpackbits(numpy.frombuffer(buf, dtype=numpy.uint8), axis=None)


def arr_hash_to_string(arr) -> str:
    return numpy.packbits(arr, axis=None).tobytes().hex()


def calc_hash(algo: str, hash_size: int, image_path: str, data: bytes):
    image_hash = hash_image_data(algo, hash_size, data, image_path)
    if image_hash is None:
        return None
    return image_hash.flatten()


def process_image_record(precision: int, img_hash, fileid: int):
    global ImagesGroups, SetOfGroups, GroupsCount
    if CHamming:
        for i in range(GroupsCount):
            if hexhamming.check_hexstrings_within_dist(SetOfGroups[i], img_hash, precision):
                ImagesGroups[i].append(fileid)
                return
    else:
        for i in range(GroupsCount):
            if numpy.count_nonzero(SetOfGroups[i] != img_hash) <= precision:
                ImagesGroups[i].append(fileid)
                return
    SetOfGroups.append(img_hash)
    ImagesGroups[GroupsCount] = [fileid]
    GroupsCount += 1


def reset_images():
    global ImagesGroups, SetOfGroups, GroupsCount
    ImagesGroups = {}
    SetOfGroups = []
    GroupsCount = 0


def remove_solo_groups():
    groups_to_remove = []
    for key in ImagesGroups.keys():
        if len(ImagesGroups[key]) == 1:
            groups_to_remove.append(key)
    for key in groups_to_remove:
        del ImagesGroups[key]


def save_image_results(task_id: int):
    remove_solo_groups()
    print('Images: Number of groups:', len(ImagesGroups))
    for v in ImagesGroups.values():
        store_task_files_group(task_id, json.dumps(v))


def pil_to_hash(algo: str, hash_size: int, pil_image):
    if algo == 'phash':
        image_hash = imagehash.phash(pil_image, hash_size=hash_size)
    elif algo == 'dhash':
        image_hash = imagehash.dhash(pil_image, hash_size=hash_size)
    elif algo == 'whash':
        image_hash = imagehash.whash(pil_image, hash_size=hash_size)
    elif algo == 'average':
        image_hash = imagehash.average_hash(pil_image, hash_size=hash_size)
    else:
        image_hash = None
    return image_hash


def hash_image_data(algo: str, hash_size: int, image_data: bytes, path: str):
    try:
        if path.lower().endswith(('.heic', '.heif', '.hif',)):
            if not Heif_AV1:
                return None
            if pillow_heif.check(image_data) not in (pillow_heif.heif_filetype_yes_supported,
                                                     pillow_heif.heif_filetype_maybe):
                print(f'{path}: Unsupported format.')
                return None
            heif_file = pillow_heif.read(image_data)
            pil_image = PIL.Image.frombytes(heif_file.mode, heif_file.size, heif_file.data,
                                            "raw", heif_file.mode, heif_file.stride,)
        else:
            pil_image = PIL.Image.open(io.BytesIO(image_data))
        return pil_to_hash(algo, hash_size, pil_image)
    except Exception as exception_info:
        print(f'Exception({type(exception_info).__name__}): `{path}`: `{str(exception_info)}`')
        return None
