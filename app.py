from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

latest_data = {
    "voltage": 0,
    "current": 0,
    "power": 0,
    "energy": 0,
    "frequency": 0,
    "pf": 0
}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/data", methods=["POST"])
def receive_data():
    global latest_data
    latest_data = request.json
    print(latest_data)
    return {"status": "ok"}

@app.route("/api/latest")
def latest():
    return jsonify(latest_data)