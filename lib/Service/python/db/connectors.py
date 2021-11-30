"""
File contains logic for establishing connection to DB.
"""

import time
import traceback


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


def create_connection(config: dict, provider: str, error_out: list = None):
    connection = None
    try:
        if provider == 'pymysql':
            from . import pymysql  # pylint: disable=import-outside-toplevel
            if len(config['usock']):
                connection = pymysql.connect(unix_socket=config['usock'],
                                             user=config['dbuser'],
                                             password=config['dbpassword'],
                                             database=config['dbname'],
                                             charset='utf8mb4')
            else:
                port = int(config['dbport']) if len(config['dbport']) else 3306
                host = config['dbhost'] if len(config['dbhost']) else "localhost"
                connection = pymysql.connect(host=host,
                                             port=port,
                                             user=config['dbuser'],
                                             password=config['dbpassword'],
                                             database=config['dbname'],
                                             charset='utf8mb4')
        elif provider == 'pg8000':
            from .pg8000 import dbapi  # pylint: disable=import-outside-toplevel
            if len(config['usock']):
                connection = dbapi.connect(unix_sock=config['usock'],
                                           user=config['dbuser'],
                                           password=config['dbpassword'],
                                           database=config['dbname'])
            else:
                port = int(config['dbport']) if len(config['dbport']) else 5432
                host = config['dbhost'] if len(config['dbhost']) else "localhost"
                connection = dbapi.connect(host=host,
                                           port=port,
                                           user=config['dbuser'],
                                           password=config['dbpassword'],
                                           database=config['dbname'])
        else:
            raise NotImplementedError(f"create_connection: unknown provider value: {provider}")
    except Exception as exception_info:
        internal_handle_db_connect_exception(exception_info, error_out)
    return connection


def internal_handle_db_connect_exception(exception_info, error_out: list = None):
    exception_name = type(exception_info).__name__
    exception_info_str = str(traceback.format_exc())
    if error_out is not None:
        error_out.append('db_exception_handler:')
        for each_line in exception_info_str.splitlines():
            error_out.append(each_line)
    else:
        print('db_exception_handler:', exception_info_str)
    if exception_name in ('InterfaceError', 'OperationalError', 'DatabaseError'):
        time.sleep(0.5)
    else:
        raise exception_info from None


def test_connection(config: dict, provider: str, print_errors: bool = False) -> bool:
    errors_list = []
    try:
        connection = create_connection(config, provider, errors_list)
        if connection is not None:
            connection.close()
            return True
    except Exception as exception_info:
        if print_errors:
            print(exception_info)
    if print_errors:
        print(errors_list)
    return False
