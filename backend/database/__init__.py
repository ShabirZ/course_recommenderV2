# database/__init__.py

# This makes the Engine and SessionLocal available directly from the 'database' package.
from .connection import engine 
from .connection import SessionLocal 