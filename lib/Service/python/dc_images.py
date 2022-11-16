"""
Images processing functions.
"""

# pylint: disable=undefined-variable

import io

from db import (
    append_task_error,
    store_err_image_hash,
    store_image_hash,
    store_task_files_group,
)
from files import get_file_data
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


ImagesGroups = {}  # {group1:[(fileid1,size),(fileid2,size)],group2:[(fileid3,size),(fileid4,size)]}
SetOfGroups = []  # [flat_numpy_array1,flat_numpy_array2,flat_numpy_array3]
Imported = False
CHamming = False  # is hexhamming present. Changes state in dc_images_init.


def dc_images_init(task_id: int) -> bool:
    global Imported, CHamming
    if Imported:
        return True
    results = import_packages(["numpy", "PIL", "imagehash"], dest_sym_table=globals())
    if not results:
        Imported = True
        results = import_packages(["pillow_heif"], dest_sym_table=globals())
        if not results:
            pillow_heif.register_heif_opener()
            print("Images: HEVC decoder - enabled.")
        results = import_packages(["hexhamming"], dest_sym_table=globals())
        if not results:
            CHamming = True
            print("Images: HexHamming module - enabled.")
    else:
        append_task_error(task_id, f"Cant import: {results}")
    return Imported


def dc_process_images(settings: dict, image_records: list):
    for image_record in image_records:
        if image_record["skipped"] is not None:
            if image_record["skipped"] >= 2:
                continue
            if image_record["skipped"] != 0:
                image_record["hash"] = None
        else:
            image_record["skipped"] = 0
        if image_record["hash"] is None:
            print(f"processing image: fileid = {image_record['fileid']}")
            image_record["hash"] = process_hash(
                settings["hash_algo"],
                settings["hash_size"],
                image_record,
                settings["data_dir"],
                settings["remote_filesize_limit"],
            )
        else:
            if CHamming:
                image_record["hash"] = image_record["hash"].hex()
            else:
                image_record["hash"] = arr_hash_from_bytes(image_record["hash"])
        if image_record["hash"] is not None:
            process_image_record(settings["precision_img"], image_record)


def process_hash(algo: str, hash_size: int, image_info: dict, data_dir: str, remote_filesize_limit: int):
    data = get_file_data(image_info, data_dir, remote_filesize_limit)
    if len(data) == 0:
        return None
    hash_of_image = calc_hash(algo, hash_size, data)
    if hash_of_image is None:
        store_err_image_hash(image_info["fileid"], image_info["mtime"], image_info["skipped"] + 1)
        return None
    hash_str = arr_hash_to_string(hash_of_image)
    store_image_hash(image_info["fileid"], hash_str, image_info["mtime"])
    if CHamming:
        return hash_str
    return hash_of_image


def arr_hash_from_bytes(buf: bytes):
    return numpy.unpackbits(numpy.frombuffer(buf, dtype=numpy.uint8), axis=None)


def arr_hash_to_string(arr) -> str:
    return numpy.packbits(arr, axis=None).tobytes().hex()


def calc_hash(algo: str, hash_size: int, image_data: bytes):
    image_hash = hash_image_data(algo, hash_size, image_data)
    if image_hash is None:
        return None
    return image_hash.flatten()


def process_image_record(precision: int, image_record: dict):
    img_group_number = len(ImagesGroups)
    if CHamming:
        for i in range(img_group_number):
            if hexhamming.check_hexstrings_within_dist(SetOfGroups[i], image_record["hash"], precision):
                ImagesGroups[i].append((image_record["fileid"], image_record["size"]))
                return
    else:
        for i in range(img_group_number):
            if numpy.count_nonzero(SetOfGroups[i] != image_record["hash"]) <= precision:
                ImagesGroups[i].append((image_record["fileid"], image_record["size"]))
                return
    SetOfGroups.append(image_record["hash"])
    ImagesGroups[img_group_number] = [(image_record["fileid"], image_record["size"])]


def reset_images():
    ImagesGroups.clear()
    SetOfGroups.clear()


def remove_solo_groups():
    groups_to_remove = []
    for group_key, files_id in ImagesGroups.items():
        if len(files_id) == 1:
            groups_to_remove.append(group_key)
    for key in groups_to_remove:
        del ImagesGroups[key]


def save_image_results(task_id: int) -> int:
    remove_solo_groups()
    print("Images: Number of groups:", len(ImagesGroups))
    dup_files_count = 0
    dup_files_size = 0
    n_group = 1
    for files_id_size in ImagesGroups.values():
        dup_files_count += len(files_id_size)
        for file_id, file_size in files_id_size:
            dup_files_size += file_size
            store_task_files_group(task_id, n_group, file_id)
        n_group += 1
    return n_group


def pil_to_hash(algo: str, hash_size: int, pil_image):
    pil_image = PIL.ImageOps.exif_transpose(pil_image)
    if algo == "phash":
        image_hash = imagehash.phash(pil_image, hash_size=hash_size)
    elif algo == "dhash":
        image_hash = imagehash.dhash(pil_image, hash_size=hash_size)
    elif algo == "whash":
        image_hash = imagehash.whash(pil_image, hash_size=hash_size)
    elif algo == "average":
        image_hash = imagehash.average_hash(pil_image, hash_size=hash_size)
    else:
        image_hash = None
    return image_hash


def hash_image_data(algo: str, hash_size: int, image_data: bytes):
    try:
        pil_image = PIL.Image.open(io.BytesIO(image_data))
        return pil_to_hash(algo, hash_size, pil_image)
    except Exception as exception_info:
        print(f"Exception({type(exception_info).__name__}): `{str(exception_info)}`")
        return None
