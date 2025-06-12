from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

# Rutas proxy simples para enviar al servicio correspondiente

@app.route('/login', methods=['POST'])
def login():
    resp = requests.post("http://auth-service:5000/login", json=request.json)
    return jsonify(resp.json()), resp.status_code

@app.route('/users')
def users():
    resp = requests.get("http://user-service:5000/users")
    return jsonify(resp.json()), resp.status_code

@app.route('/detect', methods=['POST'])
def detect():
    resp = requests.post("http://yolo-service:5000/detect", json=request.json)
    return jsonify(resp.json()), resp.status_code

if __name__ == "__main__":
    app.run(host="0.0.0.0")
