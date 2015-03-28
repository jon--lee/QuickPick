

import webapp2
import os
import json

from controllers import apiHandler

from models.node import Node
from models import ranking
from models.record import Record

from google.appengine.ext import ndb

MAX_RECOMMENDATIONS = 5


class RecommendPage(webapp2.RequestHandler):
    # method: get(self)
    # we don't expect users to reach
    # this page using a get request
    # so just redirect them back to the
    # home page
    def get(self):
        list = ["hi world", "some list", "again"]
        jsonList = json.dumps(list);
        r = Record(references=jsonList)
        r.put()

        self.redirect("/")

    # method: post(self)
    # post will receive a list of the user's
    # current liked restaurants. From that
    # it will retrieve data from the data base
    # and then use node and ranking modules
    # to yield a list of references in order of
    # highest to lowest recommendation. Each recommendation
    # reference is used to gather information about it
    # the data compiled about each place is returned
    def post(self):
        req = json.loads(self.request.body)
        references = req["references"]
        keyString = req["keyString"]

        print "\n\n" + keyString + "\n\n"

        if not keyString == "":
            print "keyStrng already exists"
            key = ndb.Key(urlsafe=keyString)
            rec = key.get()
        else:
            print "creating new key string"
            rec = Record()

        rec.references = json.dumps(references)
        key = rec.put()

        keyString = key.urlsafe()

        base = Node(references)

        targets = []
        records = Record.query().fetch()
        for record in records:
            references = json.loads(record.references)
            targets.append(Node(references))

        results = ranking.rank(base, targets)

        places = []

        top = MAX_RECOMMENDATIONS
        if len(results) < top:
            top = len(results)

        for i in range(0, top):
            result = results[i]
            rawData = apiHandler.sendReferenceRequest(result)['result']
            place = {}

            if 'name' in rawData:
                place['title'] = rawData['name']

            if 'geometry' in rawData:
                place['long'] = rawData['geometry']['location']['lng']
                place['lat'] = rawData['geometry']['location']['lat']

            if 'formatted_address' in rawData:
                place['address'] = rawData['formatted_address']

            if 'formatted_address' in rawData:
                place['address'] = rawData['formatted_address']

            if 'formatted_phone_number' in rawData:
                place['number'] = rawData['formatted_phone_number']

            if 'icon' in rawData:
                place['imageUrl'] = rawData['icon']

            if 'rating' in rawData:
                place['rating'] = rawData['rating']


            places.append(place)


        response = {
            'data': places,
            'keyString': keyString
        }
        self.response.out.write(json.dumps(response))
