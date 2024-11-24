import logging
import base64
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_login import (
    LoginManager,
    UserMixin,
    login_user,
    logout_user,
    current_user,
    login_required,
)
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from dotenv import load_dotenv  # Allow us to load our .env variables into script
from config import Config
from flask_cors import CORS
from pymongo import MongoClient
from datetime import timedelta

import os
import json
import secrets

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Base Flask Config
app.config["ENV"] = "development"
app.config["DEBUG"] = True
# not sure what thsi is for, i also dont have any secret_key in .env
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

app.config["MONGO_URI"] = os.getenv("MONGO_URI")  # Connect with MongoDB
app.config.from_object(Config)

# Flask Session Config
app.config["SESSION_TYPE"] = "mongodb"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_MONGODB"] = MongoClient(app.config["MONGO_URI"])
app.config["SESSION_MONGODB_DB"] = "sakeDatabase"
app.config["SESSION_MONGODB_COLLECT"] = "sessions"
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(
    hours=1
)  # does this delete the sessions after one hour in mongodb?

mongo = PyMongo(app)
bcrypt = Bcrypt(app)

CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ACTIVE_TOKEN = None


def verify_token(token):
    global ACTIVE_TOKEN
    return token == ACTIVE_TOKEN


class Sake:
    def __init__(self, name, properties, image_base64):
        self.name = name
        self.properties = properties
        self.images_base64 = image_base64

    @staticmethod
    def get_all_sake():
        return mongo.db.sakes.find()

    @staticmethod
    def get_sake_by_id(sake_id):
        return mongo.db.sakes.find_one({"_id": ObjectId(sake_id)})

    @staticmethod
    def add_sake(sake):
        return mongo.db.sakes.insert_one(sake)

    @staticmethod
    def update_sake(sake_id, updates):
        return mongo.db.sakes.update_one({"_id": ObjectId(sake_id)}, {"$set": updates})

    @staticmethod
    def delete_sake(sake_id):
        return mongo.db.sakes.delete_one({"_id": ObjectId(sake_id)})


@app.route("/sake", methods=["POST"])
def add_sake():
    try:
        token = request.headers.get("Authorization")
        print("TOKEN: ", token)
        if not verify_token(token):
            return jsonify({"error": "NOT AUTHENTICATED"}), 403

        print("receiving new sake info")
        data = request.form
        print(data)
        image_base64 = ""

        # If image exists, then add
        if "image" in request.files:
            file = request.files["image"]
            image_base64 = encode_image(file)

        new_sake = {
            "name": data.get("name"),
            "properties": {
                "region": data.get("region"),
                "brewery": data.get("brewery"),
                "sizes": data.get("sizes"),
                "taste": data.get("taste"),
                "pairing": data.get("pairing"),
                "style": data.get("style"),
                "price": data.get("price"),
                "alchohol": data.get("alchohol"),
                "riceType": data.get("riceType"),
                "polish": data.get("polish"),
                "fermentationStyle": data.get("fermentationStyle"),
                "body": data.get("body"),
                "inStock": data.get("inStock"),
                "expectedDate": data.get("expectedDate"),
            },
            "image_base64": image_base64 if image_base64 else "",
            "description": data.get("description"),
            "shortMessage": data.get("shortMessage"),
            "new": data.get("new"),
        }
        result = Sake.add_sake(new_sake)
        return jsonify({"message": "Sake added successfully"}), 201
    except Exception as e:
        logger.error("Error adding sake: %s", str(e))
        return jsonify({"error": str(e)}), 500


def encode_image(file):
    return base64.b64encode(file.read()).decode("utf-8")


@app.route("/sake", methods=["GET"])
def get_all_sake():
    try:
        sakes = list(Sake.get_all_sake())
        for sake in sakes:
            sake["_id"] = str(sake["_id"])
        return jsonify(sakes)
    except Exception as e:
        logger.error("Error fetching sakes: %s", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/sake/<id>", methods=["GET"])
def get_sake_by_id(id):
    try:
        sake = Sake.get_sake_by_id(ObjectId(id))
        if sake:
            sake["_id"] = str(sake["_id"])
            return jsonify(sake)
        return jsonify({"error": "Sake not found"}), 404
    except Exception as e:
        logger.error("Error fetching sake by ID: %s", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/sake/<id>", methods=["PUT"])
def update_sake(id):
    try:
        token = request.headers.get("Authorization")
        if not verify_token(token):
            return jsonify({"error": "UNAUTHORIZED"}), 403

        data = request.form
        print(data)
        image_base64 = ""

        updates = {
            "name": data.get("name"),
            "properties": {
                "region": data.get("region"),
                "brewery": data.get("brewery"),
                "sizes": data.get("sizes"),
                "taste": data.get("taste"),
                "pairing": data.get("pairing"),
                "style": data.get("style"),
                "price": data.get("price"),
                "alchohol": data.get("alchohol"),
                "riceType": data.get("riceType"),
                "polish": data.get("polish"),
                "fermentationStyle": data.get("fermentationStyle"),
                "body": data.get("body"),
                "inStock": data.get("inStock"),
                "expectedDate": data.get("expectedDate"),
            },
            "description": data.get("description"),
            "shortMessage": data.get("shortMessage"),
            "new": data.get("new"),
        }

        # If image is uploaded, then update, else don't change the prev image!
        if "image" in request.files:
            file = request.files["image"]
            if file:
                image_base64 = encode_image(file)
                updates["image_base64"] = image_base64

        result = Sake.update_sake(ObjectId(id), updates)
        if result.matched_count == 0:
            return jsonify({"error": "Sake not found"}), 404
        return jsonify({"message": "Sake edited successfully"}), 201
    except Exception as e:
        logger.error("Error updating sake: %s", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/sake/<id>", methods=["DELETE"])
def delete_sake(id):
    try:
        token = request.headers.get("Authorization")
        if not verify_token(token):
            return jsonify({"error": "UNAUTHORIZED"}), 403
        result = Sake.delete_sake(ObjectId(id))
        if result.deleted_count == 0:
            return jsonify({"error": "Sake not found"}), 404
        return jsonify({"message": "Sake deleted"}), 200
    except Exception as e:
        logger.error("Error deleting sake: %s", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/login", methods=["POST"])
def login():
    data = request.form
    print(data)
    global ACTIVE_TOKEN
    # Add to ENV!!!!!!!
    if data.get("username") == os.getenv("LOGIN_USER") and data.get(
        "password"
    ) == os.getenv("LOGIN_PW"):
        # if admin credentials are ccorrect, we return a secret token
        ACTIVE_TOKEN = secrets.token_hex(32)
        return jsonify({"token": ACTIVE_TOKEN}), 200
    return jsonify({"error": "could not authenticate"}), 401


@app.route("/logout", methods=["POST"])
def logout():
    # Set the active token to be none
    global ACTIVE_TOKEN
    ACTIVE_TOKEN = None
    return jsonify({"message": "Logged out successfully"}), 200


if __name__ == "__main__":
    app.run(debug=True)
