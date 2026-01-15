import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv


load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
)
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

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