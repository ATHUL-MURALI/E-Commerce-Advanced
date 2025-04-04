import os
import shutil
from PIL import Image

input_folder = "FineTuning StableD/logos_dataset/"
output_folder = "FineTuning StableD/logos_resized/"

os.makedirs(output_folder, exist_ok=True)

# Process images
for file in os.listdir(input_folder):
    if file.endswith((".png", ".jpg", ".jpeg")):
        img_path = os.path.join(input_folder, file)
        img = Image.open(img_path).convert("RGB")
        img = img.resize((512, 512))  # Resize to 512x512
        img.save(os.path.join(output_folder, file))

# Copy captions.csv if it exists
csv_path = os.path.join(input_folder, "captions.csv")
if os.path.exists(csv_path):
    shutil.copy(csv_path, output_folder)
