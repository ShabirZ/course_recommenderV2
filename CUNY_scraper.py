from bs4 import BeautifulSoup
import requests
import re
class CUNYScraper:
    def __init__(self, course, term):
        self.course = course
        self.url = "https://globalsearch.cuny.edu/CFGlobalSearchTool/CFSearchToolController"
        self.term = term
        self.session = requests.Session()
        professors = self.get_professors()
    
    def load_second_webpage(self):
        def find_class_title(clean_html):
            clean_string = element.replace('\xa0', ' ').split(' ')
            if len(clean_string) < 12:
                return ("", "")
            subject = clean_string[11]
            class_number = clean_string[12]
            return (subject, class_number)

        def find_td_info(html_text):
            left = 0
            while left < len(html_text):            
                if html_text[left] == '>':
                    left+=1
                    break
                left+=1

            right = left
            while right < len(html_text):
                if html_text[right] == '<':
                    right-=1
                    break
                right+=1
            return (left, right)

        def find_full_name(element, left, right):
            # firstName, middleName, lastName
            # firstName, lastName
            name_str = element[left:right+1].split(' ')
            return name_str
        def find_days_time(element, left, right):
            time_span_str = element[left:right+1].split(' ')
            if len(time_span_str) < 3:
                print(time_span_str)
            else:
                days, start_time, end_time = time_span_str[0], time_span_str[1], time_span_str[-1]
                print(days, start_time, end_time)
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
        curr_instructor = ""
        class_days = ""
        for element in elements:
            if element:
                element = str(element)
                if element[:5] == '<span':
                    subject, class_number = find_class_title(element)
                else:
                    container = set(['DaysAndTimes', 'Room', 'Instructor'])
                    container2 = set(['DaysAndTimes', 'Instructor'])
                    pattern = r'"(\b\w+\b)"'
                    matches = re.findall(pattern, element)
                    if len(matches)<1:
                        continue
                    if matches[0] in container2:
                        left,right = find_td_info(element)
                    if matches[0] == 'DaysAndTimes':
                        find_days_time(element, left,right)
                    elif matches[0] == 'Instructor':
                        names = find_full_name(element, left, right)
                        first_name = names[0]
                        last_name = names[-1]
                        middle_name = ""
                        if len(names) == 3:
                            middle_name = names[1]

                    
                    
                

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