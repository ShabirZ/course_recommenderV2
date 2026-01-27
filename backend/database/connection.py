import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from google.cloud.sql.connector import Connector, IPTypes
import pymysql
from sqlalchemy.engine import URL


load_dotenv()
# Environment variables
DB_USER = os.getenv("DB_USER_CLOUD", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD_CLOUD")
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("INSTANCE_CONNECTION_NAME")  
DB_PORT = os.getenv("DB_PORT", "3306")

# Decide IP type (private vs public)
ip_type = IPTypes.PRIVATE if os.environ.get("PRIVATE_IP") else IPTypes.PUBLIC

# Create Connector instance
connector = Connector()

print('test')
def getconn():
    """Function passed to SQLAlchemy to create connections"""
    conn = connector.connect(
        DB_HOST,  # instance connection name for GCP: <project>:<region>:<instance>
        "pymysql",
        user=DB_USER,
        password=DB_PASSWORD,
        db=DB_NAME,
        ip_type=ip_type
    )
    return conn

# Create SQLAlchemy engine using the Connector
SQLALCHEMY_DATABASE_URL = URL.create(
    drivername="mysql+pymysql",
    username=DB_USER,
    password=DB_PASSWORD,
    host=None,      # host is None because Connector provides the socket
    port=None,      # port is handled by the Connector
    database=DB_NAME
)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
    creator=getconn  # Pass the connection function
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
"""
with SessionLocal() as session:
    result = session.execute(text("SELECT DATABASE(), USER();"))
    print("Connected to DB:", result.fetchall())
"""
"""
def local_connect():
    load_dotenv()

    #local connect
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_NAME = os.getenv("DB_NAME")
    DB_PORT = os.getenv("DB_PORT", "3306")

    SQLALCHEMY_DATABASE_URL = (
        f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}"
        f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True
    )
    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )
"""

def valid_connection() -> bool:
    """Tests the connection to the database by executing a version query."""
    try:
        # Attempts to establish a connection from the engine
        with engine.connect() as connection:
            
            # Execute a simple query that all SQL DBs support
            result = connection.execute(text("SELECT VERSION()"))
            db_version = result.scalar()
            
            print(f"Connection successful Database version: {db_version}")
            return True
            
    except Exception as e:
        # Catch errors like incorrect credentials, host, or server being down
        print(f"Error details: {e}")
        return False
