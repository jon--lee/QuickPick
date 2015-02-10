import webapp2
import json
class AutocompletePage(webapp2.RequestHandler):
    def get(self):
        self.redirect("/")
    def post(self):
        req = json.loads(self.request.body)                     #raw request
        q = req['q']                                            #query term

        self.response.out.write(q)
