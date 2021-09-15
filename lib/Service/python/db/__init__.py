from .manager import DbType, Config, get_time, get_required_packages, get_optional_packages, get_boost_packages
from .manager import execute_fetchall, execute_commit, close_connection, check_db, get_warnings
from .occ_cloud import occ_call


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

dbtype = manager.init()
if dbtype == DbType.MYSQL:
    from .msql import (
        get_tasks, clear_task_files_scanned_groups, increase_processed_files_count,
        lock_task, unlock_task, finalize_task, append_task_error, set_task_keepalive,
        get_paths_by_ids, get_directory_data_image, get_directory_data_video, get_mimetype_id,
        get_all_storage_info, store_image_hash, store_err_image_hash, store_video_hash, store_err_video_hash,
        store_task_files_group, get_remote_filesize_limit,
    )
elif dbtype == DbType.PGSQL:
    from .pgsql import (
        get_tasks, clear_task_files_scanned_groups, increase_processed_files_count,
        lock_task, unlock_task, finalize_task, append_task_error, set_task_keepalive,
        get_paths_by_ids, get_directory_data_image, get_directory_data_video, get_mimetype_id,
        get_all_storage_info, store_image_hash, store_err_image_hash, store_video_hash, store_err_video_hash,
        store_task_files_group, get_remote_filesize_limit,
    )
elif dbtype == DbType.OCI:
    from .oci import get_tasks
else:
    from .empty_impl import (
        get_tasks, clear_task_files_scanned_groups, increase_processed_files_count,
        lock_task, unlock_task, finalize_task, append_task_error, set_task_keepalive,
        get_paths_by_ids, get_directory_data_image, get_directory_data_video, get_mimetype_id,
        get_all_storage_info, store_image_hash, store_err_image_hash, store_video_hash, store_err_video_hash,
        store_task_files_group, get_remote_filesize_limit,
    )
