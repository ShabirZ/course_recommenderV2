import pandas as pd
import openpyxl
import csv

print('start')
sheets = pd.read_excel('grade_distribution_data\Copy of Grade Distribution 2012-2023 Queens College (1).xlsx', sheet_name = None)
new_term_names = ['f2023', 's2023', 'f2022','s2022','f2021','s2021'] 
old_term_names = ['f2020','s2020','s2019','f2018','s2018','f2017']



file = open('grade_distribution_data\prof_grade_avg.csv', mode='a', newline='')
writer = csv.writer(file)


def term_data(df, writer,term,tags):
  for row in range(len(df)):
    name = str(df.iloc[row][tags[0]]) # one prof is a int for some reason
    subject = df.iloc[row][tags[1]]
    course_number =df.iloc[row][tags[2]]
    average = df.iloc[row][tags[3]]
    name = name.replace(',', '') #working with csv remove commas
    print(df.iloc[row][tags[0]], df.iloc[row][tags[1]], df.iloc[row][tags[2]],  df.iloc[row][tags[3]],term)
    writer.writerow([name, subject, course_number,  average,term])


for term in new_term_names:
  # A:1  U:21
  df = sheets[term]
  tags = ['PROF', 'SUBJECT', 'NBR', 'AVG GPA']
  data = term_data(df, writer,term,tags)

for term in old_term_names:
  df = sheets[term]
  tags = ['Instructor', 'Subject','Course Number', 'Average GPA']
  data = term_data(df, writer,term,tags)

#special case
f_2019 = ['Instructor', 'Subject','Catalog Nbr', 'Average GPA']
df = sheets['f2019']
data = term_data(df,writer,'f2019',f_2019)



# Load the CSV file
df = pd.read_csv("grade_distribution_data\prof_grade_avg.csv", header=None)  # Assuming no headers

# Sort by column [1], then [2] if [1] is equal, then [4] if [2] is equal
df_sorted = df.sort_values(by=[1, 2, 4])

# Overwrite the same CSV file
df_sorted.to_csv("grade_distribution_data\prof_grade_avg.csv", index=False, header=False)
