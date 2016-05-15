from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^new/$', views.new, name='new'),
    url(r'^get/(?P<poll_id>[a-fA-F0-9]+)/$', views.get, name='get'),
]
