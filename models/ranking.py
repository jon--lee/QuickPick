from node import Node
import operator
# def rank (base, targets):
#      for target in targets:
#          for tag in base.tags:
#              if tag in target.tags:
#                  target.incrementScore()
#          print target.score

def rank (base, targets):
    rankings = {}
    for target in targets:
        misses = []
        for tag in target.tags:
            if tag in base.tags:
                target.incrementScore()
            else:
                misses.append(tag)
        for miss in misses:
            if miss in rankings:
                rankings[miss] += target.score
            else:
                rankings[miss] = target.score

    #sort the dictionary couples in descending order based on the value
    #later will need to isolate just the keys (since the keys refer to the suggestsions
    rankingsTuples = sorted(rankings.items(), key=operator.itemgetter(1), reverse=True)
    rankingsList = []
    for tup in rankingsTuples:
        rankingsList.append(tup[0])
    return rankingsList
