import os
import webapp2
import urllib
import json
from controllers import apiHandler
from models.record import Record

class TestPage(webapp2.RequestHandler):
    def get(self):
        #essentially just populate the database
        #with random data using autocomplete
        queryKeys = ["mcdonald", "in n out", "safeway"]

        references = []
        for queryKey in queryKeys:
            data = apiHandler.sendAutocompleteRequest(queryKey, apiHandler.ESTABLISHMENT)

            if not (data['status'] != 'OK' or len(data['predictions']) == 0):
                predictions = data['predictions']
                reference = predictions[0]['place_id']
                references.append(reference)
        self.response.out.write(references)
        r = Record(references=json.dumps(references))
        r.put()

    def post(self):
        print "posted to testpage"
