FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (needed for psycopg2)
RUN apt-get update && apt-get install -y \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# The code will be mounted as a volume in dev mode
COPY . .
