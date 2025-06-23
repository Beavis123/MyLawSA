import sqlite3
from datetime import datetime
from .database_setup import DATABASE_PATH, create_connection

# --- Training Plan CRUD Operations ---

def add_training_plan(plan_name):
    """Adds a new training plan."""
    conn = create_connection()
    if not conn:
        return None

    sql = '''INSERT INTO training_plans(plan_name, creation_date)
             VALUES(?,?)'''
    try:
        cur = conn.cursor()
        creation_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cur.execute(sql, (plan_name, creation_date))
        conn.commit()
        return cur.lastrowid # Returns the id of the newly inserted plan
    except sqlite3.IntegrityError as e:
        print(f"Error adding training plan (likely plan name '{plan_name}' already exists): {e}")
        return None
    except sqlite3.Error as e:
        print(f"Database error adding training plan: {e}")
        return None
    finally:
        if conn:
            conn.close()

def get_training_plan_by_id(plan_id):
    """Retrieves a specific training plan by its ID."""
    conn = create_connection()
    if not conn:
        return None
    try:
        cur = conn.cursor()
        cur.execute("SELECT plan_id, plan_name, creation_date FROM training_plans WHERE plan_id=?", (plan_id,))
        return cur.fetchone() # Returns a tuple (id, name, date) or None
    except sqlite3.Error as e:
        print(f"Database error getting training plan by ID: {e}")
        return None
    finally:
        if conn:
            conn.close()

def get_all_training_plans():
    """Retrieves all training plans."""
    conn = create_connection()
    if not conn:
        return []
    try:
        cur = conn.cursor()
        cur.execute("SELECT plan_id, plan_name, creation_date FROM training_plans ORDER BY plan_name")
        return cur.fetchall() # Returns a list of tuples
    except sqlite3.Error as e:
        print(f"Database error getting all training plans: {e}")
        return []
    finally:
        if conn:
            conn.close()

def update_training_plan_name(plan_id, new_plan_name):
    """Updates the name of an existing training plan."""
    conn = create_connection()
    if not conn:
        return False
    sql = '''UPDATE training_plans
             SET plan_name = ?
             WHERE plan_id = ?'''
    try:
        cur = conn.cursor()
        cur.execute(sql, (new_plan_name, plan_id))
        conn.commit()
        return cur.rowcount > 0 # True if a row was updated, False otherwise
    except sqlite3.IntegrityError as e:
        print(f"Error updating training plan (likely new plan name '{new_plan_name}' already exists): {e}")
        return False
    except sqlite3.Error as e:
        print(f"Database error updating training plan: {e}")
        return False
    finally:
        if conn:
            conn.close()

def delete_training_plan(plan_id):
    """Deletes a training plan and its associated workout days (due to CASCADE)."""
    conn = create_connection()
    if not conn:
        return False
    sql = 'DELETE FROM training_plans WHERE plan_id=?'
    try:
        cur = conn.cursor()
        cur.execute("PRAGMA foreign_keys = ON") # Ensure foreign key constraints are active for cascade
        cur.execute(sql, (plan_id,))
        conn.commit()
        return cur.rowcount > 0 # True if a row was deleted
    except sqlite3.Error as e:
        print(f"Database error deleting training plan: {e}")
        return False
    finally:
        if conn:
            conn.close()

# --- Workout Day CRUD Operations ---

def add_workout_day(plan_id, day_of_week, muscle_groups=None, duration_minutes=None):
    """Adds a workout day to a specific training plan."""
    conn = create_connection()
    if not conn:
        return None
    sql = '''INSERT INTO workout_days(plan_id, day_of_week, muscle_groups, duration_minutes)
             VALUES(?,?,?,?)'''
    try:
        cur = conn.cursor()
        cur.execute(sql, (plan_id, day_of_week, muscle_groups, duration_minutes))
        conn.commit()
        return cur.lastrowid
    except sqlite3.Error as e:
        print(f"Database error adding workout day: {e}")
        return None
    finally:
        if conn:
            conn.close()

def get_workout_days_for_plan(plan_id):
    """Retrieves all workout days for a given training plan."""
    conn = create_connection()
    if not conn:
        return []
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT workout_day_id, plan_id, day_of_week, muscle_groups, duration_minutes
            FROM workout_days
            WHERE plan_id=?
            ORDER BY day_of_week
        """, (plan_id,))
        return cur.fetchall()
    except sqlite3.Error as e:
        print(f"Database error getting workout days for plan: {e}")
        return []
    finally:
        if conn:
            conn.close()

def update_workout_day(workout_day_id, day_of_week, muscle_groups, duration_minutes):
    """Updates details of a specific workout day."""
    conn = create_connection()
    if not conn:
        return False
    sql = '''UPDATE workout_days
             SET day_of_week = ?, muscle_groups = ?, duration_minutes = ?
             WHERE workout_day_id = ?'''
    try:
        cur = conn.cursor()
        cur.execute(sql, (day_of_week, muscle_groups, duration_minutes, workout_day_id))
        conn.commit()
        return cur.rowcount > 0
    except sqlite3.Error as e:
        print(f"Database error updating workout day: {e}")
        return False
    finally:
        if conn:
            conn.close()

def delete_workout_day(workout_day_id):
    """Deletes a specific workout day."""
    conn = create_connection()
    if not conn:
        return False
    sql = 'DELETE FROM workout_days WHERE workout_day_id=?'
    try:
        cur = conn.cursor()
        cur.execute(sql, (workout_day_id,))
        conn.commit()
        return cur.rowcount > 0
    except sqlite3.Error as e:
        print(f"Database error deleting workout day: {e}")
        return False
    finally:
        if conn:
            conn.close()


# --- Workout Session and Exercise Set Operations ---

def start_workout_session(workout_day_id=None, custom_notes=""):
    """Starts a new workout session, optionally linked to a plan's workout day."""
    conn = create_connection()
    if not conn:
        return None
    sql = '''INSERT INTO workout_sessions(workout_day_id, date, notes)
             VALUES(?,?,?)'''
    try:
        cur = conn.cursor()
        current_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cur.execute(sql, (workout_day_id, current_date, custom_notes))
        conn.commit()
        return cur.lastrowid # Returns the ID of the new session
    except sqlite3.Error as e:
        print(f"Database error starting workout session: {e}")
        return None
    finally:
        if conn:
            conn.close()

def log_exercise_set(session_id, exercise_name, reps, weight):
    """Logs an exercise set for a given workout session."""
    conn = create_connection()
    if not conn:
        return None

    total_weight_moved = 0
    if reps is not None and weight is not None:
        try:
            total_weight_moved = int(reps) * float(weight)
        except ValueError:
            print("Invalid reps or weight value for calculating total_weight_moved.")
            # Decide if you want to proceed with logging if calculation fails, or return error
            # For now, it will log with total_weight_moved = 0 if conversion fails

    sql = '''INSERT INTO exercise_sets(session_id, exercise_name, reps, weight, total_weight_moved)
             VALUES(?,?,?,?,?)'''
    try:
        cur = conn.cursor()
        cur.execute(sql, (session_id, exercise_name, reps, weight, total_weight_moved))
        conn.commit()
        return cur.lastrowid # Returns the ID of the new set
    except sqlite3.Error as e:
        print(f"Database error logging exercise set: {e}")
        return None
    finally:
        if conn:
            conn.close()

def get_session_details(session_id):
    """Retrieves details for a specific session, including its sets."""
    conn = create_connection()
    if not conn:
        return None, []

    session_info = None
    sets_info = []

    try:
        cur = conn.cursor()
        # Get session info
        cur.execute("""
            SELECT ws.session_id, ws.date, ws.notes, wd.day_of_week, wd.muscle_groups
            FROM workout_sessions ws
            LEFT JOIN workout_days wd ON ws.workout_day_id = wd.workout_day_id
            WHERE ws.session_id=?
        """, (session_id,))
        session_info = cur.fetchone()

        if session_info:
            # Get sets for this session
            cur.execute("""
                SELECT set_id, exercise_name, reps, weight, total_weight_moved
                FROM exercise_sets
                WHERE session_id=?
                ORDER BY set_id
            """, (session_id,))
            sets_info = cur.fetchall()

        return session_info, sets_info
    except sqlite3.Error as e:
        print(f"Database error getting session details: {e}")
        return None, []
    finally:
        if conn:
            conn.close()

def get_all_workout_sessions_summary():
    """Retrieves a summary of all workout sessions."""
    conn = create_connection()
    if not conn:
        return []
    try:
        cur = conn.cursor()
        # Example: Get session ID, date, notes, and planned day info if available
        cur.execute("""
            SELECT ws.session_id, ws.date, ws.notes,
                   tp.plan_name, wd.day_of_week, wd.muscle_groups,
                   (SELECT SUM(es.total_weight_moved) FROM exercise_sets es WHERE es.session_id = ws.session_id) as total_volume
            FROM workout_sessions ws
            LEFT JOIN workout_days wd ON ws.workout_day_id = wd.workout_day_id
            LEFT JOIN training_plans tp ON wd.plan_id = tp.plan_id
            ORDER BY ws.date DESC
        """)
        return cur.fetchall()
    except sqlite3.Error as e:
        print(f"Database error getting all workout sessions: {e}")
        return []
    finally:
        if conn:
            conn.close()

def update_session_notes(session_id, notes):
    """Updates the notes for a given workout session."""
    conn = create_connection()
    if not conn:
        return False
    sql = '''UPDATE workout_sessions
             SET notes = ?
             WHERE session_id = ?'''
    try:
        cur = conn.cursor()
        cur.execute(sql, (notes, session_id))
        conn.commit()
        return cur.rowcount > 0
    except sqlite3.Error as e:
        print(f"Database error updating session notes: {e}")
        return False
    finally:
        if conn:
            conn.close()

def delete_workout_session(session_id):
    """Deletes a workout session and its associated exercise sets (due to CASCADE)."""
    conn = create_connection()
    if not conn:
        return False
    sql = 'DELETE FROM workout_sessions WHERE session_id=?'
    try:
        cur = conn.cursor()
        cur.execute("PRAGMA foreign_keys = ON") # Ensure foreign key constraints are active for cascade
        cur.execute(sql, (session_id,))
        conn.commit()
        return cur.rowcount > 0
    except sqlite3.Error as e:
        print(f"Database error deleting workout session: {e}")
        return False
    finally:
        if conn:
            conn.close()

# --- Example Usage (for testing this module directly) ---
if __name__ == '__main__':
    # Initialize the database if it hasn't been already
    from .database_setup import initialize_database
    initialize_database() # Make sure tables are created

    print("\n--- Testing Training Plan CRUD ---")
    plan_id1 = add_training_plan("My First Plan")
    if plan_id1:
        print(f"Added plan with ID: {plan_id1}")
    else:
        print("Failed to add 'My First Plan', it might already exist.")
        # Try to get it if it exists
        plans = get_all_training_plans()
        for p in plans:
            if p[1] == "My First Plan":
                plan_id1 = p[0]
                print(f"Found existing 'My First Plan' with ID: {plan_id1}")
                break

    plan_id2 = add_training_plan("Strength Program")
    if plan_id2:
        print(f"Added plan with ID: {plan_id2}")

    if plan_id1:
        print("\nPlan by ID:", get_training_plan_by_id(plan_id1))

    print("\nAll plans:", get_all_training_plans())

    if plan_id1:
        update_training_plan_name(plan_id1, "My Updated First Plan")
        print("\nUpdated plan by ID:", get_training_plan_by_id(plan_id1))

    print("\n--- Testing Workout Day CRUD ---")
    if plan_id1:
        wd_id1 = add_workout_day(plan_id1, "Monday", "Chest, Triceps", 60)
        print(f"Added workout day ID: {wd_id1} to plan {plan_id1}")
        wd_id2 = add_workout_day(plan_id1, "Wednesday", "Back, Biceps", 75)
        print(f"Added workout day ID: {wd_id2} to plan {plan_id1}")

        print("\nWorkout days for plan_id1:", get_workout_days_for_plan(plan_id1))
        if wd_id1:
            update_workout_day(wd_id1, "Monday", "Chest, Shoulders, Triceps", 90)
            print(f"\nUpdated workout day {wd_id1}. New details:")
            print(get_workout_days_for_plan(plan_id1)) # Re-fetch to see updated

    print("\n--- Testing Session and Set Logging ---")
    # Start a session linked to the first workout day of plan1, if it exists
    session_id_1 = None
    if plan_id1 and wd_id1:
        session_id_1 = start_workout_session(workout_day_id=wd_id1, custom_notes="Good chest day")
        print(f"Started session ID: {session_id_1} for workout_day_id {wd_id1}")
    else:
        session_id_1 = start_workout_session(custom_notes="Ad-hoc leg day") # Ad-hoc session
        print(f"Started ad-hoc session ID: {session_id_1}")


    if session_id_1:
        log_exercise_set(session_id_1, "Bench Press", 10, 100) # 1000
        log_exercise_set(session_id_1, "Bench Press", 8, 110)  # 880
        log_exercise_set(session_id_1, "Tricep Pushdown", 12, 20) # 240
        print(f"\nLogged sets for session {session_id_1}.")

        session_details, sets_details = get_session_details(session_id_1)
        print("\nSession Details:", session_details)
        print("Sets for this session:")
        for s_set in sets_details:
            print(s_set)

        update_session_notes(session_id_1, "Feeling strong on bench today!")
        updated_session_details, _ = get_session_details(session_id_1)
        print("\nUpdated Session Notes:", updated_session_details[2] if updated_session_details else "N/A")


    print("\n--- All Workout Sessions Summary ---")
    all_sessions = get_all_workout_sessions_summary()
    for session_summary in all_sessions:
        print(session_summary)

    # print("\n--- Testing Deletions (use with caution) ---")
    # if wd_id2:
    #     print(f"\nDeleting workout day {wd_id2}: {delete_workout_day(wd_id2)}")
    # if plan_id2:
    #     print(f"Deleting plan {plan_id2}: {delete_training_plan(plan_id2)}")
    # if session_id_1: # Deleting a session
    #    print(f"Deleting session {session_id_1}: {delete_workout_session(session_id_1)}")

    print("\nAll plans after potential deletions:", get_all_training_plans())
    if plan_id1:
        print("Workout days for plan_id1 after potential deletions:", get_workout_days_for_plan(plan_id1))

    print("\n--- Test Deleting a Plan with associated days and sessions ---")
    # Create a new plan, add days, log a session
    temp_plan_id = add_training_plan("Temporary Plan for Deletion Test")
    if temp_plan_id:
        print(f"Created temp_plan_id: {temp_plan_id}")
        temp_wd_id = add_workout_day(temp_plan_id, "Test Day", "Full Body", 60)
        print(f"Created temp_wd_id: {temp_wd_id} for plan {temp_plan_id}")
        if temp_wd_id:
            temp_session_id = start_workout_session(temp_wd_id, "Session for deletion test")
            print(f"Created temp_session_id: {temp_session_id} for day {temp_wd_id}")
            if temp_session_id:
                log_exercise_set(temp_session_id, "Squats", 5, 100)
                print(f"Logged set for session {temp_session_id}")

                # Now, try to delete the plan. Workout days should cascade delete.
                # Sessions linked to those workout days should have workout_day_id set to NULL.
                # Sets linked to those sessions should remain.
                print(f"\nAttempting to delete plan {temp_plan_id} (should cascade to workout_days)...")
                delete_success = delete_training_plan(temp_plan_id)
                print(f"Deletion of plan {temp_plan_id} successful: {delete_success}")

                print(f"Checking if plan {temp_plan_id} exists: {get_training_plan_by_id(temp_plan_id)}")
                print(f"Checking workout days for plan {temp_plan_id}: {get_workout_days_for_plan(temp_plan_id)}")

                if temp_session_id:
                    s_info, s_sets = get_session_details(temp_session_id)
                    print(f"Session {temp_session_id} info after plan deletion: {s_info}") # workout_day_id should be None
                    print(f"Session {temp_session_id} sets after plan deletion: {s_sets}") # sets should remain

                    # Clean up the session too if it's still there
                    print(f"Deleting session {temp_session_id}: {delete_workout_session(temp_session_id)}")
                    s_info_after_delete, _ = get_session_details(temp_session_id)
                    print(f"Session {temp_session_id} info after session deletion: {s_info_after_delete}")

    print("\nFinal list of all plans:", get_all_training_plans())
    print("Final list of all sessions:", get_all_workout_sessions_summary())
