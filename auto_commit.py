import os
import subprocess
import time
from pynput import keyboard

# Configuration
COUNTER_FILE = ".commit_counter"
GIT_DIR = "."  # Current directory

def get_next_counter():
    """Reads and increments the counter from the counter file."""
    if not os.path.exists(COUNTER_FILE):
        counter = 1
    else:
        try:
            with open(COUNTER_FILE, "r") as f:
                counter = int(f.read().strip()) + 1
        except (ValueError, IOError):
            counter = 1
    
    with open(COUNTER_FILE, "w") as f:
        f.write(str(counter))
    
    return counter

def run_git_commit():
    """Adds all changes and commits locally with a unique message."""
    counter = get_next_counter()
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    commit_message = f"Auto-commit #{counter} - {timestamp}"
    
    try:
        # Step 1: Add all changes
        subprocess.run(["git", "add", "."], check=True, cwd=GIT_DIR)
        
        # Step 2: Commit changes
        # Use -m to provide the message
        subprocess.run(["git", "commit", "-m", commit_message], check=True, cwd=GIT_DIR)
        
        print(f"[{timestamp}] Successfully committed: {commit_message}")
    except subprocess.CalledProcessError as e:
        # This might happen if there's nothing to commit
        if "nothing to commit" in str(e) or e.returncode == 1:
            print(f"[{timestamp}] No changes to commit.")
        else:
            print(f"[{timestamp}] Error during git operation: {e}")

# Track the state of the Command key
current_keys = set()

def on_press(key):
    """Callback for key press events."""
    try:
        # Handle both cmd and cmd_r (Mac command keys)
        if key == keyboard.Key.cmd or key == keyboard.Key.cmd_r:
            current_keys.add('cmd')
        
        # Check if 's' is pressed while 'cmd' is held
        if hasattr(key, 'char') and key.char == 's':
            if 'cmd' in current_keys:
                print("\nDetected Command + S! Triggering auto-commit...")
                run_git_commit()
    except Exception as e:
        print(f"Error in on_press: {e}")

def on_release(key):
    """Callback for key release events."""
    if key == keyboard.Key.cmd or key == keyboard.Key.cmd_r:
        if 'cmd' in current_keys:
            current_keys.remove('cmd')
    
    if key == keyboard.Key.esc:
        # Stop listener
        print("Stopping auto-commit script...")
        return False

def main():
    print("Auto-Commit Script Started")
    print("Listening for Command + S to commit changes...")
    print("Press 'Esc' to stop the script.")
    
    # Check if we are in a git repository
    if not os.path.exists(os.path.join(GIT_DIR, ".git")):
        print("Error: Not a git repository. Please run this in the root of a git project.")
        return

    # Start the keyboard listener
    with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
        listener.join()

if __name__ == "__main__":
    main()
