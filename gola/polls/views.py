from django.core.exceptions import SuspiciousOperation
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

import json

from .models import Poll
from .noti import send_mail

@require_http_methods(["GET"])
def index(request):
    return render(request, 'polls/index.html', {})

def decode_or_die(body):
    try:
        return json.loads(body)
    except ValueError:
        raise SuspiciousOperation("Bad json format")

@csrf_exempt
@require_http_methods(["GET", "POST"])
def create(request):
    if request.method == 'POST':
        print request.body
        j = decode_or_die(request.body)
        poll = Poll.create(j)
        return HttpResponse(reverse('polls.ready', args=[poll.poll_id]))
    else:
        return render(request, 'polls/create.html')

@require_http_methods(["GET"])
def ready(request, poll_id):
    vote_link = request.build_absolute_uri(reverse('polls.vote', args=[poll_id]))
    result_link = request.build_absolute_uri(reverse('polls.result', args=[poll_id]))
    args = {
        "vote_link": vote_link,
        "result_link": result_link
    }
    return render(request, 'polls/ready.html', args)

@require_http_methods(["GET"])
def get(request, poll_id):
    poll = Poll.get(poll_id)
    if not poll:
        raise Http404("Poll does not exist")
    return HttpResponse(json.dumps(poll.content))

@csrf_exempt
@require_http_methods(["GET", "POST"])
def vote(request, poll_id):
    poll = Poll.get(poll_id)
    if not poll:
        raise Http404("Poll does not exist")

    if request.method == 'POST':
        j = decode_or_die(request.body)
        poll.vote(j)
        if poll.noti_needed():
            recipient = poll.content['noti_email']
            uri = reverse('polls.result', args=[poll.poll_id])
            link = request.build_absolute_uri(uri)
            send_mail(recipient, link)
        return HttpResponse("ok")
    else:
        return render(request, 'polls/vote.html', {"poll_id":poll.poll_id})

@require_http_methods(["GET"])
def result(request, poll_id):
    poll = Poll.get(poll_id)
    if not poll:
        raise Http404("Poll does not exist")
    return render(request, 'polls/result.html', {"poll_id":poll.poll_id})
