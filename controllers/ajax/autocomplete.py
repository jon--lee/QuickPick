import webapp2
import json
import urllib

from controllers import apiHandler

LOCATION = "37.580298,-122.182079"  #about the middle of the bay area
RADIUS = "80468"                       #radius in miles

class AutocompletePage(webapp2.RequestHandler):
    def get(self):
        self.redirect("/")
    def post(self):
        req = json.loads(self.request.body)                     #raw request
        q = req['q']                                            #query term

        data = apiHandler.sendAutocompleteRequest(q, "establishment", LOCATION, RADIUS)

        if(data['status'] != 'OK' or len(data['predictions']) == 0):
            results = {"status": "ERROR"}
        else:
            apiPredictions = data['predictions']
            results = {"status": "OK",
                       "predictions": []}

            for apiPrediction in apiPredictions:
                reference = apiPrediction['place_id']
                terms = apiPrediction['terms']
                title = terms.pop(0)['value']
                location = ""
                for i in range(len(terms)):
                    if(i >= len(terms) - 1):
                        location += terms[i]['value']
                    else:
                        location += terms[i]['value'] + ", "

                results['predictions'].append({"title": title, "location": location, "reference": reference})


        self.response.out.write(json.dumps(results))
