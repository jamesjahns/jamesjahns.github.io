# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
from django.http import HttpResponse

from . import ProcessPDF

def index(request):
    print(request)
    data = request.body
    if request.method == "POST":
        #process only the first file
        file_name = next(iter(request.FILES))
        image_json = ProcessPDF.process(request.FILES[file_name].file.read())
        return HttpResponse(image_json)
    return HttpResponse("not a POST request")
