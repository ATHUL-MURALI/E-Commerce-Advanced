import os
from PIL import Image

input_folder = "logos_dataset/"
output_folder = "logos_resized/"
os.makedirs(output_folder, exist_ok=True)

for root, _, files in os.walk(input_folder):
    for file in files:
        if file.endswith((".png", ".jpg", ".jpeg")):
            img_path = os.path.join(root, file)
            img = Image.open(img_path).convert("RGB")
            img = img.resize((512, 512))  # Resize to 512x512
            img.save(os.path.join(output_folder, file))
