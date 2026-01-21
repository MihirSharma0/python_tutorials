import pyautogui
import time
import os
from datetime import datetime

ef main():
    print("Auto Clicker & Screenshot Script")
    print("---------------------------------")
    print("This script will click a specific location and take a screenshot 4 times.")
    
    # 1. Get Coordinates
    print("\nSTEP 1: Set Target Coordinates")
    print("Hover your mouse over the specific area you want to click.")
    input("Press Enter when you are hovering over the target area...")
    
    target_x, target_y = pyautogui.position()
    print(f"\nCaptured Coordinates: X={target_x}, Y={target_y}")
    
    confirm = input("Are these coordinates correct? (y/n): ").lower()
    if confirm != 'y':
        print("Aborting. Please restart the script and try again.")
        return

    # 2. Setup Output Directory
    default_folder = "auto_clicker_screenshots"
    folder_name = input(f"Enter output folder name (default: {default_folder}): ").strip() or default_folder
    
    # Create absolute path in Documents folder
    documents_path = os.path.expanduser("~/Documents")
    output_dir = os.path.join(documents_path, folder_name)
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"\nCreated output directory: {output_dir}")
    else:
        print(f"\nUsing existing output directory: {output_dir}")
    
    # 3. Start Loop
    print("\nSTEP 2: Starting Automation")
    print("Press Ctrl+C to stop the script at any time.")
    print("Starting in 5 seconds...")
    time.sleep(5)
    
    try:
        for i in range(1, 5):
            # Click
            pyautogui.click(target_x, target_y)
