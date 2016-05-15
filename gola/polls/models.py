from __future__ import unicode_literals

from django.conf import settings
from pymongo import MongoClient

client = MongoClient(settings.PYMONGO_DATABASE_URI)
db = client[settings.PYMONGO_DATABASE_NAME]
