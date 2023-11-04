"""
Images processing functions.
"""

from io import BytesIO
from typing import Any, Optional, Union

import numpy
from nc_py_api import FsNodeInfo, fs_file_data, fs_sort_by_id
from pi_heif import register_heif_opener
from PIL import Image, ImageOps

from .db_requests import (
    get_images_caches,
    store_err_image_hash,
    store_image_hash,
    store_task_files_group,
)
from .imagehash import average_hash, dhash, phash, whash
from .log import logger as log

try:
    from hexhamming import check_hexstrings_within_dist
except ImportError:
    check_hexstrings_within_dist = None


class MdcImageInfo(FsNodeInfo):
    hash: Optional[Union[bytes, str]]
    skipped: Optional[int]


register_heif_opener()

ImagesGroups: dict[int, list[int]] = {}
SetOfGroups: list[Any] = []  # [flat_numpy_array1,flat_numpy_array2,flat_numpy_array3]


def process_images(settings: dict, fs_objs: list[FsNodeInfo]):
    mdc_images_info = load_images_caches(fs_objs)
    for mdc_image_info in mdc_images_info:
        if mdc_image_info["skipped"] is not None:
            if mdc_image_info["skipped"] >= 2:
                continue
            if mdc_image_info["skipped"] != 0:
                mdc_image_info["hash"] = None
        else:
            mdc_image_info["skipped"] = 0
        if mdc_image_info["hash"] is None:
            log.debug("calculating hash for image: fileid = %u", mdc_image_info["id"])
            mdc_image_info["hash"] = process_hash(
                settings["hash_algo"],
                settings["hash_size"],
                mdc_image_info,
                settings["exif_transpose"],
            )
        else:
            if check_hexstrings_within_dist:
                mdc_image_info["hash"] = mdc_image_info["hash"].hex()
            else:
                mdc_image_info["hash"] = arr_hash_from_bytes(mdc_image_info["hash"])
        if mdc_image_info["hash"] is not None:
            process_image_record(settings["precision_img"], mdc_image_info)


def process_hash(algo: str, hash_size: int, mdc_img_info: MdcImageInfo, exif_transpose: bool):
    data = fs_file_data(mdc_img_info)
    if not data:
        return None
    hash_of_image = calc_hash(algo, hash_size, data, exif_transpose)
    if hash_of_image is None:
        store_err_image_hash(mdc_img_info["id"], mdc_img_info["mtime"], mdc_img_info["skipped"] + 1)
        return None
    hash_str = arr_hash_to_string(hash_of_image)
    store_image_hash(mdc_img_info["id"], hash_str, mdc_img_info["mtime"])
    if check_hexstrings_within_dist:
        return hash_str
    return hash_of_image


def arr_hash_from_bytes(buf: bytes):
    return numpy.unpackbits(numpy.frombuffer(buf, dtype=numpy.uint8), axis=None)


def arr_hash_to_string(arr) -> str:
    return numpy.packbits(arr, axis=None).tobytes().hex()


def calc_hash(algo: str, hash_size: int, image_data: bytes, exif_transpose=True):
    image_hash = hash_image_data(algo, hash_size, image_data, exif_transpose=exif_transpose)
    if image_hash is None:
        return None
    return image_hash.flatten()


def process_image_record(precision: int, mdc_img_info: MdcImageInfo):
    img_group_number = len(ImagesGroups)
    if check_hexstrings_within_dist:
        for i in range(img_group_number):
            if check_hexstrings_within_dist(SetOfGroups[i], mdc_img_info["hash"], precision):
                ImagesGroups[i].append(mdc_img_info["id"])
                return
    else:
        for i in range(img_group_number):
            if numpy.count_nonzero(SetOfGroups[i] != mdc_img_info["hash"]) <= precision:
                ImagesGroups[i].append(mdc_img_info["id"])
                return
    SetOfGroups.append(mdc_img_info["hash"])
    ImagesGroups[img_group_number] = [mdc_img_info["id"]]


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
    log.debug("Images: Number of groups: %u", len(ImagesGroups))
    n_group = 1
    for files_id in ImagesGroups.values():
        for file_id in files_id:
            store_task_files_group(task_id, n_group, file_id)
        n_group += 1
    return n_group


def pil_to_hash(algo: str, hash_size: int, pil_image, exif_transpose: bool = True):
    if exif_transpose:
        pil_image = ImageOps.exif_transpose(pil_image)
    if algo == "phash":
        image_hash = phash(pil_image, hash_size=hash_size)
    elif algo == "dhash":
        image_hash = dhash(pil_image, hash_size=hash_size)
    elif algo == "whash":
        image_hash = whash(pil_image, hash_size=hash_size)
    elif algo == "average":
        image_hash = average_hash(pil_image, hash_size=hash_size)
    else:
        image_hash = None
    return image_hash


def hash_image_data(algo: str, hash_size: int, image_data: bytes, exif_transpose: bool):
    try:
        pil_image = Image.open(BytesIO(image_data))
        return pil_to_hash(algo, hash_size, pil_image, exif_transpose)
    except Exception as exception_info:  # noqa # pylint: disable=broad-except
        log.debug("Exception during image processing:\n%s", str(exception_info))
        return None


def load_images_caches(images: list[FsNodeInfo]) -> list[MdcImageInfo]:
    if not images:
        return []
    images = fs_sort_by_id(images)
    cache_records = get_images_caches([image["id"] for image in images])
    return [images[i] | cache_records[i] for i in range(len(images))]
