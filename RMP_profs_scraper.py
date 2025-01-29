import requests
from bs4 import BeautifulSoup
import re
import csv
from concurrent.futures import ThreadPoolExecutor

# Function to get professor score and append rating and difficulty to CSV
def get_prof_score(url, first_name, last_name, prof_ID, writer):
    print(first_name, last_name)
    html = requests.get(url)
    soup = BeautifulSoup(html.text, 'html.parser')
    rating_html = str(soup.find('div',class_ = "RatingValue__Numerator-qw8sqy-2 liyUjw"))

    rating = re.findall('>(.*?)<', rating_html)
    if len(rating) == 0:
        return
    rating = rating[0]

    difficulty_html = str(soup.find_all('div', class_ = "FeedbackItem__FeedbackNumber-uof32n-1 kkESWs")[1])
    difficulty = re.findall('>(.*?)<', difficulty_html)[0]

    # Write the row with rating and difficulty to the CSV
    writer.writerow([first_name, last_name, prof_ID, rating, difficulty])

# Main function to read the CSV file, process each row, and overwrite the results
def process_data():
    # Open the CSV file for reading
    with open('prof_RMP_ID.csv', mode='r') as infile:
        reader = csv.reader(infile)
        rows = list(reader)
        
    # Open the CSV file for writing (this will overwrite the file)
    with open('prof_RMP_ID.csv', mode='a', newline='') as outfile:
        writer = csv.writer(outfile)
        
        # Write the header row (if necessary)
        writer.writerow(["first_name", "last_name", "prof_ID", "rating", "difficulty"])
        
        # Use ThreadPoolExecutor for concurrent processing
        with ThreadPoolExecutor(max_workers=20) as executor:
            for row in rows[1:]:  # Skip the header row
                first_name, last_name, prof_ID = [entry.strip() for entry in row]
                url = 'https://www.ratemyprofessors.com/professor/' + prof_ID
                # Submit the task to the executor
                executor.submit(get_prof_score, url, first_name, last_name, prof_ID, writer)

# Run the main function
#process_data()

#if any data missing:
# File paths
old_file_path = "old_list.csv"
new_file_path = "prof_RMP_ID.csv"
with open('prof_RMP_ID.csv', mode='a', newline='') as outfile:
    writer = csv.writer(outfile)
# Open and read the CSV files
with open(old_file_path, 'r') as old_file, open(new_file_path, 'r') as new_file:
    old_csv = list(csv.DictReader(old_file))
    new_csv = list(csv.DictReader(new_file))

# Verify the loaded data (optional)
print(f"Old CSV has {len(old_csv)} rows.")
print(f"New CSV has {len(new_csv)} rows.")


# Step 2: Find missing entries
seen = set()
for row in new_csv:
    seen.add(row['prof_ID'])
for row in old_csv:
    if row['PROF_ID'] not in seen:
        first_name = row['first_name']
        last_name = row['last_name']
        id = row['PROF_ID']
        url = 'https://www.ratemyprofessors.com/professor/'
        print(first_name, last_name, id)
        #get_prof_score(url, first_name, last_name, id, writer)



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