"""
This module is solely
responsible for displaying the page
TODO:
get request for a query value to be
loaded into the search bar
"""


import webapp2
import jinja2
import os
jinja = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), '../views')))

class HomePage(webapp2.RequestHandler):
    def get(self):
        query = self.request.get("q")
        #urllib2.urlencode(dictionary) --> "lang=en&name=dave" no question mark
        template_values = {"q": query}
        template = jinja.get_template("/home.html")
        self.response.out.write(template.render(template_values))
