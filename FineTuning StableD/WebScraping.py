import os
import csv
from bing_image_downloader import downloader

# Define the keywords and output directory
keywords = ["logo"]
output_dir = "./logos_dataset"

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Initialize a list to store image captions
captions = []

# Download images and collect filenames
for keyword in keywords:
    downloader.download(keyword, limit=5, output_dir=output_dir, adult_filter_off=True)
    
    # Get the list of downloaded image files
    keyword_dir = os.path.join(output_dir, keyword)
    if os.path.exists(keyword_dir):
        for filename in os.listdir(keyword_dir):
            if filename.endswith(('.jpg', '.jpeg', '.png')):
                captions.append([filename, keyword])

# Save captions to a CSV file
csv_path = os.path.join(output_dir, "captions.csv")
with open(csv_path, mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["image_name", "text_prompt"])  # Header row
    writer.writerows(captions)

print(f"Captions saved to {csv_path}")