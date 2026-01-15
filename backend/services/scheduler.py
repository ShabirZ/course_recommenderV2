from datetime import datetime

def parse_time(time_str):
    """Converts '9:15AM' to minutes from midnight."""
    t = datetime.strptime(time_str, "%I:%M%p")
    return t.hour * 60 + t.minute

def parse_days(day_str):
    """Splits 'MoWe' into ['Mo', 'We']"""
    return [day_str[i:i+2] for i in range(0, len(day_str), 2)]

def check_time_overlap(t1_start, t1_end, t2_start, t2_end):
    """Returns True if two time ranges overlap."""
    return max(t1_start, t2_start) < min(t1_end, t2_end)

def get_prof_score(prof_name, course_code, prof_map):
    """
    Calculates score based on 50% GPA, 25% Rating, 25% Difficulty.
    """
    prof_data = prof_map.get(prof_name)
    if not prof_data:
        return 0

    # 1. Get raw metrics
    rmp_rating = prof_data.rmp_rating if prof_data.rmp_rating else 2.5
    rmp_difficulty = prof_data.rmp_difficulty if prof_data.rmp_difficulty else 3.0
    gpa = prof_data.course_averages.get(course_code, 2.5)

    # 2. Normalize to 0-100
    score_gpa = (gpa / 4.0) * 100
    score_rating = (rmp_rating / 5.0) * 100
    score_difficulty = ((5.0 - rmp_difficulty) / 4.0) * 100 
    
    # 3. Apply Weights
    final_score = (0.50 * score_gpa) + (0.25 * score_rating) + (0.25 * score_difficulty)
    
    return round(final_score, 2)

def is_conflict(schedule, new_course):
    # CHANGED: Uses dot notation (.days, .start_time)
    new_days = parse_days(new_course.days)
    new_start = parse_time(new_course.start_time)
    new_end = parse_time(new_course.end_time)

    for scheduled_course in schedule:
        # CHANGED: Uses dot notation for the existing courses in schedule too
        existing_days = parse_days(scheduled_course.days)
        
        # Check if they share any days
        shared_days = set(new_days).intersection(existing_days)
        
        if shared_days:
            # If days match, check strict time overlap
            # CHANGED: Uses dot notation
            existing_start = parse_time(scheduled_course.start_time)
            existing_end = parse_time(scheduled_course.end_time)
            
            if check_time_overlap(new_start, new_end, existing_start, existing_end):
                return True # Conflict detected
                
    return False

def calculate_score(schedule, prof_map):
    total_score = 0
    for course in schedule:
        # CHANGED: Uses dot notation to access course details
        prof_name = f"{course.first_name} {course.last_name}"
        course_code_full = f"{course.course_name} {course.course_code}" 
        
        total_score += get_prof_score(prof_name, course_code_full, prof_map)
        
    return total_score

def backtrack(course_groups, index, schedule, all_schedules, best_schedule_container, prof_map):
    if index == len(course_groups):
        score = calculate_score(schedule, prof_map)
        
        # Store copy of schedule
        # Note: If these are database objects, ensure they are serializable later
        all_schedules.append({"schedule": list(schedule), "score": score})
        
        if best_schedule_container['best'] is None or score > best_schedule_container['best']['score']:
            best_schedule_container['best'] = {"schedule": list(schedule), "score": score}
        return

    current_course_options = course_groups[index]
    
    for option in current_course_options:
        if not is_conflict(schedule, option):
            schedule.append(option)
            backtrack(course_groups, index + 1, schedule, all_schedules, best_schedule_container, prof_map)
            schedule.pop()

def schedule_courses(all_classes, prof_map, page: int = 1, limit: int = 5):
    """
    Generates schedules, sorts them by score, and returns a specific page.
    Defaults to Page 1 with 5 results per page.
    """
    # 1. Prepare data
    course_groups = list(all_classes.values())
    all_schedules = []
    
    # We don't strictly need 'best_schedule_container' anymore since we are sorting later,
    # but we can keep it if you want O(1) access to the absolute best during the search.
    best_schedule_container = {'best': None}
    
    # 2. Run Backtracking to find ALL valid permutations
    backtrack(course_groups, 0, [], all_schedules, best_schedule_container, prof_map)
    
    if not all_schedules:
        return {
            "total": 0,
            "page": page,
            "schedules": []
        }

    # 3. Sort by Score (Descending) - Critical for "Best" results first
    # We sort the list in-place to save memory
    all_schedules.sort(key=lambda x: x['score'], reverse=True)

    # 4. Pagination Logic
    total_results = len(all_schedules)
    start_index = (page - 1) * limit
    end_index = start_index + limit
    
    # Slice the results for the requested page
    paginated_results = all_schedules[start_index:end_index]

    return {
        "total": total_results,
        "page": page,
        "limit": limit,
        "total_pages": (total_results + limit - 1) // limit, # Ceiling division
        "schedules": paginated_results
    }