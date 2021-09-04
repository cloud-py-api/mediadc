import sys
import platform
import install


if __name__ == '__main__':
    print('OS:', platform.platform())
    print('Interpreter:', sys.executable, sys.version_info)
    print('CPU:', platform.machine())
    sys.modules['install'].PIP_DEBUG = 1
    print('Pip present:', install.is_pip_present())
    print('Testing install of DB packages....')
    packages = {'cryptography': 'cryptography', 'nacl': 'pynacl', 'asn1crypto': 'asn1crypto'}
    print(f'call check_packages with: {packages}')
    check_packages_result = install.check_packages(packages)
    if check_packages_result:
        print(f'call install with: {check_packages_result}')
        if install.install(check_packages_result) != 0:
            print('install return error.')
            print(f'ErrorsContainer:{install.ErrorsContainer}')
            exit(3)
    else:
        print(f'they are all already installed!')
    print('Testing install of core + boost packages....')
    packages = {**install.RequiredPackagesList, **install.OptionalPackagesList, **install.get_all_boost_packages()}
    # sys.modules['install'].EXTRA_PIP_ARGS = ['--no-binary', ':all:']
    # packages = {'pyheif': 'pyheif'}
    print(f'call check_packages with: {packages}')
    check_packages_result = install.check_packages(packages)
    if check_packages_result:
        print(f'call install with: {check_packages_result}')
        if install.install(check_packages_result) != 0:
            print('install return error.')
            print(f'ErrorsContainer:{install.ErrorsContainer}')
            exit(4)
    else:
        print(f'they are all already installed!')
    print('All looks fine!')
    exit(0)
