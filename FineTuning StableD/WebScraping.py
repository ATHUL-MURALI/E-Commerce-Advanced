import os
import csv
from bing_image_downloader import downloader
import shutil

# Define the keywords and output directory
keywords = [
    "minimal tech logo",
    "modern fashion logo",
    "gaming logo design",
    "restaurant logo vector",
    "fitness gym logo",
    "luxury brand logo",
    "e-sports team logo",
    "coffee shop logo",
    "mascot cartoon logo"
]
output_dir = "./FineTuning StableD/logos_dataset"

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Initialize a list to store image captions and a global counter
captions = []
image_counter = 1  # Start from image_1

# Download images and rename them sequentially
for keyword in keywords:
    downloader.download(keyword, limit=5, output_dir=output_dir, adult_filter_off=True)
    
    # Path to the keyword-specific folder
    keyword_dir = os.path.join(output_dir, keyword)
    
    if os.path.exists(keyword_dir):
        for filename in os.listdir(keyword_dir):
            if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                # Create new sequential filename
                new_filename = f"image_{image_counter}.jpg"
                old_path = os.path.join(keyword_dir, filename)
                new_path = os.path.join(output_dir, new_filename)
                
                # Move and rename the file to the main output directory
                shutil.copy(old_path, new_path)
                
                # Add to captions list
                captions.append([new_filename, keyword])
                
                image_counter += 1
        
        # Optionally, remove the now-empty keyword folder
        # os.rmdir(keyword_dir)  #this is the folder deleter

# Save captions to a CSV file
csv_path = os.path.join(output_dir, "captions.csv")
with open(csv_path, mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["image_name", "text_prompt"])  # Header row
    writer.writerows(captions)

print(f"Captions saved to {csv_path}")
