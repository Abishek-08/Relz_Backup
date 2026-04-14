# Guidelines to run the FastAPI application in your local OS

### <ins>System Requirements:</ins>

**Python:** 3.x (Recommend >= 3.9)\
**pip:** Latest version (pip install --upgrade pip)\
**Operating System:** Windows/Linux/macOS\
**Virtual Environment:** .venv (built into python >= 3.3)

### <ins>check python version:</ins>

**linux/ubuntu:** python3 --version\
**windows:** py --version

## Guidelines to run the FastAPI application in linux/ubuntu:

### <ins>creating virtual environment in linux/ubuntu:</ins>

**Create virtual-env:** `python3 -m venv .venv` **_(create venv name as '.venv')_**\
**Activating virtual-env:** `source [venv-name]/bin/activate`\
**Install requirements.txt file:** `pip install -r requirements.txt` **_(ensure you are activate the venv and then install the requirements.txt file)_**\
**To run the FastAPI app:** `python3 run.py`\
**To view the swagger for FastAPI app:** `http:localhost:portno/docs`\
**To stop the FastAPI app:** `ctrl+C`\
**Deactivate virtual-env:** `deactivate`

### <ins>creating virtual environment in windows:</ins>

**Create virtual-env:** `py -m venv .venv` **_(create venv name as '.venv')_**\
**Activating virtual-env:** `[venv-name]/Scripts/activate`\
**Install requirements.txt file:** `pip install -r requirements.txt` **_(ensure you are activate the venv and then install the requirements.txt file)_**\
**To run the FastAPI app:** `python3 run.py`\
**To view the swagger for FastAPI app:** `http:localhost:portno/docs`\
**To stop the FastAPI app:** `ctrl+C`\
**Deactivate virtual-env:** `deactivate`
