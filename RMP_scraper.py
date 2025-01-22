from bs4 import BeautifulSoup
import requests
import re
from SQL_Server import DatabaseManager

"""
The way Rate my prfessor works is u essentially send a request with a teacher ID
Example:
    Jerry Waxman: 287312

this file is meant to scrape every Queens College professor and get there corresponding ID's
I will drop any name not in my Course Table and create some sort of Table/CSV that has professor/ID
"""

class rmpProfessorIdScraper:
    def __init__(self):
        self.QC_url = "https://www.ratemyprofessors.com/search/professors/231?q=*"