import subprocess
import os
from typing import Union
from pathlib import Path


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
