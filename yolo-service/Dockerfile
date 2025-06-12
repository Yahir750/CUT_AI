FROM python:3.10-slim
WORKDIR /app
COPY yolo.py .
RUN pip install flask numpy opencv-python-headless
CMD ["python", "detect.py"]
