from django.core.exceptions import SuspiciousOperation
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

import json

from .forms import NewPollForm
from .models import Poll

@require_http_methods(["GET"])
def index(request):
    return render(request, 'polls/index.html', {})

@require_http_methods(["GET", "POST"])
def new(request):
    if request.method == 'POST':
        form = NewPollForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data['title']
            noti_email = form.cleaned_data['noti_email']
            poll = Poll.new(title, noti_email)
            return HttpResponseRedirect(reverse('polls.get', args=[poll.poll_id]))
    else:
        form = NewPollForm()
    return render(request, 'polls/new.html', {'form':form})

@csrf_exempt
@require_http_methods(["POST"])
def update(request, poll_id):
    try:
        questions = json.loads(request.body)
    except ValueError:
        raise SuspiciousOperation("Bad json format")

    poll = Poll.get(poll_id)
    if not poll:
        raise SuspiciousOperation("Poll '%s' does not exist." % poll_id)

    if poll.finalized:
        raise SuspiciousOperation("You cannot edit finilized poll")

    poll.update_questions(questions)
    return HttpResponse("ok")

@require_http_methods(["GET"])
def finalize(request, poll_id):
    poll = Poll.get(poll_id)
    if not poll:
        raise SuspiciousOperation("Poll '%s' does not exist." % poll_id)

    poll.finalize()
    return HttpResponse("ok")

@require_http_methods(["GET"])
def get(request, poll_id):
    poll = Poll.get(poll_id)
    if not poll:
        raise Http404("Poll does not exist")
    return HttpResponse(poll.json())

def question(request):
    return render(request, 'question/questions.html')
