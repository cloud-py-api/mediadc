"""
Currently it is a dev file for some features testing. Not included in releases, only for devs.
"""

import os
import platform
import sys
from pathlib import Path

mdc_py_path = str(Path(os.path.dirname(os.path.abspath(__file__))).parent)
sys.path.append(mdc_py_path)
import install

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


if __name__ == "__main__":
    print("OS:", platform.platform())
    print("Interpreter:", sys.executable, sys.version_info)
    print("CPU:", platform.machine())
    sys.modules["install"].PIP_DEBUG = 1
    print("Pip present:", install.is_pip_present())
    print("Testing install of DB packages....")
    packages = {"cryptography": "cryptography", "nacl": "pynacl", "asn1crypto": "asn1crypto"}
    print(f"call check_packages with: {packages}")
    check_packages_result = install.check_packages(packages)
    if check_packages_result:
        print(f"call install with: {check_packages_result}")
        if install.install(check_packages_result) != 0:
            print("install return error.")
            print(f"ErrorsContainer:{install.ErrorsContainer}")
            sys.exit(3)
    else:
        print("they are all already installed!")
    print("Testing install of core + boost packages....")
    packages = {**install.RequiredPackagesList, **install.OptionalPackagesList, **install.get_all_boost_packages()}
    # sys.modules['install'].EXTRA_PIP_ARGS = ['--no-binary', ':all:']
    # packages = {'pyheif': 'pyheif'}
    print(f"call check_packages with: {packages}")
    check_packages_result = install.check_packages(packages)
    if check_packages_result:
        print(f"call install with: {check_packages_result}")
        if install.install(check_packages_result) != 0:
            print("install return error.")
            print(f"ErrorsContainer:{install.ErrorsContainer}")
            sys.exit(4)
    else:
        print("they are all already installed!")
    print("All looks fine!")
    sys.exit(0)
