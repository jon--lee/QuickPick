class Node:
    def __init__(self, tags):
        self.score = 0
        self.tags = list(set(tags))
    def getScore(self):
        return self.score
    def incrementScore(self):
        self.score += 1
