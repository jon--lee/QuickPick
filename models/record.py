from google.appengine.ext import ndb

class Record(ndb.Model):
    references = ndb.StringProperty(required=True, indexed=False)
