import multiprocessing
import os
from distutils.util import strtobool

bind = "0.0.0.0:8000"

reload = bool(strtobool(os.getenv("GUNICORN_RELOAD", "false")))

workers = int(os.getenv("GUNICORN_WORKERS", multiprocessing.cpu_count() * 2))
threads = 1
