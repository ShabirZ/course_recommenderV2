class Professor:

    def __init__(self):
        self.rmp_difficulty = 0
        self.rmp_rating = 0
        self.course_averages = {}
        

    def update_rmp_score(self, rmp_difficulty, rmp_rating):
        self.rmp_difficulty = rmp_difficulty
        self.rmp_rating = rmp_rating

    def add_course_avg(self, course, avg):
        self.course_averages[course] = avg
    def __repr__(self):
        return f"<rmp_difficulty {self.rmp_difficulty} rmp_rating: {self.rmp_rating}>"
    
