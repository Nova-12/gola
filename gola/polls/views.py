from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

from .forms import NewPollForm
from .models import Poll

def index(request):
    return render(request, 'polls/index.html', {})

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

def get(request, poll_id):
    poll = Poll.get(poll_id)
    return HttpResponse(poll.json())
