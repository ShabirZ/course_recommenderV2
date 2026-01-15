from typing import Optional
from sqlmodel import Field, SQLModel,Column

from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Integer, Float, Text

class ProfGradeAvg(SQLModel, table=True):
    __tablename__ = "prof_grade_avg"
    
    Prof: str = Field(sa_column=Column("Prof", Text, primary_key=True))
    Course: str = Field(sa_column=Column("Course", Text, primary_key=True))
    Term: str = Field(sa_column=Column("Term", Text, primary_key=True))
    Course_Number: int = Field(sa_column=Column("Course Number", Integer))
    Average: float = Field(sa_column=Column("Average", Float))

"""
class ProfGradeAvg(SQLModel, table=True):
    
    Represents the 'prof_grade_avg' table, detailing a professor's
    average grade distribution for a specific course and term.
    __tablename__ = "prof_grade_avg"
    
    Prof: str = Field(primary_key=True)
    Course: str = Field(primary_key=True)
    Term: str = Field(primary_key=True)
    Course_Number: int
    Average: float

"""