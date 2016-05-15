from django.shortcuts import render
from django.http import HttpResponse

from .models import Poll

def index(request):
    return HttpResponse("Hi!")

def new(request):
    poll = Poll.new("aaaa", "bbbb@cccc.com")
    return HttpResponse(str(poll))

def get(request, poll_id):
    poll = Poll.get(poll_id)
    return HttpResponse(poll.json())
