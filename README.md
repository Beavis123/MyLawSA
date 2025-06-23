# Jym App

A mobile application for planning and tracking gym workouts.

## Development Setup

This application is built using Python and the Kivy framework.

**Prerequisites:**

*   Python 3.7+
*   Pip (Python package installer)

**Installation Steps:**

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <repository_url>
    cd jym-app-directory
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install Kivy and other dependencies:**
    Kivy installation can sometimes be tricky depending on your OS and existing libraries. Please refer to the official Kivy installation guide for detailed instructions: [https://kivy.org/doc/stable/gettingstarted/installation.html](https://kivy.org/doc/stable/gettingstarted/installation.html)

    A general approach using pip is:
    ```bash
    pip install -r requirements.txt
    ```
    If you encounter issues, especially with graphics or windowing dependencies, the Kivy documentation provides platform-specific troubleshooting steps.

4.  **Run the application:**
    ```bash
    python main.py
    ```

**Building for Android/iOS:**

To package the application for mobile devices, you will typically use a tool like Buildozer.

1.  **Install Buildozer:**
    ```bash
    pip install buildozer
    ```

2.  **Initialize Buildozer in your project directory (where `main.py` is):**
    ```bash
    buildozer init
    ```
    This will create a `buildozer.spec` file.

3.  **Edit `buildozer.spec`:**
    *   Update the `title`, `package.name`, `package.domain`.
    *   Ensure `requirements` in the spec file includes `python3,kivy`. Add any other Python libraries you use.
    *   Configure other settings as needed (e.g., Android SDK/NDK paths, permissions).

4.  **Build for Android (example):**
    ```bash
    buildozer android debug deploy run
    ```
    This command will download necessary SDKs, build the APK, deploy it to a connected device/emulator, and run it. The first build can take a significant amount of time.

Refer to the Buildozer documentation for more detailed instructions: [https://buildozer.readthedocs.io/en/latest/](https://buildozer.readthedocs.io/en/latest/)

## Project Structure

*   `main.py`: The main entry point for the Kivy application.
*   `requirements.txt`: Lists Python dependencies.
*   `jym_app/`: Main application package.
    *   `core/`: Contains core logic, database interactions.
        *   `database_setup.py`: Script to initialize the database schema.
        *   `crud.py`: Functions for Create, Read, Update, Delete operations.
    *   `ui/`: (Planned) Kivy widget definitions and UI layout files (.kv files or Python UI code).
    *   `data/`: (Planned) Location for the SQLite database file (e.g., `jym_app.db`).
*   `tests/`: (Planned) Unit tests for the application.
