from bs4 import BeautifulSoup
import requests

class CUNYScraper:
    def __init__(self, course, term):
        self.course = course
        self.url = "https://globalsearch.cuny.edu/CFGlobalSearchTool/CFSearchToolController"
        self.term = term
        self.session = requests.Session()
        professors = self.get_professors()
        
    def load_first_webpage(self):
        """
        Request Method: POST
        first webPage Payload:
            selectedInstName: Queens College | 
            inst_selection: QNS01
            selectedTermName: 2025 Spring Term
            term_value: 1252
            next_btn: Next

            selectedInstName: Queens College | 
            inst_selection: QNS01
            selectedTermName: 2025 Summer Term
            term_value: 1256
            next_btn: Next


            selectedInstName: Queens College | 
            inst_selection: QNS01
            selectedTermName: 2024 Fall Term
            term_value: 1249
            next_btn: Next
        """

        payload = {
            "selectedInstName": "Queens College |", 
            "inst_selection": "QNS01",
            "selectedTermName": "2025 Spring Term",
            "term_value": "1252",
            "next_btn": "Next",
        }
        test = self.session.post(self.url, data=payload)
        print(test.text)
        return
    def get_professors(self):
        self.load_first_webpage()
CUNYScraper(1,2)