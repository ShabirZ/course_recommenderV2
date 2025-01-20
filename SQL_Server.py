import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="___",
    passwd="___"
)
mycursor = db.cursor()

mycursor.execute("DROP DATABASE testDB")