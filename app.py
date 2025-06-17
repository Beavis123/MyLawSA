import tkinter as tk

# Create the main window
root = tk.Tk()
root.title("Login Application")

# Define button actions
def agent_login_action():
    print("Agent Login button clicked")

def admin_login_action():
    print("Admin Login button clicked")

def settings_action():
    print("Settings button clicked")

# Create and place buttons
agent_button = tk.Button(root, text="Agent Login", command=agent_login_action)
agent_button.pack(pady=10)

admin_button = tk.Button(root, text="Admin Login", command=admin_login_action)
admin_button.pack(pady=10)

settings_button = tk.Button(root, text="Settings", command=settings_action)
settings_button.pack(pady=10)

# Start the Tkinter event loop
root.mainloop()
