"""
File with helper class to work with `occ` command.
"""

import subprocess
import os
import re
from typing import Union
from pathlib import Path


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


def init_occ() -> str:
    """Returns path to `occ` command or if fails find it then just 'occ'."""
    for env_var_name, env_var_value in sorted(os.environ.items()):
        if env_var_name == 'OCC_PATH':
            return env_var_value
    dir_path = Path(os.path.abspath('.'))
    while True:
        occ = dir_path.joinpath('occ')
        if os.path.isfile(occ):
            return str(occ)
        if dir_path == dir_path.parent:
            return 'occ'
        dir_path = dir_path.parent


def init_php() -> str:
    """Returns path to php interpreter, that must be set by PHP script before executing python module or 'php'."""
    for env_var_name, env_var_value in sorted(os.environ.items()):
        if env_var_name == 'PHP_PATH':
            return env_var_value
    return 'php'


OCC = init_occ()
PHP = init_php()


def php_call(*params, decode: bool = True) -> [bool, Union[str, bytes]]:
    """Calls PHP interpreter with specified `params`. Returns: True and output of call or False and error string."""
    try:
        if not os.getenv('DEV_TEST'):
            result = subprocess.run(
                [PHP, *params],
                stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, check=True
            )
        else:
            result = subprocess.run(
                ['sudo', '-u', 'www-data', PHP, *params],
                stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, check=True
            )
    except subprocess.CalledProcessError as exception_info:
        return False, f'Error:`{str(exception_info)}`'
    except Exception as exception_info:
        return False, f'Error({type(exception_info).__name__}):`{str(exception_info)}`'
    if decode:
        output_result = result.stdout.decode('utf-8').rstrip('\n')
    else:
        output_result = result.stdout
    return True, output_result


def occ_call(occ_task, *params, decode: bool = True) -> [bool, Union[str, bytes]]:
    """Wrapper for occ calls. If decode=False then raw stdout data will be returned from occ."""
    success, result = php_call(OCC, '--no-warnings', occ_task, *params, decode=decode)
    if not success:
        return False, result
    clear_result = re.sub(r'.*app.*require.*upgrade.*\n?', '', result, flags=re.IGNORECASE)
    clear_result = re.sub(r'.*occ.*upgrade.*command.*\n?', '', clear_result, flags=re.IGNORECASE)
    clear_result = clear_result.strip('\n')
    return True, clear_result


def get_cloud_config_value(value_name: str) -> [bool, str]:
    """Returns success flag and decoded utf8 output of `occ config:system:get {value}` command or error string."""
    return occ_call('config:system:get', value_name)


def get_cloud_app_config_value(app_name: str, value_name: str) -> [bool, str]:
    """Returns success flag and decoded utf8 output of `occ config:app:get {app} {value}` command or error string."""
    return occ_call('config:app:get', app_name, value_name)
