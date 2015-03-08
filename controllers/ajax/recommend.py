

import webapp2
import os
import json

from controllers import apiHandler

from models.node import Node
from models import ranking
from models.record import Record

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

        base = Node(references)


        targets = []
        records = Record.query().fetch()
        for record in records:
            references = json.loads(record.references)
            targets.append(Node(references))

        results = ranking.rank(base, targets)

        places = []



        for result in results:
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

            print '\n\n' + place['title'] + '\n\n'

            places.append(place)


        self.response.out.write(json.dumps(places))
