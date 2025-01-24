from bs4 import BeautifulSoup
import requests
import json
import re
from SQL_Server import DatabaseManager
import base64

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
        return prof_count
    def load_all_profs(self, prof_count):
        def encode(offset):
            #arrayconnection:{offset}

            input_byte = f"arrayconnection:{offset}".encode('utf-8')
            encoded_bytes = base64.b64encode(input_byte)
            
            # Convert the encoded bytes back to a string and return it
            encoded_string = encoded_bytes.decode('utf-8')
            return encoded_string
        
        """
        when loading more profs in RMP u send a req for how many profs u want to load I will load all of them in
        """
        
        """
        Request URL:
            https://www.ratemyprofessors.com/graphql
            Request Method:
            POST

            variables: 
            {count: 8, cursor: "YXJyYXljb25uZWN0aW9uOjMx",…}
            count: {prof_count}
            cursor: "YXJyYXljb25uZWN0aW9uOjMx"
            query:  {text: "", schoolID: "U2Nob29sLTIzMQ==", fallback: true}        

            
        """

        # Define the URL and payload
        web_server_api_url = "https://www.ratemyprofessors.com/graphql"

        # Payload to send in the POST request
        #
        payload = {
            "query": "query TeacherSearchPaginationQuery(\n  $count: Int!\n  $cursor: String\n  $query: TeacherSearchQuery!\n) {\n  search: newSearch {\n    ...TeacherSearchPagination_search_1jWD3d\n  }\n}\n\nfragment TeacherSearchPagination_search_1jWD3d on newSearch {\n  teachers(query: $query, first: $count, after: $cursor) {\n    didFallback\n    edges {\n      cursor\n      node {\n        ...TeacherCard_teacher\n        id\n        __typename\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    resultCount\n    filters {\n      field\n      options {\n        value\n        id\n      }\n    }\n  }\n}\n\nfragment TeacherCard_teacher on Teacher {\n  id\n  legacyId\n  avgRating\n  numRatings\n  ...CardFeedback_teacher\n  ...CardSchool_teacher\n  ...CardName_teacher\n  ...TeacherBookmark_teacher\n}\n\nfragment CardFeedback_teacher on Teacher {\n  wouldTakeAgainPercent\n  avgDifficulty\n}\n\nfragment CardSchool_teacher on Teacher {\n  department\n  school {\n    name\n    id\n  }\n}\n\nfragment CardName_teacher on Teacher {\n  firstName\n  lastName\n}\n\nfragment TeacherBookmark_teacher on Teacher {\n  id\n  isSaved\n}\n",
            "variables": {
                "count": 10,
                "cursor": "YXJyYXljb25uZWN0aW9uOjc=",
                "query": {
                    "text": "",
                    "schoolID": "U2Nob29sLTIzMQ==",
                    "fallback": True
                }
            }
        }

        # Authorization header with Basic Authentication (base64-encoded)
        headers = {
            "Authorization": "Basic dGVzdDp0ZXN0",  # base64-encoded "test:test"
            "Content-Type": "application/json"  # Ensuring content is sent as JSON
        }

        # Send the POST request with Authorization and payload
        
        first_name = ""
        last_name = ""
        legacy_ID = ""
        leg_count = 1
        offset = 0
        while offset < min(prof_count,50):
            encoded_cursor = encode(offset)
            count_size = min(20, prof_count-offset)
            payload["variables"]["count"] = count_size
            payload["variables"]["cursor"] = encoded_cursor 
            response_json = self.session.post(web_server_api_url, headers=headers, data=json.dumps(payload))
            response_text = re.sub(r'[\'"]', '', response_json.text)
            result = re.split(r'[,:]', response_json.text)

            for i in range(len(result)):
                result[i] = re.sub(r'[\'\"]', '', result[i])
                if result[i] == 'firstName':
                    first_name = result[i+1]
                elif result[i] == 'lastName':
                    last_name = result[i+1]
                elif result[i] == 'legacyId':
                    legacy_ID = result[i+1]
                    print(first_name, last_name, legacy_ID)
                    print(leg_count)
                    leg_count+=1
            print(offset)
            offset+=count_size


        
            #firstName
            #lastName
            #legacyID
        
a = rmpProfessorIdScraper()
prof_count = a.load_front_page()
a.load_all_profs(prof_count)