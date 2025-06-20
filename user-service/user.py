from flask import Flask

app = Flask(__name__)

@app.route("/users")
def get_users():
    return {"users": ["user1", "user2"]}

if __name__ == "__main__":
    app.run(host="0.0.0.0")
