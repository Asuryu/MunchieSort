import flask
import json
import datetime

app = flask.Flask(__name__)
app.config["DEBUG"] = True

# check if time is between 00:00 and 00:15
def is_time_between():
    now = datetime.datetime.now()
    start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end = now.replace(hour=0, minute=15, second=0, microsecond=0)
    return start <= now <= end

@app.route('/api/v1/resources/items', methods=['GET'])
def get_items():
    if is_time_between():
        return json.dumps({'error': 'service unavailable'}), 503
    else:
        with open("items.json", "r") as f:
            data = json.load(f)
        return data

if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=5000)
