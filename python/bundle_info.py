import sys

import numpy
import pi_heif
import PIL
import pywt
import scipy

from nc_py_api import __version__ as nc_py_api_version

from ._version import __version__
from .log import logger as log


def bundle_info():
    log.info("Python: %s", sys.version)
    log.info("nc_py_api: %s", nc_py_api_version)
    log.info("mediadc: %s", __version__)
    log.info("pillow: %s", PIL.__version__)
    log.info("pi_heif: %s", pi_heif.__version__)
    log.info("numpy: %s", numpy.__version__)
    log.info("scipy: %s", scipy.__version__)
    log.info("pywavelets: %s", pywt.__version__)
