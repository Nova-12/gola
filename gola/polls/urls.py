from django.conf.urls import url

from . import views

POLL_ID_REGEX = '(?P<poll_id>[a-fA-F0-9]+)'
urlpatterns = [
    url(r'^$', views.index, name='polls.index'),
    url(r'^new/$', views.new, name='polls.new'),
    url(r'^update/{}/$'.format(POLL_ID_REGEX), views.update, name='polls.update'),
    url(r'^finalize/{}/$'.format(POLL_ID_REGEX), views.finalize, name='polls.finish'),
    url(r'^get/{}/$'.format(POLL_ID_REGEX), views.get, name='polls.get'),
    url(r'^question/', views.question, name='question.questions'),
    url(r'^answer/', views.answer, name='question.answer'),
    url(r'^result/', views.result, name='question.result')
]
