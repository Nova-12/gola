from django.conf.urls import url

from . import views

POLL_ID_REGEX = '(?P<poll_id>[a-fA-F0-9]+)'
urlpatterns = [
    url(r'^$', views.index, name='polls.index'),
    url(r'^create/$', views.create, name='polls.create'),
    url(r'^ready/{}/$'.format(POLL_ID_REGEX), views.ready, name='polls.ready'),
    url(r'^get/{}/$'.format(POLL_ID_REGEX), views.get, name='polls.get'),
    url(r'^vote/{}/$'.format(POLL_ID_REGEX), views.vote, name='polls.vote'),
    url(r'^result/{}/$'.format(POLL_ID_REGEX), views.result, name='polls.result'),
    url(r'^result_data/{}/$'.format(POLL_ID_REGEX), views.result_data, name='polls.result_data'),
]
