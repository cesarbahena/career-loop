# Use a slim Python base image
FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY ./app /app/app

# This container is intended to be run as a one-off task.
# The command to execute the scraper will be provided at runtime.
# For example: docker run <image> python app/main.py
CMD ["python", "-c", "print('Scraper container ready. Please provide a command to run.')"]
