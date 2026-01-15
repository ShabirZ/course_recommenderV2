from fastapi import FastAPI
import mysql.connector
import queries
from database.connection import SessionLocal 
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Query
from typing import List
import professor
import services
from pydantic import BaseModel

app = FastAPI()

# Define the expected structure
class ScheduleRequest(BaseModel):
    courses: List[str]
    semester: str = "Regular" # optional default

db_session = SessionLocal() 
app = FastAPI()


origins = [
    "http://localhost:5173",  # React dev server
    "http://127.0.0.1:5173",  # optional, sometimes used
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # allow only React dev server
    allow_credentials=True,
    allow_methods=["*"],        # allow GET, POST, etc.
    allow_headers=["*"],
)



@app.get("/")
async def root():
    #courses = queries.get_all_courses(db_session)
    return {"test": "running" }

@app.get('/course_exists')
def find_course(course_query):
    """
    Check if a course exists in the database.
    """
    print(course_query)
    is_course = queries.find_course(db_session, course_query)
    return {"valid input" : is_course}



@app.get("/generate_schedule/")  # Changed to .get
def generate_schedule(
    courses: List[str] = Query(...),
    section: str = Query(...),
    limit: int = 1,
    page: int = 1    
):
    course_list = courses 
    all_classes = {}
    for course in course_list:
        get_classes = queries.get_course_data(db_session, course)
        new_classes = []
        new_classes = [
            selection for selection in get_classes
            if (selection.section.endswith("Winter") and section == "Winter") or
            (selection.section.endswith("Regular") and section != "Winter")
        ]
        all_classes[course] = new_classes
    print(all_classes)
    prof_map = services.professor_services.generate_rmp_scores(db_session, all_classes)
    prof_map = services.professor_services.get_course_avg(db_session, prof_map, all_classes)
    print()
    print(prof_map)
    schedule = services.scheduler.schedule_courses(all_classes, prof_map, page, limit)
    print(schedule)
    schedule['profData'] = prof_map
    return schedule         
