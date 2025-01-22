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
        self.session = requests.session()
    
    def load_front_page(self):
        def find_prof_count(soup):
            #<h1 data-testid="pagination-header-main-results">4235<!-- --> professor<!-- -->s<!-- --> <span>at <b>CUNY Queens College</b></span></h1>
            # replace: (<)    ---->  (>) then split to get strictly number
            prof_count_html = soup.find('h1')
            return int(str(prof_count_html).replace('<', '>').split('>')[2])

        front_page = self.session.get(self.QC_url)
        soup = BeautifulSoup(front_page.text, 'html.parser')

        prof_count = find_prof_count(soup)



a = rmpProfessorIdScraper()
a.load_front_page()