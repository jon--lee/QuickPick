import webapp2
from controllers import home
from controllers.ajax import autocomplete

app = webapp2.WSGIApplication([
    ('/', home.HomePage),
    ('/ajax/autocomplete/', autocomplete.AutocompletePage),
    ], debug=True)

