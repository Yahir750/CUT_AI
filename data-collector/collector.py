from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/save', methods=['POST'])
def save():
    data = request.json
    print(f"Recibido: {data}")
    return jsonify({"status": "ok", "msg": "Guardado simulado"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
