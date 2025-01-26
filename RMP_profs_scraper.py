import concurrent.futures
import requests
from bs4 import BeautifulSoup
import re
from SQL_Server import DatabaseManager
# Assuming DatabaseManager is imported if needed
# from SQL_Server import DatabaseManager

session = requests.Session()  # Using a single session
db = DatabaseManager()
def get_prof_score(first_name, last_name, prof_ID, results):
    url = f'https://www.ratemyprofessors.com/professor/{prof_ID}'
    html = session.get(url)
    soup = BeautifulSoup(html.text, 'html.parser')

    # Extract rating
    rating_html = str(soup.find('div', class_="RatingValue__Numerator-qw8sqy-2 liyUjw"))
    try:
        rating = re.findall('>(.*?)<', rating_html)[0]
    except IndexError:
        rating = None  # Handle case when rating is not found
    
    # Extract difficulty
    difficulty_html = str(soup.find_all('div', class_="FeedbackItem__FeedbackNumber-uof32n-1 kkESWs")[1])
    try:
        difficulty = re.findall('>(.*?)<', difficulty_html)[0]
    except IndexError:
        difficulty = None  # Handle case when difficulty is not found

    # Uncomment below if you want to insert the data into the DB
    #db.insert_into_rmp_table(first_name.strip(), last_name.strip(), int(prof_ID.strip()), float(rating), float(difficulty))
    results.append([first_name.strip(), last_name.strip(), int(prof_ID.strip()), float(rating), float(difficulty)])
    print(f"{first_name.strip()} {last_name.strip()} {int(prof_ID.strip())} {rating} {difficulty}")

def process_professors(file_path):
    results = []
    with open(file_path, mode='r') as file:
        lines = file.readlines()[1:]  # Skip header line
        # Using ThreadPoolExecutor to manage multiple threads with 15 workers
        with concurrent.futures.ThreadPoolExecutor(max_workers=15) as executor:
            futures = []
            for line in lines:
                first_name, last_name, prof_ID = [entry.strip() for entry in line.split(',')]
                # Submit each task (professor data fetching) to the thread pool
                futures.append(executor.submit(get_prof_score, first_name, last_name, prof_ID,results))
            
            # Wait for all threads to finish
            for future in concurrent.futures.as_completed(futures):
                future.result()  # Block until each thread finishes
    for first_name, last_name, prof_ID, rating, difficulty in results:
        db.insert_into_rmp_table(first_name, last_name, prof_ID, rating, difficulty)
# Run the process
process_professors('prof_RMP_ID.csv')


"""
import requests
from bs4 import BeautifulSoup
import re
from SQL_Server import DatabaseManager

# Open the original file for reading
session = requests.session()
db = DatabaseManager()

def get_prof_score(url):
    html = session.get(url)
    soup = BeautifulSoup(html.text, 'html.parser')
    rating_html = str(soup.find('div',class_ = "RatingValue__Numerator-qw8sqy-2 liyUjw"))
    rating = re.findall('>(.*?)<', rating_html)[0]
    
    difficulty_html = str(soup.find_all('div', class_ = "FeedbackItem__FeedbackNumber-uof32n-1 kkESWs")[1])
    difficulty = re.findall('>(.*?)<', difficulty_html)[0]

    #db.insert_into_rmp_table(first_name, last_name, int(prof_ID), float(rating), float(difficulty))
    print(first_name.strip(), last_name.strip(), int(prof_ID.strip()), float(rating), float(difficulty))
with open('prof_RMP_ID.csv', mode='r') as file:
    # Create a list to store the updated rows
    updated_rows = []
    i = 0
    for line in file:
        if i == 0:
            i+=1
            continue
        # Split and clean the data
        first_name, last_name, prof_ID = first_name, last_name, prof_ID = [entry.strip() for entry in line.split(',')]

        #https://www.ratemyprofessors.com/professor/287312  
        url = 'https://www.ratemyprofessors.com/professor/'+prof_ID
        url = url.strip()
        
        get_prof_score(url)
        i+=1
"""