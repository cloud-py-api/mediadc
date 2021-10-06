"""
MediaDC python dependencies install module.
"""

import os
import sys
import subprocess
import importlib.util
import argparse
import json
import re
from enum import Enum
import db
from ffmpeg_probe import get_version
PIP_DEBUG = 0
EXTRA_PIP_ARGS = []


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


class ExpandedState(Enum):
    """State of placement `local` dir in sys.path."""
    DISABLED = 0
    FIRST = 1
    LAST = 2


Interpreter = sys.executable
PathExpandedState: ExpandedState = ExpandedState.DISABLED
ExpandedSitePath = ''
LocalDir = './local'
ErrorsContainer = []

RequiredPackagesList = {'numpy': 'numpy',
                        'PIL': 'pillow',
                        **db.get_required_packages()
                        }
OptionalPackagesList = {'scipy': 'scipy',
                        'pywt': 'pywavelets',
                        'pillow_heif': 'pillow_heif',
                        **db.get_optional_packages()
                        }
AlgorithmsRequirements = {'average': [],
                          'dhash': [],
                          'phash': ['scipy'],
                          'whash': ['pywt']
                          }


def log_error(*errors: str):
    """Adds error(s) to global ErrorsContainer variable."""
    global ErrorsContainer
    for error in errors:
        ErrorsContainer.append(error)


def check_local_dir(create_if_absent: bool = False) -> bool:
    """Returns True if local dir exists or was created(if create_if_absent=True), False otherwise."""
    dir_exists = os.path.isdir(LocalDir)
    if not dir_exists and create_if_absent:
        try:
            os.mkdir(LocalDir, mode=0o774)
        except OSError:
            return False
        return os.path.isdir(LocalDir)
    return dir_exists


def get_abs_local_dir() -> str:
    """Returns absolute path to local directory."""
    return os.path.abspath(LocalDir)


def get_modified_env():
    if not check_local_dir():
        return None
    modified_env = os.environ
    modified_env['PYTHONUSERBASE'] = get_abs_local_dir()
    modified_env['_PIP_LOCATIONS_NO_WARN_ON_MISMATCH'] = '1'
    return modified_env


def change_python_path(new_state: ExpandedState) -> bool:
    global PathExpandedState, ExpandedSitePath
    if PathExpandedState == new_state:
        return True
    if not check_local_dir():
        return True
    if not ExpandedSitePath:
        try:
            result = subprocess.run(
                [Interpreter, '-m', 'site', '--user-site'],
                stderr=subprocess.PIPE, stdout=subprocess.PIPE, check=True, env=get_modified_env()
            )
            if len(result.stdout) == 0:
                return False
        except subprocess.CalledProcessError:
            return False
        ExpandedSitePath = result.stdout.decode('utf-8').rstrip('\n')
    try:
        sys.path.pop(sys.path.index(ExpandedSitePath))
    except (ValueError, IndexError):
        pass
    if new_state == ExpandedState.FIRST:
        sys.path.insert(0, ExpandedSitePath)
    elif new_state == ExpandedState.LAST:
        sys.path.append(ExpandedSitePath)
    importlib.invalidate_caches()
    PathExpandedState = new_state
    return True


def extend_module_path() -> bool:
    change_python_path(ExpandedState.LAST)
    if PathExpandedState == ExpandedState.LAST:
        return True
    return False


def import_package(name: str, expand_state=None, dest_sym_table=None, package=None) -> bool:
    previous_state = PathExpandedState
    if expand_state is not None:
        change_python_path(expand_state)
    try:
        if dest_sym_table is None:
            importlib.import_module(name, package)
        else:
            dest_sym_table[name] = importlib.import_module(name, package)
        return True
    except (ModuleNotFoundError, AttributeError, ImportError, ValueError):
        pass
    finally:
        change_python_path(previous_state)
    return False


def import_packages(packages_names: list, dest_sym_table=None) -> list:
    results = []
    for package_name in packages_names:
        if not import_package(package_name, dest_sym_table=dest_sym_table):
            results.append(package_name)
    return results


def check_video() -> list:
    video_apps = []
    error, _ffmpeg_version = get_version('ffmpeg')
    if error:
        video_apps.append('ffmpeg')
    error, _ffprobe_version = get_version('ffprobe')
    if error:
        video_apps.append('ffprobe')
    return video_apps


def check_packages(packages_list: dict) -> dict:
    missing = {}
    for import_name, install_name in packages_list.items():
        if not import_package(import_name, expand_state=ExpandedState.LAST):
            missing[import_name] = install_name
    return missing


def get_installed_algorithms_list() -> list:
    available = []
    if not check_packages(RequiredPackagesList):
        for algo_name, algo_requirements in AlgorithmsRequirements.items():
            algo_ok = True
            for import_name in algo_requirements:
                if not import_package(import_name, expand_state=ExpandedState.LAST):
                    algo_ok = False
                    break
            if algo_ok:
                available.append(algo_name)
    return available


def get_all_boost_packages() -> dict:
    ret = {**db.get_boost_packages(), 'hexhamming': 'hexhamming'}
    return ret


def add_package_info(packages_list: dict) -> dict:
    formatted_packages_list = {}
    for import_name, install_name in packages_list.items():
        modules = {}
        if import_package(import_name, dest_sym_table=modules):
            version = 'unknown'
            if hasattr(modules[import_name], '__version__'):
                version = modules[import_name].__version__
            if ExpandedSitePath and str(modules[import_name].__file__).lower().startswith(ExpandedSitePath.lower()):
                formatted_packages_list[import_name] = {'package': install_name,
                                                        'location': 'local',
                                                        'version': str(version)}
            else:
                formatted_packages_list[import_name] = {'package': install_name,
                                                        'location': 'global',
                                                        'version': str(version)}
        else:
            formatted_packages_list[import_name] = {'package': install_name,
                                                    'location': 'none',
                                                    'version': 'none'}
    return formatted_packages_list


def is_pip_present(only_global: bool = False) -> bool:
    mod_env = None
    if not only_global:
        mod_env = get_modified_env()
    try:
        result = subprocess.run(
            [Interpreter, '-m', 'pip', '--version', '--disable-pip-version-check'],
            stderr=subprocess.PIPE, stdout=subprocess.PIPE, check=False, env=mod_env
        )
        if len(result.stderr) == 0:
            full_reply = result.stdout.decode('utf-8')
            if PIP_DEBUG == 1:
                print('Pip version:', full_reply)
            m_groups = re.search(r'pip\s*(\d+\.\d+\.\d*)',
                                 full_reply, flags=re.MULTILINE + re.IGNORECASE)
            if m_groups is None:
                return False
            pip_version = tuple(map(int, str(m_groups.groups()[0]).split('.')))
            if pip_version[0] < 19:
                return False
            return True
    except (OSError, ValueError, TypeError, subprocess.TimeoutExpired) as exception_info:
        log_error(f'pip_version raised {type(exception_info).__name__}: {str(exception_info)}')
    return False


def download_pip(url: str) -> bool:
    n_download_clients = 2
    if not check_local_dir(create_if_absent=True):
        log_error('Cant create local dir.')
        return False
    for _ in range(2):
        try:
            subprocess.run(
                ['curl', url, '-o', f'{LocalDir}/get-pip.py'],
                timeout=90, stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL, check=True
            )
            return True
        except subprocess.CalledProcessError:
            break
        except FileNotFoundError:
            n_download_clients -= 1
            break
        except subprocess.TimeoutExpired:
            pass
    for _ in range(2):
        try:
            subprocess.run(
                ['wget', url, '-O', f'{LocalDir}/get-pip.py'],
                timeout=90, stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL, check=True
            )
            return True
        except subprocess.CalledProcessError:
            break
        except FileNotFoundError:
            n_download_clients -= 1
            break
        except subprocess.TimeoutExpired:
            pass
    if not n_download_clients:
        log_error('Both curl and wget cannot be found.')
    return False


def install_pip() -> bool:
    if not download_pip('https://bootstrap.pypa.io/get-pip.py'):
        log_error('Cant download pip installer.')
        return False
    try:
        result = subprocess.run(
            [Interpreter, f'{LocalDir}/get-pip.py',
             '--user', '--cache-dir', get_abs_local_dir(), '--no-warn-script-location'],
            stderr=subprocess.PIPE, stdout=subprocess.PIPE, check=False, env=get_modified_env()
        )
        if PIP_DEBUG == 1:
            print('stderr:', result.stderr.decode('utf-8'))
            print('stdout:', result.stdout.decode('utf-8'))
        full_reply = result.stderr.decode('utf-8')
        reply = re.sub(r'^\s*WARNING:.*\n?', '', full_reply, flags=re.MULTILINE + re.IGNORECASE)
        if len(reply) == 0:
            return True
        log_error(f'get-pip returned:\n{full_reply}')
    except (OSError, ValueError, TypeError, subprocess.TimeoutExpired) as exception_info:
        log_error(f'install_pip raised {type(exception_info).__name__}: {str(exception_info)}')
    finally:
        try:
            os.remove(f'{LocalDir}/get-pip.py')
        except OSError:
            log_error('Cant remove `get-pip.py`.')
    return False


def pip_call(parameters, user_cache: bool = True) -> [bool, str]:
    try:
        etc = ['--disable-pip-version-check']
        etc += EXTRA_PIP_ARGS
        if user_cache:
            etc += ['--user', '--cache-dir', get_abs_local_dir(), '--no-warn-script-location']
        result = subprocess.run(
            [Interpreter, '-m', 'pip'] + parameters + etc,
            stderr=subprocess.PIPE, stdout=subprocess.PIPE, check=False, env=get_modified_env()
        )
        if PIP_DEBUG == 1:
            print('stderr:', result.stderr.decode('utf-8'))
            print('stdout:', result.stdout.decode('utf-8'))
        full_reply = result.stderr.decode('utf-8')
        reply = re.sub(r'^\s*WARNING:.*\n?', '', full_reply, flags=re.MULTILINE + re.IGNORECASE)
        if len(reply) == 0:
            return True, result.stdout.decode('utf-8')
        return False, result.stderr.decode('utf-8')
    except (OSError, ValueError, TypeError, subprocess.TimeoutExpired) as exception_info:
        return False, f'pip_call raised {type(exception_info).__name__}: {str(exception_info)}'


def check() -> dict:
    ret = {'required': check_packages(RequiredPackagesList),
           'optional': check_packages(OptionalPackagesList),
           'boost': check_packages(get_all_boost_packages()),
           'available_algorithms': get_installed_algorithms_list(),
           'video_required': check_video(),
           'errors': ErrorsContainer,
           'warnings': db.get_warnings(),
           'installed_list': {
               'required': add_package_info(RequiredPackagesList),
               'optional': add_package_info(OptionalPackagesList),
               'boost': add_package_info(get_all_boost_packages())}
           }
    if not ErrorsContainer:
        if not ret['required']:
            log_error(*db.check_db())
            ret['errors'] = ErrorsContainer
            ret['warnings'] = db.get_warnings()
    return ret


def install(packages_list: dict) -> int:
    if not is_pip_present():
        if not install_pip():
            log_error('Cant install local pip.')
            return 1
        if not is_pip_present():
            log_error('Cant run pip after local install.')
            return 1
    ret = 0
    if packages_list:
        if not check_local_dir(create_if_absent=True):
            log_error('Cant create local dir for packages.')
            return 1
    for package in packages_list:
        call_result, message = pip_call(['install', packages_list[package]])
        if not call_result:
            log_error(f'Error during install {package}({packages_list[package]}).\nError:\n{message}')
            ret = 1
    if ret:
        return 1
    importlib.invalidate_caches()
    missing_packages = check_packages(packages_list)
    if len(missing_packages) > 0:
        log_error(f'After install, cant find these packages: {missing_packages}')
        return 1
    return 0


def update(packages: list) -> int:
    ret = 0
    if not is_pip_present(only_global=True):
        call_result, message = pip_call(['install', '--upgrade', 'pip'])
        if not call_result:
            log_error(f'Error during upgrading pip.\nError:\n{message}')
            ret = 1
    for package in packages:
        call_result, message = pip_call(['install', '--upgrade', package])
        if not call_result:
            log_error(f'Error during upgrading {package}.\nError:\n{message}')
            ret = 1
    return ret


def delete(packages: list) -> int:
    ret = 0
    for package in packages:
        call_result, message = pip_call(['uninstall', package, '-y'], user_cache=False)
        if not call_result:
            log_error(f'Error during uninstall {package}.\nError:\n{message}')
            ret = 1
    return ret


def get_dict_by_args(arguments) -> dict:
    ret = {}
    if 'required' in arguments:
        ret.update(RequiredPackagesList)
    if 'optional' in arguments:
        ret.update(OptionalPackagesList)
    if 'boost' in arguments:
        ret.update(get_all_boost_packages())
    return ret


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    parser = argparse.ArgumentParser(description='Module for checking/installing needed packages.',
                                     add_help=True)
    group = parser.add_mutually_exclusive_group()
    choices = ['required', 'optional', 'boost']
    group.add_argument('--check', dest='check', action='store_true',
                       help='Check and return list of missing/available packages.')
    group.add_argument('--install', dest='install', nargs='+', choices=choices, type=str,
                       help='Install specified packages lists.')
    group.add_argument('--update', dest='update', nargs='+', type=str,
                       help='Update packages with specified names.')
    group.add_argument('--delete', dest='delete', nargs='+', type=str,
                       help='Delete packages with specified names.')
    args = parser.parse_args()
    exit_code = 0
    if args.check:
        print(json.dumps(check()))
    elif args.install:
        exit_code = install(check_packages(get_dict_by_args(args.install)))
        print(json.dumps(check()))
    elif args.update:
        exit_code = update(args.update)
        print(json.dumps(check()))
    elif args.delete:
        exit_code = delete(args.delete)
        print(json.dumps(check()))
    sys.exit(exit_code)
