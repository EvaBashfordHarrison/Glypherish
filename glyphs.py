import os
import requests
from requests_oauthlib import OAuth1
from dotenv import load_dotenv
from flask import Flask, render_template, jsonify

load_dotenv() 
print("KEY:", os.getenv("NOUN_KEY"))
print("SECRET:", os.getenv("NOUN_SECRET"))

app = Flask(__name__)

auth = OAuth1(os.getenv("NOUN_KEY"), os.getenv("NOUN_SECRET"))

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/icon/<word>")
def icon(word):
    url = "https://api.thenounproject.com/v2/icon"
    response = requests.get(url, auth=auth, params={"query": word, "limit": 1})

    if response.status_code != 200:
        return jsonify({"word": word, "found": False}), 200 

    icons = response.json().get("icons", [])
    if not icons: 
        return jsonify({"word": word, "found": False})

    first = icons[0]
    return jsonify({
        "word": word, 
        "found": True, 
        "thumbnail_url": first.get("thumbnail_url"), 
        "attribution": first.get("attribution"), 
    })



if __name__ == "__main__":
    app.run(debug=True, port=5001)