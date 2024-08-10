from flask_pymongo import PyMongo
from bson.objectid import ObjectId

mongo = PyMongo()

class Sake:
    def __init__(self, name, properties):
        self.name = name
        self.properties = properties

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
