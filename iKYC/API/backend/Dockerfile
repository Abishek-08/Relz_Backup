# Use stable Python base (Debian Bookworm)
FROM python:3.10-slim-bookworm
 
# Set workdir
WORKDIR /app
 
# Install OpenCV dependencies
RUN apt-get clean && rm -rf /var/lib/apt/lists/* \
    && apt-get update --fix-missing \
    && apt-get install -y --no-install-recommends \
       libgl1 \
       libglib2.0-0 \
       libsm6 \
       libxrender1 \
       libxext6 \
    && rm -rf /var/lib/apt/lists/*
 
# Copy dependencies first (layer caching)
COPY requirements.txt .
 
# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt
 
# Copy project files
COPY . .
 

# Create non-root user
RUN useradd -m appuser
USER appuser
 
 
# Run FastAPI app with uvicorn
CMD ["python", "run.py"]