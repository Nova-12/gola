from __future__ import unicode_literals

from django.conf import settings
from pymongo import MongoClient
from pymongo.errors import InvalidId
from bson.objectid import ObjectId

import json

client = MongoClient(settings.PYMONGO_DATABASE_URI)
db = client[settings.PYMONGO_DATABASE_NAME]

class Poll:

    def __init__(self, poll_id, content):
        self.poll_id = poll_id
        self.content = content

    @staticmethod
    def create(data):
        object_id = db.poll.insert_one(data).inserted_id
        return Poll(str(object_id), data)

    @staticmethod
    def get(poll_id):
        try:
            object_id = ObjectId(poll_id)
        except InvalidId:
            return None

        document = db.poll.find_one({"_id": object_id})
        if not document:
            return None

        document.pop("_id", None) # remove ObjectId which is not json serializable.
        return Poll(poll_id, document)

