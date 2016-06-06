from __future__ import unicode_literals

from django.conf import settings
from pymongo import MongoClient
from pymongo.errors import InvalidId
from bson.objectid import ObjectId

import json

client = MongoClient(settings.PYMONGO_DATABASE_URI)
db = client[settings.PYMONGO_DATABASE_NAME]

class BaseMongoObject(object):
    """
    Generic Mongodb object model.
    """
    def _attr_dict(self, attr_names):
        d = {}
        for name in attr_names:
            if name in dir(self):
                d[name] = self.__getattribute__(name)
        return d

class Poll:

    @staticmethod
    def create(data):
        object_id = db.poll.insert_one(data).inserted_id
        return str(object_id)

    @staticmethod
    def get(poll_id):
        try:
            object_id = ObjectId(poll_id)
        except InvalidId:
            return None

        poll = db.poll.find_one({"_id": object_id})
        if not poll:
            return None

        poll.pop("_id", None) # remove ObjectId which is not json serializable.
        return poll

