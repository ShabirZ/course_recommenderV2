from bs4 import BeautifulSoup
import requests

class CUNYScraper:
    def __init__(self, course, term):
        self.course = course
        self.url = "https://globalsearch.cuny.edu/CFGlobalSearchTool/CFSearchToolController"
        self.term = term
        self.session = requests.Session()
        professors = self.get_professors()
    
    def load_second_webpage(self):
        def find_class_title(clean_html):
            clean_string = a.replace('\xa0', ' ').split(' ')
            if len(clean_string) < 12:
                return ("", "")
            subject = clean_string[11]
            class_number = clean_string[12]
            return (subject, class_number)
        """
        Payload
        POST:
            selectedSubjectName: Computer Science
            subject_name: CMSC
            selectedCCareerName: Undergraduate
            courseCareer: UGRD

            meetingStart: LT
            selectedMeetingStartName: less than

            meetingEnd: LE
            selectedMeetingEndName: less than or equal to

            daysOfWeek: I
            selectedDaysOfWeekName: include only these days
            instructor: B
            selectedInstructorName: begins with
            search_btn_search: Search
                    
        """
        payload = {
            "selectedSubjectName": "Computer Science",
            "subject_name": "CMSC",
            "selectedCCareerName": "Undergraduate",
            "courseCareer": "UGRD",
            "selectedCAttrName": "",
            "courseAttr": "",
            "selectedCAttrVName": "",
            "courseAttValue": "",
            "selectedReqDName": "",
            "reqDesignation": "",
            "selectedSessionName": "",
            "class_session": "",
            "selectedModeInsName": "",
            "meetingStart": "LT",
            "selectedMeetingStartName": "less than",
            "meetingStartText": "",
            "AndMeetingStartText": "",
            "meetingEnd": "LE",
            "selectedMeetingEndName": "less than or equal to",
            "meetingEndText": "",
            "AndMeetingEndText": "",
            "daysOfWeek": "I",
            "selectedDaysOfWeekName": "include only these days",
            "instructor": "B",
            "selectedInstructorName": "begins with",
            "instructorName": "",
            "search_btn_search": "Search",
        }
        # course name --> Computer Science
        # subject_name  --> CMSC
        temp = self.session.post(self.url, data = payload)
        soup = BeautifulSoup(temp.text, 'html.parser')

        elements = soup.find_all(['span', 'td'])
        subject = ""
        class_number = ""
        for element in elements:
            if element:
                a = str(element)
                if a[:5] == '<span':
                    subject, class_number = find_class_title(a)

                

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
        self.session.post(self.url, data=payload)

    def get_professors(self):
        self.load_first_webpage()
        self.load_second_webpage()
CUNYScraper(1,2)