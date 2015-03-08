import webapp2
from controllers import home
from controllers.ajax import autocomplete
from controllers.ajax import search
from controllers.ajax import recommend
from controllers import test

app = webapp2.WSGIApplication([
    ('/', home.HomePage),
    ('/ajax/autocomplete/', autocomplete.AutocompletePage),
    ('/ajax/recommend/', recommend.RecommendPage),
    ('/search', search.SearchPage),
    ('/test/', test.TestPage),
    ], debug=True)
