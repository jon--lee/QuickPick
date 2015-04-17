
import os
import json
import urllib
AUTOCOMPLETE_URL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?"
API_KEY = "AIzaSyCnbz5OlqvlGaThq9b115HEalV-8asu9CY"

ESTABLISHMENT = "establishment"

REFERENCE_URL = "https://maps.googleapis.com/maps/api/place/details/json?"


def sendAutocompleteRequest(q, types, location, radius):
    print "sending autocmplete request"
    params = {"input": q,
              "types": types,
              "key": API_KEY}

    if((not location == "") and (not radius == "")):
        params['location'] = location;
        params['radius'] = radius;

    url = AUTOCOMPLETE_URL + urllib.urlencode(params)

    response = urllib.urlopen(url)
    data = json.loads(response.read())

    return data

def sendReferenceRequest(reference):
    print "sending reference request"
    params = {"placeid": reference,
            "key": API_KEY}
    url = REFERENCE_URL + urllib.urlencode(params)

    response = urllib.urlopen(url)
    data = json.loads(response.read())

    return data
