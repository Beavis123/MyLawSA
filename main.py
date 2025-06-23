import kivy
kivy.require('2.0.0') # Minimum Kivy version

from kivy.app import App
from kivy.uix.screenmanager import ScreenManager, Screen
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.scrollview import ScrollView
from kivy.uix.textinput import TextInput
from kivy.uix.popup import Popup
from kivy.metrics import dp

# Attempt to initialize database on startup
# This is a good place to ensure the DB is ready before the UI tries to use it.
try:
    from jym_app.core.database_setup import initialize_database
    initialize_database()
    print("Database initialized/verified successfully from main.py.")
except ImportError:
    print("ERROR: Could not import initialize_database. Ensure jym_app.core.database_setup.py is correct.")
except Exception as e:
    print(f"ERROR: An unexpected error occurred during database initialization: {e}")

# Placeholder for CRUD functions - will be used by UI screens
try:
    from jym_app.core import crud
    print("CRUD functions imported successfully.")
except ImportError:
    print("ERROR: Could not import CRUD functions. Ensure jym_app.core.crud.py is correct.")
    crud = None # Define crud as None so app doesn't crash if import fails, handle in UI


class MainScreen(Screen):
    def __init__(self, **kwargs):
        super(MainScreen, self).__init__(**kwargs)
        layout = BoxLayout(orientation='vertical', padding=dp(10), spacing=dp(10))

        title = Label(text="Jym App - Main Menu", font_size='24sp', size_hint_y=None, height=dp(50))
        layout.add_widget(title)

        btn_plans = Button(text="Manage Training Plans", size_hint_y=None, height=dp(50))
        btn_plans.bind(on_press=self.go_to_plans)
        layout.add_widget(btn_plans)

        btn_start_workout = Button(text="Start Ad-hoc Workout", size_hint_y=None, height=dp(50))
        btn_start_workout.bind(on_press=self.go_to_start_workout) # Placeholder
        layout.add_widget(btn_start_workout)

        btn_history = Button(text="View Workout History", size_hint_y=None, height=dp(50))
        btn_history.bind(on_press=self.go_to_history) # Placeholder
        layout.add_widget(btn_history)

        layout.add_widget(Label()) # Spacer

        self.add_widget(layout)

    def go_to_plans(self, instance):
        self.manager.current = 'plans'

    def go_to_start_workout(self, instance):
        # This will be for ad-hoc workouts for now
        # A new session is started when the screen is entered if one isn't active
        if self.manager.has_screen('workout_log'):
            log_screen = self.manager.get_screen('workout_log')
            log_screen.start_new_session(workout_day_id=None) # None for ad-hoc
            self.manager.current = 'workout_log'
        else:
            print("ERROR: WorkoutLogScreen not defined yet.")


    def go_to_history(self, instance):
        if self.manager.has_screen('history'):
            self.manager.current = 'history'
            # The on_enter method of HistoryScreen will load the data
        else:
            print("ERROR: HistoryScreen not defined yet.")


class PlansScreen(Screen):
    def __init__(self, **kwargs):
        super(PlansScreen, self).__init__(**kwargs)
        self.layout = BoxLayout(orientation='vertical', padding=dp(10), spacing=dp(10))

        title = Label(text="Training Plans", font_size='24sp', size_hint_y=None, height=dp(50))
        self.layout.add_widget(title)

        # ScrollView for plan list
        self.scroll_view = ScrollView(size_hint=(1, 1))
        self.plans_list_layout = BoxLayout(orientation='vertical', size_hint_y=None, spacing=dp(5))
        self.plans_list_layout.bind(minimum_height=self.plans_list_layout.setter('height'))
        self.scroll_view.add_widget(self.plans_list_layout)
        self.layout.add_widget(self.scroll_view)

        btn_add_plan = Button(text="Add New Plan", size_hint_y=None, height=dp(50))
        btn_add_plan.bind(on_press=self.show_add_plan_popup)
        self.layout.add_widget(btn_add_plan)

        btn_back = Button(text="Back to Main Menu", size_hint_y=None, height=dp(50))
        btn_back.bind(on_press=self.go_to_main)
        self.layout.add_widget(btn_back)

        self.add_widget(self.layout)

    def on_enter(self, *args):
        """Called when the screen is about to be shown."""
        self.load_plans()

    def load_plans(self):
        self.plans_list_layout.clear_widgets()
        if crud:
            plans = crud.get_all_training_plans()
            if plans:
                for plan_id, plan_name, creation_date in plans:
                    plan_label_text = f"{plan_name} - Created: {creation_date.split(' ')[0]}" # Show only date part

                    # Use a Button for interactivity
                    plan_button = Button(text=plan_label_text, size_hint_y=None, height=dp(44), halign='left', valign='middle')
                    plan_button.text_size = (self.width - dp(40), None) # Allow text wrapping within button
                    plan_button.bind(on_press=lambda instance, p_id=plan_id, p_name=plan_name: self.edit_plan(p_id, p_name))
                    self.plans_list_layout.add_widget(plan_button)
            else:
                self.plans_list_layout.add_widget(Label(text="No training plans found. Add one!", size_hint_y=None, height=dp(40)))
        else:
            self.plans_list_layout.add_widget(Label(text="Error: CRUD functions not available.", size_hint_y=None, height=dp(40)))


    def go_to_main(self, instance):
        self.manager.current = 'main'

    def show_add_plan_popup(self, instance):
        content = BoxLayout(orientation='vertical', spacing=dp(10), padding=dp(10))
        self.plan_name_input = TextInput(hint_text='Enter Plan Name', multiline=False, size_hint_y=None, height=dp(40))
        content.add_widget(self.plan_name_input)

        btn_layout = BoxLayout(size_hint_y=None, height=dp(40), spacing=dp(10))
        btn_save = Button(text='Save Plan')
        btn_cancel = Button(text='Cancel')
        btn_layout.add_widget(btn_save)
        btn_layout.add_widget(btn_cancel)
        content.add_widget(btn_layout)

        popup = Popup(title='Add New Training Plan',
                      content=content,
                      size_hint=(0.8, 0.4),
                      auto_dismiss=False) # Prevent dismissing by clicking outside

        btn_save.bind(on_press=lambda x: self.save_new_plan(popup))
        btn_cancel.bind(on_press=popup.dismiss)

        popup.open()

    def save_new_plan(self, popup):
        plan_name = self.plan_name_input.text.strip()
        if not plan_name:
            # Optionally, show an error message in the popup or a new small popup
            print("Plan name cannot be empty.")
            # Simple feedback for now:
            self.plan_name_input.hint_text = "Name cannot be empty!"
            self.plan_name_input.text = "" # Clear if it was just spaces
            return

        if crud:
            new_plan_id = crud.add_training_plan(plan_name)
            if new_plan_id:
                print(f"Plan '{plan_name}' added with ID {new_plan_id}.")
                self.load_plans() # Refresh the list of plans
                popup.dismiss()
            else:
                # Handle case where plan name might already exist or other DB error
                print(f"Failed to add plan '{plan_name}'. It might already exist or DB error.")
                # Update popup to show error - for now, just print
                old_hint = self.plan_name_input.hint_text
                self.plan_name_input.hint_text = "Name may exist or DB error!"
                # Simple way to revert hint text after a moment or on focus
                # For a better UX, you might use Clock.schedule_once or a dedicated error label
                self.plan_name_input.text = plan_name # Keep their text
        else:
            print("ERROR: CRUD functions not available to save plan.")
            popup.dismiss()

    def edit_plan(self, plan_id, plan_name):
        """Switches to the PlanEditScreen for the selected plan."""
        if not self.manager.has_screen('edit_plan'):
            # Create the screen if it doesn't exist to avoid issues if this is called before build() is fully done for all screens
            # This is more of a safeguard; typically, all screens are added during build().
            edit_screen = PlanEditScreen(name='edit_plan')
            self.manager.add_widget(edit_screen)

        # Pass data to the screen. Kivy properties on the screen are a good way.
        # Or, call a method on the screen instance.
        edit_screen = self.manager.get_screen('edit_plan')
        edit_screen.load_plan_data(plan_id, plan_name)
        self.manager.current = 'edit_plan'


class PlanEditScreen(Screen):
    def __init__(self, **kwargs):
        super(PlanEditScreen, self).__init__(**kwargs)
        self.plan_id = None
        self.plan_name = ""
        self.layout = BoxLayout(orientation='vertical', padding=dp(10), spacing=dp(10))

        # Plan Name display (and future edit)
        self.plan_name_label = Label(text="Plan: ", font_size='20sp', size_hint_y=None, height=dp(40), halign='left', valign='middle')
        self.plan_name_label.bind(size=self.plan_name_label.setter('text_size'))

        self.btn_edit_plan_name = Button(text="Edit Name", size_hint_x=None, width=dp(100), size_hint_y=None, height=dp(40))
        self.btn_edit_plan_name.bind(on_press=self.show_edit_plan_name_popup)

        plan_header_layout = BoxLayout(orientation='horizontal', size_hint_y=None, height=dp(40))
        plan_header_layout.add_widget(self.plan_name_label)
        plan_header_layout.add_widget(self.btn_edit_plan_name)
        self.layout.add_widget(plan_header_layout)

        # Title for Workout Days
        workout_days_title = Label(text="Workout Days", font_size='18sp', size_hint_y=None, height=dp(30))
        self.layout.add_widget(workout_days_title)

        # ScrollView for workout days list
        self.days_scroll_view = ScrollView(size_hint=(1, 1))
        self.days_list_layout = BoxLayout(orientation='vertical', size_hint_y=None, spacing=dp(5))
        self.days_list_layout.bind(minimum_height=self.days_list_layout.setter('height'))
        self.days_scroll_view.add_widget(self.days_list_layout)
        self.layout.add_widget(self.days_scroll_view)

        # Buttons
        btn_add_day = Button(text="Add Workout Day", size_hint_y=None, height=dp(50))
        btn_add_day.bind(on_press=self.show_add_day_popup)


        btn_delete_plan = Button(text="Delete This Entire Plan", size_hint_y=None, height=dp(50), background_color=(0.8, 0.2, 0.2, 1))
        btn_delete_plan.bind(on_press=self.confirm_delete_plan)

        btn_back = Button(text="Back to Plans List", size_hint_y=None, height=dp(50))
        btn_back.bind(on_press=self.go_to_plans_list)

        # Bottom button layout
        bottom_button_layout = BoxLayout(orientation='vertical', size_hint_y=None, spacing=dp(10))
        bottom_button_layout.bind(minimum_height=bottom_button_layout.setter('height')) # Adapt height
        bottom_button_layout.add_widget(btn_add_day)
        bottom_button_layout.add_widget(btn_delete_plan)
        bottom_button_layout.add_widget(btn_back)
        self.layout.add_widget(bottom_button_layout)

        self.add_widget(self.layout)

    def load_plan_data(self, plan_id, plan_name):
        self.plan_id = plan_id
        self.plan_name = plan_name
        self.plan_name_label.text = f"Plan: {self.plan_name} (ID: {self.plan_id})"
        self.load_workout_days()

    def on_enter(self, *args):
        # This ensures that if the screen is entered without fresh data (e.g. back button),
        # it reloads its current plan_id's days.
        # However, load_plan_data should be the primary way to set what's displayed.
        if self.plan_id:
            self.load_workout_days()

    def load_workout_days(self):
        self.days_list_layout.clear_widgets()
        if crud and self.plan_id:
            workout_days = crud.get_workout_days_for_plan(self.plan_id)
            if workout_days:
                for wd_id, p_id, day_of_week, muscle_groups, duration in workout_days:
                    day_text = f"{day_of_week}: {muscle_groups or 'N/A'} ({duration or 'N/A'} mins)"
                    # Make workout day clickable for editing/deletion later
                    # Layout for each day: details + start button
                    day_entry_layout = BoxLayout(orientation='horizontal', size_hint_y=None, height=dp(44), spacing=dp(10))

                    day_label = Label(text=day_text, halign='left', valign='middle')
                    day_label.bind(size=day_label.setter('text_size')) # for wrapping

                    btn_start_planned_workout = Button(text="Start this Workout", size_hint_x=None, width=dp(150))
                    btn_start_planned_workout.bind(on_press=lambda instance, p_id=self.plan_id, p_name=self.plan_name, wd_id=wd_id, dow=day_of_week : \
                                                   self.start_planned_workout_action(p_id, p_name, wd_id, dow))

                    # TODO: Add an edit button for the day itself, distinct from starting it.
                    # For now, clicking the label area could be for edit, or add a dedicated small edit icon/button.
                    # Let's assume for now the "Start this Workout" is the primary action here.
                    # The edit/delete of workout days is handled by the popups from before.

                    day_entry_layout.add_widget(day_label)
                    day_entry_layout.add_widget(btn_start_planned_workout)
                    self.days_list_layout.add_widget(day_entry_layout)
            else:
                self.days_list_layout.add_widget(Label(text="No workout days defined for this plan.", size_hint_y=None, height=dp(40)))
        else:
            self.days_list_layout.add_widget(Label(text="Error: CRUD or Plan ID not available.", size_hint_y=None, height=dp(40)))

    def show_add_day_popup(self, instance):
        if not self.plan_id:
            print("No plan selected to add a day to.")
            return

        content = BoxLayout(orientation='vertical', spacing=dp(10), padding=dp(10))

        self.day_of_week_input = TextInput(hint_text='Day (e.g., Monday, Day 1)', multiline=False, size_hint_y=None, height=dp(40))
        self.muscle_groups_input = TextInput(hint_text='Muscle Groups (e.g., Chest, Triceps)', multiline=False, size_hint_y=None, height=dp(40))
        self.duration_input = TextInput(hint_text='Duration (minutes)', multiline=False, input_filter='int', size_hint_y=None, height=dp(40))

        content.add_widget(Label(text="Day of Week:"))
        content.add_widget(self.day_of_week_input)
        content.add_widget(Label(text="Muscle Groups (optional):"))
        content.add_widget(self.muscle_groups_input)
        content.add_widget(Label(text="Duration in minutes (optional):"))
        content.add_widget(self.duration_input)

        btn_layout = BoxLayout(size_hint_y=None, height=dp(40), spacing=dp(10))
        btn_save = Button(text='Save Day')
        btn_cancel = Button(text='Cancel')
        btn_layout.add_widget(btn_save)
        btn_layout.add_widget(btn_cancel)
        content.add_widget(btn_layout)

        popup = Popup(title='Add Workout Day',
                      content=content,
                      size_hint=(0.9, 0.6),
                      auto_dismiss=False)

        btn_save.bind(on_press=lambda x: self.save_new_workout_day(popup))
        btn_cancel.bind(on_press=popup.dismiss)

        popup.open()

    def save_new_workout_day(self, popup):
        day_of_week = self.day_of_week_input.text.strip()
        muscle_groups = self.muscle_groups_input.text.strip()
        duration_str = self.duration_input.text.strip()

        if not day_of_week:
            self.day_of_week_input.hint_text = "Day cannot be empty!"
            return

        duration_minutes = None
        if duration_str:
            try:
                duration_minutes = int(duration_str)
            except ValueError:
                self.duration_input.text = ""
                self.duration_input.hint_text = "Invalid number!"
                return

        if crud:
            new_day_id = crud.add_workout_day(self.plan_id, day_of_week, muscle_groups or None, duration_minutes)
            if new_day_id:
                print(f"Workout day '{day_of_week}' added to plan {self.plan_id}.")
                self.load_workout_days() # Refresh the list
                popup.dismiss()
            else:
                print("Failed to add workout day (DB error or other issue).")
                # Could add error feedback to popup
        else:
            print("CRUD functions not available.")
            popup.dismiss()

    def show_edit_day_popup(self, workout_day_id, current_dow, current_mg, current_duration):
        content = BoxLayout(orientation='vertical', spacing=dp(10), padding=dp(10))

        self.edit_day_of_week_input = TextInput(text=current_dow, multiline=False, size_hint_y=None, height=dp(40))
        self.edit_muscle_groups_input = TextInput(text=current_mg or "", multiline=False, size_hint_y=None, height=dp(40))
        self.edit_duration_input = TextInput(text=str(current_duration or ""), input_filter='int', multiline=False, size_hint_y=None, height=dp(40))

        content.add_widget(Label(text="Day of Week:"))
        content.add_widget(self.edit_day_of_week_input)
        content.add_widget(Label(text="Muscle Groups (optional):"))
        content.add_widget(self.edit_muscle_groups_input)
        content.add_widget(Label(text="Duration in minutes (optional):"))
        content.add_widget(self.edit_duration_input)

        btn_layout = BoxLayout(size_hint_y=None, height=dp(50), spacing=dp(10))
        btn_save = Button(text='Save Changes')
        btn_delete = Button(text='Delete Day', background_color=(1, 0.2, 0.2, 1)) # Reddish color for delete
        btn_cancel = Button(text='Cancel')

        btn_layout.add_widget(btn_save)
        btn_layout.add_widget(btn_delete)
        btn_layout.add_widget(btn_cancel)
        content.add_widget(btn_layout)

        popup = Popup(title=f'Edit Workout Day (ID: {workout_day_id})',
                      content=content,
                      size_hint=(0.9, 0.7), # Slightly taller to accommodate delete button well
                      auto_dismiss=False)

        btn_save.bind(on_press=lambda x: self.update_workout_day_details(popup, workout_day_id))
        btn_delete.bind(on_press=lambda x: self.confirm_delete_workout_day(popup, workout_day_id, current_dow))
        btn_cancel.bind(on_press=popup.dismiss)

        popup.open()

    def update_workout_day_details(self, popup, workout_day_id):
        day_of_week = self.edit_day_of_week_input.text.strip()
        muscle_groups = self.edit_muscle_groups_input.text.strip()
        duration_str = self.edit_duration_input.text.strip()

        if not day_of_week:
            self.edit_day_of_week_input.hint_text = "Day cannot be empty!" # This won't show as text is already there
            # A better UX would be a dedicated error label in the popup
            print("Day of week cannot be empty in edit.")
            return

        duration_minutes = None
        if duration_str:
            try:
                duration_minutes = int(duration_str)
            except ValueError:
                self.edit_duration_input.text = "" # Clear invalid input
                # self.edit_duration_input.hint_text = "Invalid number!" # Hint not visible with text
                print("Invalid duration format in edit.")
                return

        if crud:
            success = crud.update_workout_day(workout_day_id, day_of_week, muscle_groups or None, duration_minutes)
            if success:
                print(f"Workout day ID {workout_day_id} updated.")
                self.load_workout_days() # Refresh the list
                popup.dismiss()
            else:
                print(f"Failed to update workout day ID {workout_day_id}.")
                # Add error feedback to popup
        else:
            print("CRUD functions not available for update.")
            popup.dismiss()

    def confirm_delete_workout_day(self, original_popup, workout_day_id, day_name):
        # Confirmation popup for deleting a workout day
        content = BoxLayout(orientation='vertical', padding=dp(10), spacing=dp(10))
        message = Label(text=f"Are you sure you want to delete workout day: '{day_name}' (ID: {workout_day_id})?",
                        halign='center', valign='middle')
        message.bind(size=message.setter('text_size'))
        content.add_widget(message)

        btn_layout = BoxLayout(size_hint_y=None, height=dp(40), spacing=dp(10))
        btn_confirm_delete = Button(text='Yes, Delete', background_color=(1, 0.2, 0.2, 1))
        btn_cancel_delete = Button(text='Cancel')
        btn_layout.add_widget(btn_confirm_delete)
        btn_layout.add_widget(btn_cancel_delete)
        content.add_widget(btn_layout)

        confirm_popup = Popup(title='Confirm Deletion',
                              content=content,
                              size_hint=(0.8, 0.4),
                              auto_dismiss=False)

        btn_confirm_delete.bind(on_press=lambda x: self.delete_the_workout_day(confirm_popup, original_popup, workout_day_id))
        btn_cancel_delete.bind(on_press=confirm_popup.dismiss)
        confirm_popup.open()

    def delete_the_workout_day(self, confirm_popup, original_edit_popup, workout_day_id):
        if crud:
            success = crud.delete_workout_day(workout_day_id)
            if success:
                print(f"Workout day ID {workout_day_id} deleted.")
                self.load_workout_days() # Refresh list
            else:
                print(f"Failed to delete workout day ID {workout_day_id}.")
        else:
            print("CRUD functions not available for delete.")

        confirm_popup.dismiss()
        original_edit_popup.dismiss() # Also dismiss the edit popup

    def start_planned_workout_action(self, plan_id, plan_name, workout_day_id, day_of_week):
        """Called when 'Start this Workout' is pressed for a planned day."""
        if self.manager.has_screen('workout_log'):
            log_screen = self.manager.get_screen('workout_log')
            log_screen.start_new_session(workout_day_id=workout_day_id, plan_name=plan_name, day_of_week=day_of_week)
            self.manager.current = 'workout_log'
        else:
            print("ERROR: WorkoutLogScreen not found when trying to start planned workout.")

    def show_edit_day_popup(self, workout_day_id, current_dow, current_mg, current_duration):
        # This was defined earlier, ensuring it's correctly placed if moved during merge/edit.
        # The actual implementation for show_edit_day_popup is above the plan name editing.
        # This is a structural comment, no code change here, just ensuring it's not lost.
        # If this method was accidentally duplicated, the earlier one should be kept.
        # For now, assuming it's correctly defined above.
        pass # Placeholder if it was accidentally removed from here by a diff operation

    def show_edit_plan_name_popup(self, instance):
        content = BoxLayout(orientation='vertical', spacing=dp(10), padding=dp(10))
        self.edit_plan_name_input = TextInput(text=self.plan_name, multiline=False, size_hint_y=None, height=dp(40))
        content.add_widget(Label(text="New Plan Name:"))
        content.add_widget(self.edit_plan_name_input)

        btn_layout = BoxLayout(size_hint_y=None, height=dp(40), spacing=dp(10))
        btn_save = Button(text='Save Name')
        btn_cancel = Button(text='Cancel')
        btn_layout.add_widget(btn_save)
        btn_layout.add_widget(btn_cancel)
        content.add_widget(btn_layout)

        popup = Popup(title='Edit Plan Name',
                      content=content,
                      size_hint=(0.8, 0.4),
                      auto_dismiss=False)

        btn_save.bind(on_press=lambda x: self.save_edited_plan_name(popup))
        btn_cancel.bind(on_press=popup.dismiss)
        popup.open()

    def save_edited_plan_name(self, popup):
        new_name = self.edit_plan_name_input.text.strip()
        if not new_name:
            self.edit_plan_name_input.hint_text = "Name cannot be empty!"
            # Potentially add a visual error cue
            return

        if new_name == self.plan_name: # No change
            popup.dismiss()
            return

        if crud:
            success = crud.update_training_plan_name(self.plan_id, new_name)
            if success:
                self.plan_name = new_name # Update internal state
                self.plan_name_label.text = f"Plan: {self.plan_name} (ID: {self.plan_id})" # Update display
                # Need to also update the PlansScreen list when we go back
                # This can be done by reloading PlansScreen on_enter, which it already does.
                popup.dismiss()
            else:
                # Handle error (e.g., name already exists)
                self.edit_plan_name_input.text = "" # Clear input
                self.edit_plan_name_input.hint_text = "Name exists or DB error!"
                print(f"Failed to update plan name. '{new_name}' might exist or DB error.")
        else:
            print("CRUD not available for plan name update.")
            popup.dismiss()

    def confirm_delete_plan(self, instance):
        content = BoxLayout(orientation='vertical', padding=dp(10), spacing=dp(10))
        message_text = f"Are you sure you want to PERMANENTLY DELETE the entire plan: '{self.plan_name}'?\n\nThis will also delete all its defined workout days. Associated workout session logs will NOT be deleted but will no longer be linked to this plan's days."
        message = Label(text=message_text, halign='center', valign='middle')
        message.bind(size=message.setter('text_size'))
        content.add_widget(message)

        btn_layout = BoxLayout(size_hint_y=None, height=dp(40), spacing=dp(10))
        btn_confirm = Button(text='Yes, DELETE PLAN', background_color=(1, 0, 0, 1)) # Bright red
        btn_cancel = Button(text='Cancel')
        btn_layout.add_widget(btn_confirm)
        btn_layout.add_widget(btn_cancel)
        content.add_widget(btn_layout)

        popup = Popup(title='Confirm Plan Deletion',
                      content=content,
                      size_hint=(0.9, 0.5),
                      auto_dismiss=False)

        btn_confirm.bind(on_press=lambda x: self.delete_the_entire_plan(popup))
        btn_cancel.bind(on_press=popup.dismiss)
        popup.open()

    def delete_the_entire_plan(self, popup):
        if crud:
            success = crud.delete_training_plan(self.plan_id)
            if success:
                print(f"Plan ID {self.plan_id} ('{self.plan_name}') deleted successfully.")
                popup.dismiss()
                self.go_to_plans_list(None) # Navigate back to plans list
            else:
                print(f"Failed to delete plan ID {self.plan_id}.")
                # Optionally show an error message in the popup
                popup.dismiss() # Or keep it open with an error
        else:
            print("CRUD not available for plan deletion.")
            popup.dismiss()

    def go_to_plans_list(self, instance):
        self.manager.current = 'plans'


class JymApp(App):
    def build(self):
        # Create the screen manager
        sm = ScreenManager()
        sm.add_widget(MainScreen(name='main'))
        sm.add_widget(PlansScreen(name='plans'))
        sm.add_widget(PlanEditScreen(name='edit_plan'))
        sm.add_widget(WorkoutLogScreen(name='workout_log'))
        sm.add_widget(HistoryScreen(name='history')) # Add HistoryScreen

        return sm

# --- History Screen ---
class HistoryScreen(Screen):
    def __init__(self, **kwargs):
        super(HistoryScreen, self).__init__(**kwargs)
        self.layout = BoxLayout(orientation='vertical', padding=dp(10), spacing=dp(10))

        title = Label(text="Workout History", font_size='24sp', size_hint_y=None, height=dp(50))
        self.layout.add_widget(title)

        self.history_scroll_view = ScrollView(size_hint=(1, 1))
        self.history_list_layout = BoxLayout(orientation='vertical', size_hint_y=None, spacing=dp(5))
        self.history_list_layout.bind(minimum_height=self.history_list_layout.setter('height'))
        self.history_scroll_view.add_widget(self.history_list_layout)
        self.layout.add_widget(self.history_scroll_view)

        btn_back = Button(text="Back to Main Menu", size_hint_y=None, height=dp(50))
        btn_back.bind(on_press=self.go_to_main_menu)
        self.layout.add_widget(btn_back)

        self.add_widget(self.layout)

    def on_enter(self, *args):
        self.load_history()

    def load_history(self):
        self.history_list_layout.clear_widgets()
        if not crud:
            self.history_list_layout.add_widget(Label(text="Error: CRUD functions not available.", size_hint_y=None, height=dp(40)))
            return

        sessions = crud.get_all_workout_sessions_summary()
        if not sessions:
            self.history_list_layout.add_widget(Label(text="No workout history found.", size_hint_y=None, height=dp(40)))
            return

        for session in sessions:
            # ws.session_id, ws.date, ws.notes,
            # tp.plan_name, wd.day_of_week, wd.muscle_groups,
            # total_volume
            session_id, date_str, notes, plan_name, day_of_week, muscle_groups, total_volume = session

            date_formatted = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S").strftime("%Y-%m-%d %I:%M %p")

            entry_text = f"Date: {date_formatted}\n"
            if plan_name and day_of_week:
                entry_text += f"Plan: {plan_name} - {day_of_week}\n"
            elif muscle_groups: # Ad-hoc but maybe user specified muscle groups via notes or future feature
                entry_text += f"Focus: {muscle_groups}\n"
            else:
                entry_text += "Type: Ad-hoc Workout\n"

            entry_text += f"Total Volume: {total_volume or 0}\n"
            notes_snippet = (notes[:75] + '...') if notes and len(notes) > 75 else notes
            if notes_snippet:
                entry_text += f"Notes: {notes_snippet}"

            # Using a Button to make it clickable later for details view
            session_button = Button(text=entry_text, size_hint_y=None, halign='left', valign='top')
            session_button.bind(texture_size=session_button.setter('size')) # For multiline button text
            session_button.height = session_button.texture_size[1] + dp(20) # Adjust height based on text
            # session_button.bind(on_press=lambda instance, s_id=session_id: self.view_session_details(s_id)) # For later
            self.history_list_layout.add_widget(session_button)

            # Add a small separator
            sep = BoxLayout(size_hint_y=None, height=dp(1), background_color=(0.7,0.7,0.7,1)) # Not working directly, need canvas for color
            # For simplicity, using a Label as separator for now, or just spacing.
            # self.history_list_layout.add_widget(Label(size_hint_y=None, height=dp(1)))


    # def view_session_details(self, session_id):
    #     print(f"View details for session ID: {session_id} (Not Implemented Yet)")
    #     # TODO: Transition to a SessionDetailScreen or show a popup
    #     # If creating a new screen:
    #     # if self.manager.has_screen('session_detail'):
    #     #     detail_screen = self.manager.get_screen('session_detail')
    #     #     detail_screen.load_session(session_id) # Custom method on detail screen
    #     #     self.manager.current = 'session_detail'

    def go_to_main_menu(self, instance):
        self.manager.current = 'main'

# --- Workout Logging Screen ---
class WorkoutLogScreen(Screen):
    def __init__(self, **kwargs):
        super(WorkoutLogScreen, self).__init__(**kwargs)
        self.current_session_id = None
        self.current_workout_day_id = None # For planned workouts later

        self.layout = BoxLayout(orientation='vertical', padding=dp(10), spacing=dp(5))

        # --- Header: Session Info (e.g., "Ad-hoc Workout" or "Chest Day") ---
        self.session_title_label = Label(text="Workout Log", font_size='20sp', size_hint_y=None, height=dp(40))
        self.layout.add_widget(self.session_title_label)

        # --- Input area for new set ---
        input_area = BoxLayout(orientation='vertical', size_hint_y=None, spacing=dp(5))
        input_area.bind(minimum_height=input_area.setter('height'))

        self.exercise_name_input = TextInput(hint_text='Exercise Name', multiline=False, size_hint_y=None, height=dp(40))
        reps_weight_layout = BoxLayout(orientation='horizontal', spacing=dp(10), size_hint_y=None, height=dp(40))
        self.reps_input = TextInput(hint_text='Reps', input_filter='int', multiline=False)
        self.weight_input = TextInput(hint_text='Weight', input_filter='float', multiline=False) # float for kgs/lbs
        reps_weight_layout.add_widget(self.reps_input)
        reps_weight_layout.add_widget(self.weight_input)

        self.btn_log_set = Button(text="Log Set", size_hint_y=None, height=dp(44))
        self.btn_log_set.bind(on_press=self.log_set_action)

        input_area.add_widget(self.exercise_name_input)
        input_area.add_widget(reps_weight_layout)
        input_area.add_widget(self.btn_log_set)
        self.layout.add_widget(input_area)

        # --- ScrollView for logged sets ---
        self.sets_scroll_view = ScrollView(size_hint=(1, 1))
        self.sets_display_layout = BoxLayout(orientation='vertical', size_hint_y=None, spacing=dp(3))
        self.sets_display_layout.bind(minimum_height=self.sets_display_layout.setter('height'))
        self.sets_scroll_view.add_widget(self.sets_display_layout)
        self.layout.add_widget(self.sets_scroll_view)

        # --- Session Notes ---
        self.notes_input = TextInput(hint_text='Workout Notes...', size_hint_y=None, height=dp(80))
        self.layout.add_widget(self.notes_input)

        # --- Footer: Finish Button ---
        self.btn_finish_workout = Button(text="Finish Workout & Save Notes", size_hint_y=None, height=dp(50))
        self.btn_finish_workout.bind(on_press=self.finish_workout_action)
        self.layout.add_widget(self.btn_finish_workout)

        self.add_widget(self.layout)

    def start_new_session(self, workout_day_id=None, plan_name=None, day_of_week=None):
        """Starts a new session, clears inputs, and sets screen state."""
        if self.current_session_id:
            # If a session is already active, perhaps prompt user or auto-save?
            # For now, we'll just overwrite. A more robust app would handle this.
            print(f"Warning: Starting new session while session {self.current_session_id} might be active.")
            self.save_current_notes() # Attempt to save notes from previous session before starting new

        self.current_workout_day_id = workout_day_id
        if crud:
            self.current_session_id = crud.start_workout_session(workout_day_id=self.current_workout_day_id)
            if self.current_session_id:
                print(f"Started new session ID: {self.current_session_id}, linked to day ID: {self.current_workout_day_id}")
                if plan_name and day_of_week:
                    self.session_title_label.text = f"{plan_name} - {day_of_week}"
                elif workout_day_id: # Planned, but no names passed (should ideally not happen)
                     self.session_title_label.text = f"Planned Workout (Day ID: {workout_day_id})"
                else:
                    self.session_title_label.text = "Ad-hoc Workout"
            else:
                self.session_title_label.text = "Error Starting Session"
                print("Failed to start new session from WorkoutLogScreen.")
        else:
            self.session_title_label.text = "Error (CRUD missing)"
            print("CRUD functions not available to start session.")
            self.current_session_id = None # Ensure it's None if failed

        # Reset UI elements
        self.exercise_name_input.text = ""
        self.reps_input.text = ""
        self.weight_input.text = ""
        self.notes_input.text = ""
        self.sets_display_layout.clear_widgets()
        # Potentially add a label like "No sets logged yet."

    def on_enter(self, *args):
        """Called when screen is entered. If no active session, start ad-hoc."""
        if not self.current_session_id:
            # This ensures that if we navigate here directly or somehow session wasn't set,
            # an ad-hoc session is started.
            # However, the MainScreen button should call start_new_session directly.
            print("WorkoutLogScreen entered without an active session. Starting ad-hoc.")
            self.start_new_session(workout_day_id=None)

    def log_set_action(self, instance):
        if not self.current_session_id:
            print("Cannot log set: No active session.")
            # Optionally show a popup or label to the user
            return

        ex_name = self.exercise_name_input.text.strip()
        reps_str = self.reps_input.text.strip()
        weight_str = self.weight_input.text.strip()

        if not ex_name:
            self.exercise_name_input.hint_text = "Exercise name required!"
            return
        if not reps_str:
            self.reps_input.hint_text = "Reps required!"
            return
        # Weight can be optional (e.g. bodyweight exercises), though crud.log_exercise_set expects a value.
        # We'll default to 0 if empty for now.

        reps = 0
        weight = 0.0

        try:
            reps = int(reps_str)
        except ValueError:
            self.reps_input.text = ""
            self.reps_input.hint_text = "Invalid reps!"
            return

        if weight_str: # Only try to convert if not empty
            try:
                weight = float(weight_str)
            except ValueError:
                self.weight_input.text = ""
                self.weight_input.hint_text = "Invalid weight!"
                return

        if crud:
            set_id = crud.log_exercise_set(self.current_session_id, ex_name, reps, weight)
            if set_id:
                print(f"Logged set ID {set_id} for session {self.current_session_id}")
                self.add_set_to_display(set_id, ex_name, reps, weight, reps * weight)
                # Clear inputs for next set
                self.exercise_name_input.text = ""
                self.reps_input.text = ""
                self.weight_input.text = ""
                self.exercise_name_input.hint_text = "Exercise Name" # Reset hint
                self.reps_input.hint_text = "Reps"
                self.weight_input.hint_text = "Weight"
            else:
                print("Failed to log set to database.")
                # Show error to user
        else:
            print("CRUD not available to log set.")

    def add_set_to_display(self, set_id, ex_name, reps, weight, total_moved):
        set_text = f"- {ex_name}: {reps} reps @ {weight} kg/lbs (Volume: {total_moved})"
        # TODO: Consider adding a delete button per set later
        set_label = Label(text=set_text, size_hint_y=None, height=dp(30), halign='left', valign='middle')
        set_label.text_size = (self.sets_scroll_view.width - dp(20), None)
        self.sets_display_layout.add_widget(set_label)

    def load_existing_sets_for_session(self):
        """If a session is resumed, load its sets."""
        self.sets_display_layout.clear_widgets()
        if self.current_session_id and crud:
            _session_info, sets_data = crud.get_session_details(self.current_session_id)
            if _session_info: # Update notes if available
                self.notes_input.text = _session_info[2] or "" # notes are at index 2
            for s_id, ex_name, r, w, total_w in sets_data:
                self.add_set_to_display(s_id, ex_name, r, w, total_w)

    def save_current_notes(self):
        if self.current_session_id and crud:
            notes = self.notes_input.text.strip()
            if crud.update_session_notes(self.current_session_id, notes):
                print(f"Notes for session {self.current_session_id} updated.")
                return True
            else:
                print(f"Failed to update notes for session {self.current_session_id}.")
                return False
        return False

    def finish_workout_action(self, instance):
        if not self.current_session_id:
            print("No active session to finish.")
            # Go back to main menu or plans screen
            self.manager.current = 'main'
            return

        self.save_current_notes()
        print(f"Workout session {self.current_session_id} finished.")

        # Reset state for next time
        self.current_session_id = None
        self.current_workout_day_id = None
        self.session_title_label.text = "Workout Log" # Reset title
        self.sets_display_layout.clear_widgets()
        self.notes_input.text = ""

        # Navigate away, e.g., back to main menu or a history screen
        self.manager.current = 'main'


if __name__ == '__main__':
    JymApp().run()
