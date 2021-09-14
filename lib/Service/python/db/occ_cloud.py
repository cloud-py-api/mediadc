import subprocess
import os
from typing import Union
from pathlib import Path


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


PHP = 'php'
OCC = ''


def init() -> None:
    global PHP, OCC
    for k, v in sorted(os.environ.items()):
        if k == 'PHP_PATH':
            PHP = v
        if k == 'OCC_PATH':
            OCC = v
    if not OCC:
        OCC = find_occ()


def find_occ() -> str:
    p = Path(os.path.abspath('.'))
    while True:
        occ = p.joinpath('occ')
        if os.path.isfile(occ):
            break
        if p == p.parent:
            occ = 'occ'
            break
        p = p.parent
    return str(occ)


def php_call(*params, decode: bool = True) -> [bool, Union[str, bytes]]:
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
    except subprocess.CalledProcessError as e:
        return False, f'Error:`{str(e)}`'
    except Exception as e:
        return False, f'Error({type(e).__name__}):`{str(e)}`'
    if decode:
        output_result = result.stdout.decode('utf-8').rstrip('\n')
    else:
        output_result = result.stdout
    return True, output_result


def occ_call(occ_task, *params, decode: bool = True) -> [bool, Union[str, bytes]]:
    return php_call(OCC, occ_task, *params, decode=decode)


def get_cloud_config_value(value_name: str) -> [bool, str]:
    return occ_call('config:system:get', value_name)


def get_cloud_app_config_value(app_name: str, value_name: str) -> [bool, str]:
    return occ_call('config:app:get', app_name, value_name)
