from os import rename
import flask
from flask import render_template
import json
import datetime

app = flask.Flask(__name__)
app.config["DEBUG"] = True


bags = []


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


@app.route('/api/v1/resources/bag/', methods=['POST'])
def save_bag():
    data = flask.request.get_json()
    if is_time_between():
        return json.dumps({'error': 'service unavailable'}), 503
    else:
        # append or replace bag
        print(str(data['id']))
        for bag in bags:
            if str(bag['id']) == str(data['id']):
                bags.remove(bag)
        bags.append(data)
        return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}
        

@app.route('/api/v1/resources/bag/<id>', methods=['GET'])
def get_bag(id):
    id = id
    if is_time_between():
        return json.dumps({'error': 'service unavailable'}), 503
    else:
        if(len(bags) > 0):
            for bag in bags:
                if str(bag['id']) == str(id):
                    return render_template("bag.html", data=bag)
            return json.dumps({'error': 'bag not found'}), 404
        else:
            return json.dumps({'error': 'bag not found'}), 404


if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=5000)
