from django.conf.urls import url
from django.views.generic import TemplateView
from . import views

POLL_ID_REGEX = '(?P<poll_id>[a-fA-F0-9]+)'
urlpatterns = [
    url(r'^$', views.index, name='polls.index'),
    url(r'^create/$', views.create, name='polls.create'),
    url(r'^ready/{}/$'.format(POLL_ID_REGEX), views.ready, name='polls.ready'),
    url(r'^vote/{}/$'.format(POLL_ID_REGEX), views.vote, name='polls.vote'),
    url(r'^result/{}/$'.format(POLL_ID_REGEX), views.result, name='polls.result'),
    url(r'^submitted/$', views.submitted, name='polls.submitted'),
    url(r'^question/', TemplateView.as_view(template_name='polls/question/index.html')),
]
