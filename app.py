import logging
import base64
from flask import Flask, request, jsonify, render_template, redirect, url_for, flash
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from flask_pymongo import PyMongo
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv

from config import Config
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import os

# import sidebar filters from filters file
from filters import filters

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['ENV'] = 'development'
app.config['DEBUG'] = True
# need to set key in order to login
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
# app.config['MONGO_URI'] = 'mongodb://localhost:27017/your_db_name'
app.config.from_object(Config)

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
@cross_origin()
def add_sake():
    try:
        data = request.form
        file = request.files['image']

        # logger.info('Form data: %s', data)
        image_base64 = encode_image(file)

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
                'alchohol': data.get('alchohol')
            },
            'image_base64': image_base64,
            'description': data.get('description')
        }
        result = Sake.add_sake(new_sake)
        return jsonify({
            'message': 'Sake added successfully',
            # 'id': str(result.inserted_id)
        }), 201
    except Exception as e:
        app.logger.error('Error adding sake: %s', str(e))
        return jsonify({'error': str(e)}), 500


def encode_image(file):
    return base64.b64encode(file.read()).decode('utf-8')


@app.route('/')
def index():
    try:
        sakes = list(Sake.get_all_sake())
        # logger.info('Filters: %s', filters)
        return render_template('index.html', sakes=sakes, filters=filters)
    except Exception as e:
        logger.error('Error rendering index: %s', str(e))
        return str(e), 500


@app.route('/form')
@login_required
def form():
    return render_template('form.html')


@app.route('/sake', methods=['GET'])
@login_required
def get_all_sake():
    try:
        sakes = Sake.get_all_sake()
        result = []
        for sake in sakes:
            sake['_id'] = str(sake['_id'])
            result.append(sake)
        # logger.info('result: %s', result)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/sake/<id>', methods=['GET'])
@login_required
def get_sake_by_id(id):
    try:
        sake = Sake.get_sake_by_id(ObjectId(id))
        if sake:
            sake['_id'] = str(sake['_id'])
            return jsonify(sake)
        else:
            return jsonify({'error': 'Sake not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/sake/<id>', methods=['PUT'])
@cross_origin()
@login_required
def update_sake(id):
    try:
        data = request.json
        # logger.info(data)
        updates = {
            'name': data.get('name'),
            'properties': {
                'region': data['properties'].get('region'),
                'brewery': data['properties'].get('brewery'),
                'alchohol': data['properties'].get('alchohol'),
                'sizes': data['properties'].get('sizes'),
                'taste': data['properties'].get('taste'),
                'pairing': data['properties'].get('pairing'),
                'style': data['properties'].get('style'),
                'price': data['properties'].get('price'),
            },
            'description': data.get('description')
        }

        if 'image' in request.files:
            file = request.files['image']
            image_base64 = encode_image(file)
            updates['image_base64'] = image_base64

        result = Sake.update_sake(ObjectId(id), updates)

        if result.matched_count == 0:
            return jsonify({'error': 'Sake not found'}), 404
        return jsonify(updates)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/sake/<id>', methods=['DELETE'])
@cross_origin()
@login_required
def delete_sake(id):
    try:
        result = Sake.delete_sake(ObjectId(id))
        if result.deleted_count == 0:
            return jsonify({'error': 'Sake not found'}), 404
        return jsonify({'message': 'Sake deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = mongo.db.users.find_one({"username": username})

        if user and bcrypt.check_password_hash(user['password'], password):
            user_obj = User(user['_id'])
            login_user(user_obj)
            return redirect(url_for('index'))

        flash('invalid username or passwordzzzz')

    return render_template('login.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(debug=True)
