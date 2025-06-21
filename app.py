from flask import Flask, request, jsonify, render_template
import os
import json

app = Flask(__name__)

JSON_LOG = os.path.join(os.path.dirname(__file__), "orders.json")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/fib')
def fib():
    return render_template('fib.html')


@app.route('/add-order', methods=["POST"])
def add_order():
    data = request.get_json()
    print("Received data:", data)

    # Load existing orders if file exists
    if os.path.exists(JSON_LOG):
        with open(JSON_LOG, "r") as file:
            try:
                orders = json.load(file)
            except json.JSONDecodeError:
                orders = []
    else:
        orders = []

    # Add new order
    orders.append(data)

    # Write back to file
    with open(JSON_LOG, "w") as file:
        json.dump(orders, file, indent=2)

    return jsonify({'message': f"{data['referenceId']} saved successfully!"}), 200

@app.route('/view-orders')
def view_orders():
    if os.path.exists(JSON_LOG):
        with open(JSON_LOG, "r") as file:
            try:
                data = json.load(file)
                print("Orders sent:", data[:2], "...")
                return jsonify(data)
            except json.JSONDecodeError:
                return jsonify([])  # Return empty list if file is corrupt
    return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)
