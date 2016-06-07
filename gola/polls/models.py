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
        """
        poll input example:
        { "title": "customer satisfaction survey",
          "noti_email": "aaa@bbb.com",
          "noti_count": 7,
          "questions": [...] }

        question example:
        { "options": [...] }
        """

        # Initialize counts
        for question in data['questions']:
            votes = [0] * len(question['options'])
            question['votes'] = votes
        data['vote_count'] = 0

        # Insert into DB
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

    def vote(self, answers):
        """
        input example:
        [ {"questionIdx": 0, "choice": [0,3]},
          {"questionIdx": 1, "choice": [1]} ]
        """
        def incr_one(questionIdx, optionIdx):
            question = self.content['questions'][questionIdx]
            question['votes'][optionIdx] += 1

        # Increment counts
        for answer in answers:
            questionIdx = int(answer['questionIndex'])
            for choice in answer['choice']:
                optionIdx = int(choice)
                incr_one(questionIdx, optionIdx)

        # Update DB
        query = {'$set': {'questions': self.content['questions']}}
        db.poll.update_one({"_id": ObjectId(self.poll_id)}, query)

        # Increment vote count
        self.content['vote_count'] += 1

        # Update DB
        query = {'$inc': {'vote_count': 1}}
        db.poll.update_one({"_id": ObjectId(self.poll_id)}, query)

    def noti_needed(self):
        vote_count = self.content['vote_count']
        noti_count = self.content['noti_count']
        if vote_count == noti_count:
            return True
        return False

    def result_dump(self):
        counts = []
        for question in self.content['questions']:
            answers = []
            for vote in question['votes']:
                answers.append({'total': vote}) 
            counts.append({'answers': answers})

        result = {
            'pollID': self.poll_id,
            'participantNum': self.content['vote_count'],
            'results': counts
        }
        return result
