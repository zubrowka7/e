from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

# Зберігаємо останні дані в пам'яті
latest_data = {
    "voltage": 0,
    "current": 0,
    "power": 0,
    "energy": 0,
    "frequency": 0,
    "pf": 0
}

@app.route("/api/data", methods=["POST"])
def receive_data():
    global latest_data
    data = request.json
    if data:
        latest_data = data
        return jsonify({"status":"ok"})
    return jsonify({"status":"error"}), 400

@app.route("/api/latest")
def get_latest():
    return jsonify(latest_data)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)