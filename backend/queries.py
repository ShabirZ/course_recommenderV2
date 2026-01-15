# Assuming this code is in your queries.py file

from database.connection import SessionLocal 
from models import CourseSchedule, RMPScore, ProfGradeAvg
from sqlalchemy import select
from sqlalchemy.orm import Session 
from typing import List
from sqlalchemy import func
import re


def get_all_courses(db: Session) -> List[CourseSchedule]:
    """Retrieves all CourseSchedule objects from the database."""
    statement = select(CourseSchedule)
    courses = db.scalars(statement).all()
    return courses

def get_course_data(db: Session, course_query: str) -> List[CourseSchedule]:
    """
        Returns all rows such that the course name and code equal the query

        Args:
            course_query (str): Course name and number input by the user, e.g., 'CSCI 313'

        Returns:
            list: rows with equivalent query

        e.g:
            course_name = CSCI course_code = 313  course_query = 'CSCI 313'
    """
    statement = (
        select(CourseSchedule)
        .where(
            func.concat(
                CourseSchedule.course_name,
                " ",
                CourseSchedule.course_code
            ) == course_query
        )
    )
    return db.scalars(statement).all()


def find_course(db: Session, course_query: str) -> bool:
    """
    Returns whether a course exists.

    Args:
        course_query (str): Course name and number input by the user, e.g., 'CSCI 313'

    Returns:
        bool: True if the course exists in the database
    """

    #remove spaces, check invalid chars, check length
    course_query = course_query.strip()
    if len(course_query) > 10: 
        return False
    if not re.fullmatch(r'[A-Za-z0-9 ]+', course_query):
        return False
    course_query = course_query.upper()


    exists = db.query(CourseSchedule).filter(
        func.concat(CourseSchedule.course_name, ' ', CourseSchedule.course_code) == course_query
    ).first()

    return exists is not None

def get_prof_rmp(session, first_name: str, last_name: str):
    """
    Retrieve a professor's RateMyProfessor rating and difficulty by name.

    Queries the rmp_score table for a professor matching the given
    first and last name. Assumes the (first_name, last_name) pair
    uniquely identifies a professor.

    Args:
        session: Active SQLAlchemy database session.
        first_name (str): Professor's first name.
        last_name (str): Professor's last name.

    Returns:
        tuple | None:
            - (prof_rating, prof_difficulty) if a matching professor is found
            - None if no matching record exists

    Raises:
        sqlalchemy.exc.MultipleResultsFound:
            If more than one professor matches the given name.
    """
    stmt = (
        select(
            RMPScore.prof_rating,
            RMPScore.prof_difficulty
        )
        .where(
            RMPScore.first_name == first_name,
            RMPScore.last_name == last_name
        )
    )
    return session.execute(stmt).one_or_none()

def get_prof_averages(db_session, first_name, last_name, course):
    """
    Docstring for get_prof_averages
    
    :param db_session: Description
    :param first_name: Description
    :param last_name: Description
    :param course: Description
    """
    # name formats:  lastname + first letter of first name
    # Zahir S
    if len(first_name) > 1:
        first_name = first_name[0]
    name_query = (last_name + " " + first_name).upper()
    course_name, course_code = course.split(' ')
    stmt = (
        select(func.avg(ProfGradeAvg.Average))
        .where(
            ProfGradeAvg.Prof == name_query,
            ProfGradeAvg.Course == course_name,
            ProfGradeAvg.Course_Number == course_code
        )
    )
    result = db_session.execute(stmt).scalar()
    return result if result is not None else 0
# --- CORRECT EXECUTION BLOCK ---

# 1. Call the factory to create a live Session instance
db_session = SessionLocal() 

def print_all_courses(session):
    all_courses = get_all_courses(db_session)
    
    # Optional: print the results to see the data
    print("--- Retrieved Courses ---")
    for course in all_courses:
        print(course)
    return

def test_queries(session):  
    assert find_course(db_session, "CSCI 313"), "CSCI 313 should exist in the DB"
    assert not find_course(db_session, "CSCI 314"), "CSCI 314 should exist in the DB"
    assert not find_course(db_session, "CS'CI 313"), "invalid char should auto return false"
    assert not find_course(db_session, "CSCIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIICSCCSCSCC 313"), "should auto return false because length"
    
"""
try:
    # 2. Pass the active instance to the function
    #print_all_courses(db_session)
    print()
    test_queries(db_session)       
except Exception as e:
    # Handle any connection or query errors
    print(f"An error occurred during query execution: {e}")
    
finally:
    # 3. Always close the session to release the connection back to the pool
    db_session.close()
"""