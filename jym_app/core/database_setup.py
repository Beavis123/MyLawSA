import sqlite3
import os

DATABASE_NAME = "jym_app.db"
DATABASE_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', DATABASE_NAME)

def create_connection(db_file=DATABASE_PATH):
    """ Create a database connection to the SQLite database specified by db_file """
    conn = None
    try:
        # Ensure the data directory exists
        os.makedirs(os.path.dirname(db_file), exist_ok=True)
        conn = sqlite3.connect(db_file)
        print(f"SQLite version: {sqlite3.sqlite_version}")
        print(f"Successfully connected to database at {db_file}")
    except sqlite3.Error as e:
        print(e)
    return conn

def create_tables(conn):
    """ Create tables from the create_table_sql statements """
    sql_create_training_plans_table = """
    CREATE TABLE IF NOT EXISTS training_plans (
        plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
        plan_name TEXT NOT NULL UNIQUE,
        creation_date TEXT NOT NULL
    );
    """

    sql_create_workout_days_table = """
    CREATE TABLE IF NOT EXISTS workout_days (
        workout_day_id INTEGER PRIMARY KEY AUTOINCREMENT,
        plan_id INTEGER NOT NULL,
        day_of_week TEXT NOT NULL, -- e.g., "Monday", "Day 1"
        muscle_groups TEXT,
        duration_minutes INTEGER,
        FOREIGN KEY (plan_id) REFERENCES training_plans (plan_id) ON DELETE CASCADE
    );
    """

    sql_create_workout_sessions_table = """
    CREATE TABLE IF NOT EXISTS workout_sessions (
        session_id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_day_id INTEGER, -- Can be NULL if it's an ad-hoc workout not tied to a plan day
        date TEXT NOT NULL,
        notes TEXT,
        FOREIGN KEY (workout_day_id) REFERENCES workout_days (workout_day_id) ON DELETE SET NULL
    );
    """
    # Ad-hoc session might not have a workout_day_id from a plan initially.
    # Or, if a planned workout_day is deleted, we might want to keep the session log.

    sql_create_exercise_sets_table = """
    CREATE TABLE IF NOT EXISTS exercise_sets (
        set_id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        exercise_name TEXT NOT NULL,
        reps INTEGER,
        weight REAL, -- Using REAL for potential decimal values in weight
        total_weight_moved REAL, -- Calculated: reps * weight
        FOREIGN KEY (session_id) REFERENCES workout_sessions (session_id) ON DELETE CASCADE
    );
    """

    try:
        cursor = conn.cursor()
        print("Creating table: training_plans")
        cursor.execute(sql_create_training_plans_table)
        print("Creating table: workout_days")
        cursor.execute(sql_create_workout_days_table)
        print("Creating table: workout_sessions")
        cursor.execute(sql_create_workout_sessions_table)
        print("Creating table: exercise_sets")
        cursor.execute(sql_create_exercise_sets_table)
        conn.commit()
        print("Tables created successfully.")
    except sqlite3.Error as e:
        print(f"Error creating tables: {e}")

def initialize_database():
    """Initialize the database: create connection and tables."""
    print(f"Attempting to initialize database at: {DATABASE_PATH}")
    conn = create_connection()

    if conn is not None:
        create_tables(conn)
        conn.close()
        print("Database initialization complete.")
    else:
        print("Error! Cannot create the database connection.")

if __name__ == '__main__':
    # This allows running this script directly to set up the database
    print("Running database setup directly...")
    initialize_database()
    # Verify tables (optional manual check)
    # conn_check = create_connection()
    # if conn_check:
    #     cursor = conn_check.cursor()
    #     cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    #     tables = cursor.fetchall()
    #     print("Tables in database:", tables)
    #     conn_check.close()
