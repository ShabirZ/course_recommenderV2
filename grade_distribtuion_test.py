import pandas as pd
import openpyxl
import csv

print('start')
sheets = pd.read_excel('Copy of Grade Distribution 2012-2023 Queens College (1).xlsx', sheet_name = None)
new_names = ['f2023', 's2023', 'f2022','s2022','f2021']
old_names = ['s2021', 'f2020','s2020','f2019','s2019','f2018','s2018','f2017']

file = open('prof_grade_avg.csv', mode='a', newline='')
writer = csv.writer(file)


def get_data(df, writer):
  for row in range(len(df)):
    print(df.iloc[row]['SUBJECT'], df.iloc[row]['NBR'], df.iloc[row]['PROF'], df.iloc[row]['AVG GPA'])
    writer.writerow([df.iloc[row]['PROF'], df.iloc[row]['SUBJECT'], df.iloc[row]['NBR'],  df.iloc[row]['AVG GPA']])
for name in new_names:
  # A:1  U:21
  df = sheets[name]
  data = get_data(df, writer)
