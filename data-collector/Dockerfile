FROM python:3.10-slim
WORKDIR /app
COPY collector.py .
RUN pip install flask mysql-connector-python
CMD ["python", "collector.py"]
