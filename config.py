import os


class Config:
    # 07 29 - I set the MONGO_URI, which points to a mongo cluster, so if you want to go back to localhost, just use localhost url vs MONGO_URI
    MONGO_URI = os.getenv(
        'MONGO_URI', 'mongodb://localhost:27017/sakeDatabase')
    # MONGO_URI = 'mongodb://localhost:27017/sakeDatabase'
