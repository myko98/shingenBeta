import logging
import base64
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from dotenv import load_dotenv
from config import Config
from flask_cors import CORS
import os
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['ENV'] = 'development'
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['MONGO_URI'] = os.getenv('MONGO_URI')
app.config.from_object(Config)

print(f"MONGO_URI: {os.getenv('MONGO_URI')}")

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class User(UserMixin):
    def __init__(self, user_id):
        self.id = user_id

@login_manager.user_loader
def load_user(user_id):
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        return User(user_id=str(user["_id"]))
    return None

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

@app.route('/sake', methods=['POST'])
def add_sake():
    try:
        data = request.form
        print(data)
        file = request.files['image']
        image_base64 = encode_image(file)

				# change to all lowercase plz
        new_sake = {
            'name': data.get('name'),
            'properties': {
                'region': data.get('region'),
                'brewery': data.get('brewery'),
                'sizes': data.get('sizes'),
                'taste': data.get('taste'),
                'pairing': data.get('pairing'),
                'style': data.get('style'),
                'price': data.get('price'),
                'alchohol': data.get('alchohol'),
                'riceType': data.get('riceType'),
                'polish': data.get('polish'),
                'fermentationStyle': data.get('fermentationStyle'),
                'body': data.get('body'),
                'inStock': data.get('inStock'),
                'expectedDate': data.get('expectedDate'),
            },
            'image_base64': image_base64,
            'description': data.get('description'),
            'shortMessage': data.get('shortMessage'),
            'new': data.get('new')
        }
        result = Sake.add_sake(new_sake)
        return jsonify({'message': 'Sake added successfully'}), 201
    except Exception as e:
        logger.error('Error adding sake: %s', str(e))
        return jsonify({'error': str(e)}), 500

def encode_image(file):
    return base64.b64encode(file.read()).decode('utf-8')

@app.route('/sake', methods=['GET'])
def get_all_sake():
    try:
        sakes = list(Sake.get_all_sake())
        for sake in sakes:
            sake['_id'] = str(sake['_id'])
        return jsonify(sakes)
    except Exception as e:
        logger.error('Error fetching sakes: %s', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/sake/<id>', methods=['GET'])
@login_required
def get_sake_by_id(id):
    try:
        sake = Sake.get_sake_by_id(ObjectId(id))
        if sake:
            sake['_id'] = str(sake['_id'])
            return jsonify(sake)
        return jsonify({'error': 'Sake not found'}), 404
    except Exception as e:
        logger.error('Error fetching sake by ID: %s', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/sake/<id>', methods=['PUT'])
@login_required
def update_sake(id):
    try:
        data = json.loads(request.form.get('data', '{}'))
        updates = {
            'name': data.get('name'),
            'properties': {
                'Region': data['properties'].get('Region'),
                'Brewery': data['properties'].get('Brewery'),
                'Sizes': data['properties'].get('Sizes'),
                'Taste': data['properties'].get('Taste'),
                'Pairing': data['properties'].get('Pairing'),
                'Style': data['properties'].get('Style'),
                'Price': data['properties'].get('Price'),
                'Alchohol': data['properties'].get('Alchohol'),
                'Rice type': data['properties'].get('Rice type'),
                'Polish': data['properties'].get('Polish'),
                'Fermentation style': data['properties'].get('Fermentation style'),
                'Body': data['properties'].get('Body'),
                'In stock': data['properties'].get('In stock'),
                'Expected date': data['properties'].get('Expected date'),
            },
            'description': data.get('description'),
            'new': data.get('new')
        }

        if 'image' in request.files:
            file = request.files['image']
            if file:
                image_base64 = encode_image(file)
                updates['image_base64'] = image_base64

        result = Sake.update_sake(ObjectId(id), updates)
        if result.matched_count == 0:
            return jsonify({'error': 'Sake not found'}), 404
        return jsonify(updates)
    except Exception as e:
        logger.error('Error updating sake: %s', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/sake/<id>', methods=['DELETE'])
# @login_required incorporate this again once u add auth
def delete_sake(id):
    try:
        result = Sake.delete_sake(ObjectId(id))
        if result.deleted_count == 0:
            return jsonify({'error': 'Sake not found'}), 404
        return jsonify({'message': 'Sake deleted'}), 200
    except Exception as e:
        logger.error('Error deleting sake: %s', str(e))
        return jsonify({'error': str(e)}), 500

@app.route("/login", methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.json.get('username')
        password = request.json.get('password')
        user = mongo.db.users.find_one({"username": username})

        if user and bcrypt.check_password_hash(user['password'], password):
            user_obj = User(user['_id'])
            login_user(user_obj)
            return jsonify({'message': 'Login successful'}), 200

        return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
