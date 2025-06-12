from flask import Flask, request, jsonify
import numpy as np
import cv2
import os

app = Flask(__name__)

@app.route('/detect', methods=['POST'])
def detect():
    # Por ahora solo responde con un mensaje falso
    return jsonify({"msg": "Detección no implementada aún"})

if __name__ == "__main__":
    app.run(host="0.0.0.0")
