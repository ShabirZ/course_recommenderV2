import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv


load_dotenv()

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
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
)
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
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

# Example usage:
# connection_status = valid_connection()