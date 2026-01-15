# Expose professor_services functions
from .professor_services import generate_rmp_scores, get_course_avg
from .scheduler import *
# Import from parent folder
from queries import get_prof_rmp, get_prof_averages
from professor import Professor

# Clean API for external imports
__all__ = [
    "generate_rmp_scores",
    "get_course_avg",
    "get_prof_rmp",
    "get_prof_averages",
    "Professor"
]
