# models/courseschedule.py
from sqlmodel import Field, SQLModel
from typing import Optional

class CourseSchedule(SQLModel, table=True):
    """
    Represents the 'courseschedule' table 
    
    shows who is teaching a certain course and at what time

    ex: CSCI 313 Shabir Zahir  MoWe 1:40 2:55
    """
    
    __tablename__ = "courseschedule"

    course_name: str = Field(primary_key=True, max_length=50) 
    course_code: str = Field(primary_key=True, max_length=15)
    section: str = Field(primary_key=True, max_length=30)
    days: Optional[str] = Field(default=None, max_length=20)
    first_name: Optional[str] = Field(default=None, max_length=30)
    last_name: Optional[str] = Field(default=None, max_length=30)
    start_time: Optional[str] = Field(default=None, max_length=10)
    end_time: Optional[str] = Field(default=None, max_length=10)