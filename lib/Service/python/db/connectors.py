import time
import traceback


def create_connection(config: dict, provider: str, error_out: list):
    connection = None
    try:
        if provider == 'pymysql':
            from . import pymysql
            if len(config['usock']):
                connection = pymysql.connect(unix_socket=config['usock'],
                                             user=config['dbuser'],
                                             password=config['dbpassword'],
                                             database=config['dbname'],
                                             charset='utf8mb4')
            else:
                port = int(config['dbport']) if len(config['dbport']) else 3306
                connection = pymysql.connect(host=config['dbhost'],
                                             port=port,
                                             user=config['dbuser'],
                                             password=config['dbpassword'],
                                             database=config['dbname'],
                                             charset='utf8mb4')
        elif provider == 'pg8000':
            from .pg8000 import dbapi
            if len(config['usock']):
                connection = dbapi.connect(unix_sock=config['usock'],
                                           user=config['dbuser'],
                                           password=config['dbpassword'],
                                           database=config['dbname'])
            else:
                port = int(config['dbport']) if len(config['dbport']) else 5432
                connection = dbapi.connect(host=config['dbhost'],
                                           port=port,
                                           user=config['dbuser'],
                                           password=config['dbpassword'],
                                           database=config['dbname'])
        else:
            raise NotImplementedError(f"create_connection: unknown provider value: {provider}")
    except Exception as e:
        internal_handle_db_connect_exception(e, error_out)
    return connection


def internal_handle_db_connect_exception(e, error_out: list = None):
    exception_name = type(e).__name__
    exception_info = str(traceback.format_exc())
    if error_out is not None:
        error_out.append('db_exception_handler:')
        for each_line in exception_info.splitlines():
            error_out.append(each_line)
    else:
        print('db_exception_handler:', exception_info)
    if exception_name in ('InterfaceError', 'OperationalError', 'DatabaseError'):
        time.sleep(0.5)
    else:
        raise e from None
