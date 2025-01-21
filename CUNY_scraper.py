from bs4 import BeautifulSoup
import requests
import re

class CUNYScraper:
    def __init__(self, course, term):
        self.course = course
        self.url = "https://globalsearch.cuny.edu/CFGlobalSearchTool/CFSearchToolController"
        self.term = term
        self.session = requests.Session()
        self.course_info = []
        self.found_info = False
        self.course_idx = 0

        professors = self.get_professors()


        #we need to populate course_info
        #when we do ensure we never populate again (flag)

    def load_second_webpage(self):
        
        def get_section(element_html, left,right): 
            #parses through section tag to get section string
            """
            BEFORE:
              <a href="CFSearchToolController?class_number_searched=NTI2ODU=&amp;session_searched=MQ==&amp;term_searched=MTI1Mg==&amp;inst_searched=UXVlZW5zIENvbGxlZ2U=">231-LEC Regular</a></td>
            After:
                211B-LAB Regular
                211-LEC Regular
                931-LEC Winter
            """
        
            return element_html.replace('>', '<').split('<')[-5]
            
            
        def find_class_title(clean_html):
            #parses through section tag and gets class, class#
            # ex: CSCI 313
            clean_string = element.replace('\xa0', ' ').split(' ')

            if len(clean_string) < 12:
                return ("", "")
            subject = clean_string[11]
            class_number = clean_string[12]
            return (subject, class_number)

        def find_td_info(html_text):
            #parses through tag to look for range where our data is
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
            #split name by space 
            # ex:   Shabir Zahir --> [Shabir,Zahir], Shabir Ahamad Zahir --> [Shabir, Ahamad Zahir]
            name_str = element[left:right+1].split(' ')
            return name_str

        def find_days_time(element, left, right):
            #returns starting time or ending time
            #cases with no time : TBA will return -1
            time_span_str = element[left:right+1].split(' ')
            if len(time_span_str) < 3:
                return time_span_str[-1], '-1','-1'

            days, start_time, end_time = time_span_str[0], time_span_str[1], time_span_str[-1]
            return days, start_time, end_time
        
       
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
        first_name, last_name, middle_name = "","",""
        days, start_time, end_time = "", "", ""
        for element in elements:
            if element:
                element = str(element)
                if element[:5] == '<span':
                    subject, class_number = find_class_title(element)
                else:
                    container = set(['DaysAndTimes', 'Room', 'Instructor'])
                    container2 = set(['DaysAndTimes', 'Instructor', 'Section'])
                    pattern = r'"(\b\w+\b)"'
                    matches = re.findall(pattern, element)
                    if len(matches)<1:
                        continue
                    if matches[0] in container2:
                        left,right = find_td_info(element)
                    if matches[0] == 'Section':
                        section = get_section(element,left,right)
                    if matches[0] == 'DaysAndTimes':
                        days, start_time, end_time = find_days_time(element, left,right)
                    elif matches[0] == 'Instructor':
                        names = find_full_name(element, left, right)
                        first_name = names[0]
                        last_name = names[-1]
                        middle_name = ""
                        if len(names) == 3:
                            middle_name = names[1]
                        #print(subject ,class_number, days, first_name, last_name, start_time, '-', end_time, section)

                        subject = subject.strip()
                        class_number = class_number.strip()
                        days = days.strip()
                        first_name = first_name.strip()
                        last_name = last_name.strip()
                        start_time = start_time.strip()
                        end_time = end_time.strip()
                        section = section.strip()
                        #print(subject ,class_number, days, first_name, last_name, start_time, '-', end_time, section)


                    #note strip everything
                    
                    
                

    def load_first_webpage(self):
        def load_course_info(html):
            html = BeautifulSoup(temp.text, 'html.parser')
            lines = html.find(['select']).find('option')
            for line in lines:
                line = str(line)

                pattern = r'"(.*?)"|>([^<]*?)<'

                # Find all matches
                matches = re.findall(pattern, line)

                # Extract captured groups
                result = [match[0] or match[1] for match in matches]  # Combine non-empty groups
                if len(result) == 2:
                    self.course_info.append(result)
            print(self.course_info)
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
        temp = self.session.post(self.url, data=payload)
        if self.found_info == False:
            load_course_info(temp)
        

    def get_professors(self):
        print("__________________________")
        self.load_first_webpage()
        self.load_second_webpage()
CUNYScraper(1,2)
