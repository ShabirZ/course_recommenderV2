from typing import Optional
from sqlmodel import Field, SQLModel

class RMPScore(SQLModel, table=True):
    """
    Represents the 'rmp_score' table, storing professor ratings and difficulty scores.
    
    Shabir Zahir rating: 3.7 difficulty 5

    both scores out of 5
    """
    __tablename__ = "rmp_score"

    RMP_ID: int = Field(primary_key=True) 
    first_name: str = Field(max_length=20)
    last_name: str = Field(max_length=20)
    prof_rating: float
    prof_difficulty: float