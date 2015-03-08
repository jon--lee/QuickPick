

import webapp2
import os


class SearchPage(webapp2.RequestHandler):
    def get(self):
        self.redirect("/")
    def post(self):
        self.response.out.write("hi")
