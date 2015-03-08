import webapp2
import json
import urllib

from controllers import apiHandler

class AutocompletePage(webapp2.RequestHandler):
    def get(self):
        self.redirect("/")
    def post(self):
        req = json.loads(self.request.body)                     #raw request
        q = req['q']                                            #query term

        data = apiHandler.sendAutocompleteRequest(q, "establishment")

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
