from django.urls import path

from . import views


from django.views.decorators.csrf import csrf_exempt

#TODO: make not exempt
urlpatterns = [
    path('', csrf_exempt(views.index), name='index'),
]
