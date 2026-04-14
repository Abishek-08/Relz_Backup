# import logging
# from logging.handlers import RotatingFileHandler
# import os

# LOG_DIR = 'logs'
# os.makedirs(LOG_DIR, exist_ok=True)

# def get_logger() -> logging.Logger:
#     logger = logging.getLogger('app')
#     logger.setLevel(logging.INFO)

#     if not logger.handlers:
#         console_handler = logging.StreamHandler()
#         console_formatter = logging.Formatter(f"[%(asctime)s] [{'DETECT'}] [%(levelname)s] - %(message)s")
#         console_handler.setFormatter(console_formatter)

#         file_handler = RotatingFileHandler(
#             filename=os.path.join(LOG_DIR, 'app.log'),
#             maxBytes=1_000_000,
#             backupCount=5
#         )
#         file_formatter = logging.Formatter(f"[%(asctime)s] [{'DETECT'}] [%(levelname)s] - %(message)s")
#         file_handler.setFormatter(file_formatter)

#         logger.addHandler(console_handler)
#         logger.addHandler(file_handler)

#     return logger



import logging
import sys


def get_logger() -> logging.Logger:
    logger = logging.getLogger('app')
    logger.setLevel(logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(f"[%(asctime)s] [{'DETECT'}] [%(levelname)s] - %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)

    return logger


