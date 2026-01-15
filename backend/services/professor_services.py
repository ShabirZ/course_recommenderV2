from professor import Professor
import queries
from . import scheduler
def generate_rmp_scores(db_session, all_classes): 
    """
    Update necessary professor RMP scores in map.

    NOTE:
        Faulty logic (intentionally left unfixed):
        - Takes average from one course if a professor has missing data
        - If a professor teaches 111 and 313, may take RMP averages from 111 professors
          but not 313

    :param db_session: Database session
    :param all_classes: JSON mapping course -> list of course schedule rows
    """


    prof_map = {}

    for course in all_classes:
        # fill in empty prof ratings with avg for course
        prof_rating_sum = 0
        prof_difficulty_sum = 0 
        freq = 0
        missing_names = []
        for curr_class in all_classes[course]:
            first_name = curr_class.first_name
            last_name = curr_class.last_name
            full_name = f'{first_name} {last_name}'
            if full_name not in prof_map:
                prof_map[full_name] = Professor()
                rmp_outcome = queries.get_prof_rmp(db_session, first_name, last_name)
                if rmp_outcome:
                    curr_rmp_rating, curr_rmp_difficulty = rmp_outcome
                    prof_map[full_name].update_rmp_score(curr_rmp_difficulty, curr_rmp_rating)
                    
                    freq+=1
                    prof_difficulty_sum +=curr_rmp_difficulty
                    prof_rating_sum += curr_rmp_rating
                else:
                    missing_names.append(full_name)
                
        if freq == 0:
            return prof_map
        
        for name in missing_names:
            prof_map[name].update_rmp_score(prof_difficulty_sum / freq, prof_rating_sum / freq)
    return prof_map

    """
    sample input:
        {
        "CSCI 313": [
            {
            "days": "MoWe",
            "course_name": "CSCI",
            "last_name": "Baci",
            "end_time": "10:30AM",
            "course_code": "313",
            "section": "111-LEC Regular",
            "first_name": "Nikola",
            "start_time": "9:15AM"
            },
            {
            "days": "MoWe",
            "course_name": "CSCI",
            "last_name": "Rozovskaya",
            "end_time": "4:25PM",
            "course_code": "313",
            "section": "121-LEC Regular",
            "first_name": "Alla",
            "start_time": "3:10PM"
            }
        ],
        "CSCI 331": [
            {
            "days": "MoWe",
            "course_name": "CSCI",
            "last_name": "Chyn",
            "end_time": "10:30AM",
            "course_code": "331",
            "section": "111-LEC Regular",
            "first_name": "Xinying",
            "start_time": "9:15AM"
            },
            {
            "days": "TuTh",
            "course_name": "CSCI",
            "last_name": "Sy",
            "end_time": "1:30PM",
            "course_code": "331",
            "section": "221-LEC Regular",
            "first_name": "Bon",
            "start_time": "12:15PM"
            },
            {
            "days": "TuTh",
            "course_name": "CSCI",
            "last_name": "Steinberg",
            "end_time": "7:45PM",
            "course_code": "331",
            "section": "231-LEC Regular",
            "first_name": "Oren",
            "start_time": "6:30PM"
            }
        ]
        }
            
    """

def get_course_avg(db_session, prof_map, all_classes):
    for course in all_classes:
        course_avg_sum = 0 
        course_avg_total = 0
        missing_prof = []
        for curr_class in all_classes[course]:
            first_name = curr_class.first_name
            last_name = curr_class.last_name
            full_name = f'{first_name} {last_name}'
            # prof teaching multiple classes no need to research
            if course in prof_map[full_name].course_averages: 
                continue
            
            prof_avg = queries.get_prof_averages(db_session, first_name, last_name, course)
            if prof_avg > 0:
                prof_map[full_name].course_averages[course] = round(prof_avg, 2) # .194 --> .19
                print(full_name, " ", prof_avg)

                course_avg_sum+=prof_avg
                course_avg_total+=1
            else:
                missing_prof.append(full_name)
            if course_avg_total == 0:
                continue
            for prof in missing_prof:
                prof_map[prof].course_averages[course] = round(course_avg_sum / course_avg_total,2)
    return prof_map   

    