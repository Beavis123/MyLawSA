import tkinter as tk

# --- Action Handlers ---
def agent_login_action():
    print("Agent Login button clicked")

def admin_login_action():
    print("Admin Login button clicked")

def settings_action():
    print("Settings button clicked")

def contacts_action():
    print("Contacts button clicked")

def tasks_action():
    print("Tasks button clicked")

def campaign_progress_action():
    print("Campaign Progress button clicked")

def status_selected_action(selection):
    print(f"Agent status changed to: {selection}")

# --- Main Application Setup ---
root = tk.Tk()
root.title("Call Center Application")
root.geometry("800x600") # Set a default size

# --- Create Main Frames ---
# Top frame for status dropdown
top_frame = tk.Frame(root, height=50, bg='lightgrey') # Added bg for visibility
top_frame.pack(side=tk.TOP, fill=tk.X)
top_frame.pack_propagate(False) # Prevents frame from shrinking to fit content


# --- Populate Top Frame (Agent Status Dropdown) ---
status_options = ["Select Status", "Break - Lunch", "Break - Tea Time", "Break - Bathroom"]
selected_status = tk.StringVar(root) # Use root or top_frame as master for StringVar
selected_status.set(status_options[0]) # Set default value

status_label = tk.Label(top_frame, text="Agent Status:")
status_label.pack(side=tk.LEFT, padx=10, pady=10)

status_dropdown = tk.OptionMenu(top_frame, selected_status, *status_options, command=status_selected_action)
status_dropdown.pack(side=tk.RIGHT, padx=10, pady=10)


# Left frame for navigation buttons
left_frame = tk.Frame(root, width=200, bg='grey') # Added bg for visibility
left_frame.pack(side=tk.LEFT, fill=tk.Y)
left_frame.pack_propagate(False)

# Main content frame for other UI elements
main_frame = tk.Frame(root, bg='white') # Added bg for visibility
main_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

# --- Populate Left Frame (Navigation) ---
contacts_button = tk.Button(left_frame, text="Contacts", command=contacts_action)
contacts_button.pack(pady=10, padx=10, fill=tk.X)

tasks_button = tk.Button(left_frame, text="Tasks", command=tasks_action)
tasks_button.pack(pady=10, padx=10, fill=tk.X)

campaign_button = tk.Button(left_frame, text="Campaign Progress", command=campaign_progress_action)
campaign_button.pack(pady=10, padx=10, fill=tk.X)

# --- Existing Buttons ---
agent_button = tk.Button(main_frame, text="Agent Login", command=agent_login_action)
agent_button.pack(pady=20, padx=20) # Added some padding for spacing

admin_button = tk.Button(main_frame, text="Admin Login", command=admin_login_action)
admin_button.pack(pady=20, padx=20)

settings_button = tk.Button(main_frame, text="Settings", command=settings_action)
settings_button.pack(pady=20, padx=20)

# --- Start Application ---
root.mainloop()
