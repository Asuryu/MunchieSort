import flask
import json

app = flask.Flask(__name__)
app.config["DEBUG"] = True

@app.route('/api/v1/resources/items', methods=['GET'])
def get_items():
    with open("items.json", "r") as f:
        data = json.load(f)
    return data

app.run()