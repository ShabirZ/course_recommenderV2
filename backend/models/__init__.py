# models/__init__.py

# 1. Import SQLModel (or your DeclarativeBase) for foundational access
from sqlmodel import SQLModel 

# 2. Import all individual model classes defined in other files
from .courseschedule import CourseSchedule
from .prof_grade_avg import ProfGradeAvg
from .rmp_score import RMPScore