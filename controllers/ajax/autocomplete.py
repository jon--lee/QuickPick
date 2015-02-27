import webapp2
import json
import urllib
AUTOCOMPLETE_URL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?"
API_KEY = "AIzaSyCnbz5OlqvlGaThq9b115HEalV-8asu9CY"
class AutocompletePage(webapp2.RequestHandler):
    def get(self):
        self.redirect("/")
    def post(self):
        req = json.loads(self.request.body)                     #raw request
        q = req['q']                                            #query term

        params = {"input": q,
                  "types": "establishment",
                  "key": API_KEY}
        url = AUTOCOMPLETE_URL + urllib.urlencode(params)

        response = urllib.urlopen(url)
        data = json.loads(response.read())
        if(data['status'] != 'OK' or len(data['predictions']) == 0):
            results = {"status": "ERROR"}
        else:
            apiPredictions = data['predictions']
            results = {"status": "OK",
                       "predictions": []}
            for apiPrediction in apiPredictions:
                description = apiPrediction['description']
                location = ""
                endIndex = description.find(",")

                if(endIndex < 0):
                    title = description
                else:
                    title = description[0:endIndex]
                    location = description[endIndex  + 1:len(description)]

                results['predictions'].append({"title": title, "location": location})


        self.response.out.write(json.dumps(results))
