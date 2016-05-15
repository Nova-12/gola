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

class Poll(BaseMongoObject):
    """
    Poll object.
    Attributes:
        poll_id: string object id corresponding mongodb ObjectId
        title: string title
        noti_email: string notification email
        questions: List of questions
        finalized: boolean is it ready for getting votes
    """

    def __init__(self, poll_id, title, noti_email, questions, finalized):
        """
        Every Poll object must have those attributes defined.
        The values can be empty, but they must be defined anyway.
        """
        self.poll_id = poll_id
        self.title = title
        self.noti_email = noti_email
        self.questions = questions
        self.finalized = finalized

    def update_questions(self, questions):
        """
        Updates the question list
        """
        query = {"$set": {"questions": questions}}
        db.poll.update_one({"_id": ObjectId(self.poll_id)}, query)

    def finalize(self):
        """
        Finilize the poll. Now it cannot be edited.
        """
        query = {"$set": {"finalized": True}}
        db.poll.update_one({"_id": ObjectId(self.poll_id)}, query)

    @staticmethod
    def new(title="", noti_email="", questions=[]):
        """
        Create and insert new poll.
        Returns the new poll with valid poll_id.
        """
        json = {
            "title": title,
            "noti_email": noti_email,
            "questions": questions,
            "finalized": False,
        }
        object_id = db.poll.insert_one(json).inserted_id
        poll_id = str(object_id)
        poll = Poll(poll_id, title, noti_email, questions, False)
        return poll

    @staticmethod
    def get(poll_id):
        """
        Get a poll with given object id.
        Returns None if not found.
        """
        try:
            object_id = ObjectId(poll_id)
        except InvalidId:
            return None

        json = db.poll.find_one({"_id": object_id})
        if json:
            return Poll(str(json['_id']), json['title'], json['noti_email'],
                    json['questions'], json['finalized'])
        else:
            return None

    def json(self):
        attr_names = ["poll_id", "title", "noti_email", "questions", "finalized"];
        return json.dumps(self._attr_dict(attr_names))

    def __repr__(self):
        return "Poll_{}".format(self.poll_id)

    def __str__(self):
        s  = "{}: {}, {}".format(repr(self), self.title, self.noti_email)
        s += ", {} questions".format(len(self.questions))
        s += ", {}finalized".format("" if self.finalized else "not ")
        return s
