FROM python:3.10-slim

WORKDIR /app

# Install system dependencies if any are needed (e.g. build-essential, curl)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install python packages
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir --default-timeout=1000 -r backend/requirements.txt

# Copy ML service script and folders
COPY backend/ ./backend/

# Expose ML port
EXPOSE 8790

# Run the ML service
CMD ["python", "backend/ml_service.py"]
