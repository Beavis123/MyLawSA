import secrets
import string
import os

SERIAL_FILE = "generated_serials.txt"

def load_generated_serials():
    """Loads the set of previously generated serials from the file."""
    if not os.path.exists(SERIAL_FILE):
        return set()
    with open(SERIAL_FILE, "r") as f:
        return set(line.strip() for line in f)

def save_serial(serial):
    """Appends a new serial to the serials file."""
    with open(SERIAL_FILE, "a") as f:
        f.write(serial + "\n")

import tkinter as tk
from tkinter import ttk

def generate_unique_serial(length=16):
    """Generates a unique alphanumeric serial number."""
    generated_serials = load_generated_serials()
    alphabet = string.ascii_uppercase + string.digits
    while True:
        serial = ''.join(secrets.choice(alphabet) for i in range(length))
        if serial not in generated_serials:
            save_serial(serial)
            return serial

class SerialGeneratorApp(tk.Tk):
    def __init__(self):
        super().__init__()

        self.title("Serial Number Generator")
        self.geometry("500x400")
        self.configure(bg="#f0f0f0")

        self.style = ttk.Style(self)
        self.style.theme_use("clam")
        self.style.configure("TFrame", background="#f0f0f0")
        self.style.configure("TLabel", background="#f0f0f0", font=("Helvetica", 12))
        self.style.configure("TButton", font=("Helvetica", 12, "bold"))
        self.style.configure("Header.TLabel", font=("Helvetica", 18, "bold"))

        self.main_frame = ttk.Frame(self, padding="20")
        self.main_frame.pack(expand=True, fill="both")

        # --- Serial Display ---
        self.serial_display_label = ttk.Label(self.main_frame, text="Your New Serial Number:", style="Header.TLabel")
        self.serial_display_label.pack(pady=(0, 10))

        self.serial_var = tk.StringVar(value="Click 'Generate' to start")
        self.serial_label = ttk.Label(self.main_frame, textvariable=self.serial_var, font=("Courier", 16, "bold"), foreground="#333")
        self.serial_label.pack(pady=(0, 20))

        # --- Generate Button ---
        self.generate_button = ttk.Button(self.main_frame, text="Generate New Serial", command=self.generate_serial_action)
        self.generate_button.pack(pady=(0, 20))

        # --- History Listbox ---
        self.history_label = ttk.Label(self.main_frame, text="Generated Serial History:")
        self.history_label.pack(pady=(10, 5))

        self.history_frame = ttk.Frame(self.main_frame)
        self.history_frame.pack(expand=True, fill="both")

        self.history_listbox = tk.Listbox(self.history_frame, font=("Courier", 10), selectbackground="#cce5ff")
        self.history_listbox.pack(side="left", expand=True, fill="both")

        self.scrollbar = ttk.Scrollbar(self.history_frame, orient="vertical", command=self.history_listbox.yview)
        self.scrollbar.pack(side="right", fill="y")
        self.history_listbox.config(yscrollcommand=self.scrollbar.set)

        self.load_history()

    def generate_serial_action(self):
        new_serial = generate_unique_serial()
        self.serial_var.set(new_serial)
        self.history_listbox.insert(0, new_serial)

    def load_history(self):
        self.history_listbox.delete(0, tk.END)
        serials = sorted(list(load_generated_serials()), reverse=True)
        for serial in serials:
            self.history_listbox.insert(tk.END, serial)

if __name__ == "__main__":
    app = SerialGeneratorApp()
    app.mainloop()
