FROM python:3.10-slim
WORKDIR /app
COPY JWT.py .
RUN pip install flask flask-jwt-extended
CMD ["python", "app.py"]
