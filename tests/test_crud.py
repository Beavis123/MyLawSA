import unittest
import os
import sqlite3
from datetime import datetime

# Adjust import path to access modules in jym_app from tests directory
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from jym_app.core import crud
from jym_app.core.database_setup import initialize_database, DATABASE_PATH as REAL_DB_PATH

# Use a dedicated test database
TEST_DB_NAME = "test_jym_app.db"
TEST_DB_PATH = os.path.join(os.path.dirname(__file__), TEST_DB_NAME)

class TestCrudOperations(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Set up a test database before all tests."""
        # Override the DATABASE_PATH for crud operations to use the test DB
        crud.DATABASE_PATH = TEST_DB_PATH
        # Initialize the test database (creates tables)
        initialize_database() # This will now use TEST_DB_PATH due to the override

    @classmethod
    def tearDownClass(cls):
        """Clean up the test database file after all tests."""
        if os.path.exists(TEST_DB_PATH):
            os.remove(TEST_DB_PATH)
        # Restore original DB path for crud module if needed elsewhere, though for tests it's fine
        crud.DATABASE_PATH = REAL_DB_PATH


    def setUp(self):
        """Ensure the database is clean before each test method."""
        conn = crud.create_connection() # Uses TEST_DB_PATH
        if conn:
            cursor = conn.cursor()
            # Clear all data from tables
            cursor.execute("DELETE FROM exercise_sets")
            cursor.execute("DELETE FROM workout_sessions")
            cursor.execute("DELETE FROM workout_days")
            cursor.execute("DELETE FROM training_plans")
            conn.commit()
            conn.close()
        else:
            self.fail("Could not connect to test database in setUp")

    # --- Training Plan Tests ---
    def test_add_and_get_training_plan(self):
        plan_id = crud.add_training_plan("Strength Plan")
        self.assertIsNotNone(plan_id, "Should return an ID for new plan")

        plan = crud.get_training_plan_by_id(plan_id)
        self.assertIsNotNone(plan)
        self.assertEqual(plan[1], "Strength Plan") # plan_name is at index 1

        # Test adding a duplicate plan name (should fail or return None)
        duplicate_plan_id = crud.add_training_plan("Strength Plan")
        self.assertIsNone(duplicate_plan_id, "Adding duplicate plan name should fail")

    def test_get_all_training_plans(self):
        crud.add_training_plan("Plan A")
        crud.add_training_plan("Plan B")
        plans = crud.get_all_training_plans()
        self.assertEqual(len(plans), 2)

    def test_update_training_plan_name(self):
        plan_id = crud.add_training_plan("Old Name Plan")
        self.assertTrue(plan_id is not None)

        success = crud.update_training_plan_name(plan_id, "New Name Plan")
        self.assertTrue(success)

        updated_plan = crud.get_training_plan_by_id(plan_id)
        self.assertEqual(updated_plan[1], "New Name Plan")

        # Test updating to an existing name (should fail if UNIQUE constraint is effective)
        plan_id2 = crud.add_training_plan("Another Plan")
        self.assertTrue(plan_id2 is not None)
        fail_update = crud.update_training_plan_name(plan_id2, "New Name Plan")
        self.assertFalse(fail_update, "Should not be able to update to an existing plan name")


    def test_delete_training_plan(self):
        plan_id = crud.add_training_plan("To Be Deleted")
        self.assertTrue(plan_id is not None)

        # Add a workout day to test cascade delete
        wd_id = crud.add_workout_day(plan_id, "Monday", "Chest", 60)
        self.assertIsNotNone(wd_id)

        delete_success = crud.delete_training_plan(plan_id)
        self.assertTrue(delete_success)
        self.assertIsNone(crud.get_training_plan_by_id(plan_id))

        # Verify cascade delete of workout_days
        days_after_delete = crud.get_workout_days_for_plan(plan_id)
        self.assertEqual(len(days_after_delete), 0, "Workout days should be deleted by cascade")


    # --- Workout Day Tests ---
    def test_add_and_get_workout_day(self):
        plan_id = crud.add_training_plan("Test Plan For Days")
        self.assertIsNotNone(plan_id)

        wd_id = crud.add_workout_day(plan_id, "Tuesday", "Back, Biceps", 90)
        self.assertIsNotNone(wd_id)

        days = crud.get_workout_days_for_plan(plan_id)
        self.assertEqual(len(days), 1)
        self.assertEqual(days[0][2], "Tuesday") # day_of_week
        self.assertEqual(days[0][3], "Back, Biceps") # muscle_groups

    def test_update_workout_day(self):
        plan_id = crud.add_training_plan("Plan for Updating Day")
        wd_id = crud.add_workout_day(plan_id, "Wednesday", "Legs", 60)
        self.assertIsNotNone(wd_id)

        success = crud.update_workout_day(wd_id, "Thorsday", "Legs & Shoulders", 75)
        self.assertTrue(success)

        days = crud.get_workout_days_for_plan(plan_id)
        self.assertEqual(days[0][2], "Thorsday")
        self.assertEqual(days[0][4], 75) # duration_minutes

    def test_delete_workout_day(self):
        plan_id = crud.add_training_plan("Plan for Deleting Day")
        wd_id1 = crud.add_workout_day(plan_id, "Friday", "Full Body", 60)
        wd_id2 = crud.add_workout_day(plan_id, "Saturday", "Cardio", 45)
        self.assertIsNotNone(wd_id1)
        self.assertIsNotNone(wd_id2)

        delete_success = crud.delete_workout_day(wd_id1)
        self.assertTrue(delete_success)

        days = crud.get_workout_days_for_plan(plan_id)
        self.assertEqual(len(days), 1)
        self.assertEqual(days[0][0], wd_id2) # Check remaining day is the correct one


    # --- Workout Session and Exercise Set Tests ---
    def test_start_workout_session_ad_hoc(self):
        session_id = crud.start_workout_session(custom_notes="Ad-hoc session notes")
        self.assertIsNotNone(session_id)

        session_info, _ = crud.get_session_details(session_id)
        self.assertIsNotNone(session_info)
        self.assertIsNone(session_info[3]) # day_of_week should be None for ad-hoc
        self.assertEqual(session_info[2], "Ad-hoc session notes") # notes

    def test_start_workout_session_planned(self):
        plan_id = crud.add_training_plan("Planned Session Test Plan")
        wd_id = crud.add_workout_day(plan_id, "Sunday", "Rest Day Activities", 30)
        self.assertIsNotNone(wd_id)

        session_id = crud.start_workout_session(workout_day_id=wd_id, custom_notes="Planned light activity")
        self.assertIsNotNone(session_id)

        session_info, _ = crud.get_session_details(session_id)
        self.assertIsNotNone(session_info)
        self.assertEqual(session_info[3], "Sunday") # Check day_of_week from workout_days table
        self.assertEqual(session_info[2], "Planned light activity")

    def test_log_exercise_set_and_volume(self):
        session_id = crud.start_workout_session()
        self.assertIsNotNone(session_id)

        set_id1 = crud.log_exercise_set(session_id, "Squats", 10, 100) # Volume: 1000
        self.assertIsNotNone(set_id1)
        set_id2 = crud.log_exercise_set(session_id, "Bench Press", 5, 80) # Volume: 400
        self.assertIsNotNone(set_id2)

        _session_info, sets = crud.get_session_details(session_id)
        self.assertEqual(len(sets), 2)

        # Check details of the first set (Squats)
        # set_id, exercise_name, reps, weight, total_weight_moved
        self.assertEqual(sets[0][1], "Squats")
        self.assertEqual(sets[0][2], 10) # reps
        self.assertEqual(sets[0][3], 100) # weight
        self.assertEqual(sets[0][4], 1000) # total_weight_moved

        # Check total volume for the session from summary
        sessions_summary = crud.get_all_workout_sessions_summary()
        found_session_summary = False
        for s_summary in sessions_summary:
            if s_summary[0] == session_id: # session_id is at index 0
                self.assertEqual(s_summary[6], 1400) # total_volume is at index 6
                found_session_summary = True
                break
        self.assertTrue(found_session_summary, "Session summary not found or volume incorrect")

    def test_log_exercise_set_no_weight(self):
        session_id = crud.start_workout_session()
        set_id = crud.log_exercise_set(session_id, "Push-ups", 20, 0) # Bodyweight, weight is 0
        self.assertIsNotNone(set_id)
        _s, sets = crud.get_session_details(session_id)
        self.assertEqual(sets[0][3], 0) # weight
        self.assertEqual(sets[0][4], 0) # total_weight_moved

    def test_update_session_notes(self):
        session_id = crud.start_workout_session(custom_notes="Initial notes.")
        self.assertIsNotNone(session_id)

        success = crud.update_session_notes(session_id, "Updated session notes.")
        self.assertTrue(success)

        session_info, _ = crud.get_session_details(session_id)
        self.assertEqual(session_info[2], "Updated session notes.")

    def test_delete_workout_session_cascade(self):
        session_id = crud.start_workout_session()
        self.assertIsNotNone(session_id)
        crud.log_exercise_set(session_id, "Curls", 10, 10)
        crud.log_exercise_set(session_id, "Rows", 10, 20)

        delete_success = crud.delete_workout_session(session_id)
        self.assertTrue(delete_success)

        session_info, sets = crud.get_session_details(session_id)
        self.assertIsNone(session_info, "Session info should be None after delete")
        self.assertEqual(len(sets), 0, "Sets should be deleted by cascade when session is deleted")

    def test_delete_training_plan_effect_on_sessions(self):
        # Setup: Plan -> WorkoutDay -> Session -> Set
        plan_id = crud.add_training_plan("Plan With Sessions")
        wd_id = crud.add_workout_day(plan_id, "TestDayForSessionCascade", "Muscles", 60)
        session_id = crud.start_workout_session(workout_day_id=wd_id, custom_notes="Session under a plan")
        crud.log_exercise_set(session_id, "Exercise A", 5, 50)

        self.assertIsNotNone(plan_id)
        self.assertIsNotNone(wd_id)
        self.assertIsNotNone(session_id)

        # Action: Delete the plan
        crud.delete_training_plan(plan_id)

        # Assertions:
        # Plan should be gone
        self.assertIsNone(crud.get_training_plan_by_id(plan_id))
        # WorkoutDay linked to plan should be gone (CASCADE)
        self.assertEqual(len(crud.get_workout_days_for_plan(plan_id)), 0)

        # Session should still exist, but its workout_day_id should be NULL (ON DELETE SET NULL)
        session_info, sets = crud.get_session_details(session_id)
        self.assertIsNotNone(session_info, "Session itself should NOT be deleted")
        self.assertIsNone(session_info[3], "Session's workout_day_id (day_of_week in this query) should be NULL") # Index 3 is wd.day_of_week

        # Sets within the session should still exist
        self.assertEqual(len(sets), 1, "Sets within the session should remain")


if __name__ == '__main__':
    unittest.main()
