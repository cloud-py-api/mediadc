import sys

import numpy
import pg8000
import pi_heif
import PIL
import pymysql
import pywt
import scipy
import nacl
import cryptography

from nc_py_api import __version__ as nc_py_api_version

from ._version import __version__
from .log import logger as log


def bundle_info():
    log.info("Python: %s", sys.version)
    log.info("nc_py_api: %s", nc_py_api_version)
    log.info("mediadc: %s", __version__)
    log.info("pg8000: %s", pg8000.__version__)
    log.info("pynacl: %s", nacl.__version__)
    log.info("cryptography: %s", cryptography.__version__)
    log.info("pymysql: %s", pymysql.__version__)
    log.info("pillow: %s", PIL.__version__)
    log.info("pi_heif: %s", pi_heif.__version__)
    log.info("numpy: %s", numpy.__version__)
    log.info("scipy: %s", scipy.__version__)
    log.info("pywavelets: %s", pywt.__version__)
