import logging
from logging.handlers import RotatingFileHandler
import os
 
LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)
 
def get_service_logger(service_name: str) -> logging.Logger:
    logger = logging.getLogger(service_name)
    logger.setLevel(logging.INFO)
 
    if not logger.handlers:
        # Console handler
        console_handler = logging.StreamHandler()
        console_formatter = logging.Formatter(f"[%(asctime)s] [{service_name.upper()}] [%(levelname)s] - %(message)s")
        console_handler.setFormatter(console_formatter)
 
        # File handler per service
        file_handler = RotatingFileHandler(
            filename=os.path.join(LOG_DIR, f"{service_name}.log"),
            maxBytes=1_000_000,
            backupCount=5
        )
        file_formatter = logging.Formatter(f"[%(asctime)s] [{service_name.upper()}] [%(levelname)s] - %(message)s")
        file_handler.setFormatter(file_formatter)
 
        logger.addHandler(console_handler)
        logger.addHandler(file_handler)
 
    return logger
 