from diffusers import StableDiffusionPipeline
from diffusers.models.attention_processor import LoRAAttnProcessor
import torch
import os
import pandas as pd
from torchvision import transforms
from PIL import Image
from torch.utils.data import Dataset, DataLoader
import torch.nn as nn
import torch.nn.functional as F

# Define paths
model_id = "FineTuning StableD/stable_diffusion_model"  # Path to local base model
dataset_path = "FineTuning StableD/logos_resized/"  # Dataset directory
captions_file = "FineTuning StableD/logos_resized/captions.csv"  # Captions file
output_dir = "FineTuning StableD/fine_tuned_model"  # Where to save fine-tuned model

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Set device and data type
device = "cuda" if torch.cuda.is_available() else "cpu"
dtype = torch.float16 if torch.cuda.is_available() else torch.float32

# Load pre-trained model from local directory
print("Loading Stable Diffusion model...")
pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=dtype,
    local_files_only=True  # Avoid downloading from Hugging Face
).to(device)
print("Model loaded successfully.")

# Apply LoRA to U-Net attention layers
for name, module in pipe.unet.attn_processors.items():
    if isinstance(module, nn.Module):  
        pipe.unet.attn_processors[name] = LoRAAttnProcessor(hidden_size=module.out_features)

# Define dataset class
class LogoDataset(Dataset):
    def __init__(self, image_dir, captions_file, transform=None):
        self.image_dir = image_dir
        self.data = pd.read_csv(captions_file)
        self.transform = transform

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        img_name = self.data.iloc[idx, 0]
        text_prompt = self.data.iloc[idx, 1]
        img_path = os.path.join(self.image_dir, img_name)
        image = Image.open(img_path).convert("RGB")
        if self.transform:
            image = self.transform(image)
        return image, text_prompt

# Define transformations
transform = transforms.Compose([
    transforms.Resize((512, 512)),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5]),
])

# Load dataset
dataset = LogoDataset(dataset_path, captions_file, transform)
dataloader = DataLoader(dataset, batch_size=4, shuffle=True)

# Define training parameters
epochs = 5
learning_rate = 1e-4
optimizer = torch.optim.AdamW(pipe.unet.parameters(), lr=learning_rate)

# Define projection layer (Fixing dimension mismatch)
projection_layer = nn.Linear(1024, 4 * 64 * 64).to(device).to(dtype)  # ✅ Adjusted input size to match embeddings

# Training loop
print(f"Starting training for {epochs} epochs...")
for epoch in range(epochs):
    print(f"Epoch {epoch+1}/{epochs} - Training...")
    total_loss = 0.0

    for images, text_prompts in dataloader:
        optimizer.zero_grad()

        # Move data to GPU and ensure correct dtype
        images = images.to(device).to(dtype)

        # Encode images and text prompts
        latents = pipe.vae.encode(images).latent_dist.sample()
        text_inputs = pipe.tokenizer(text_prompts, padding=True, return_tensors="pt").to(device)
        text_embeddings = pipe.text_encoder(**text_inputs).last_hidden_state


        # Ensure correct dtype
        latents = latents.to(dtype)
        text_embeddings = text_embeddings.to(dtype)

        # Project text embeddings to match latent space (Fixing shape issue)
        projected_text_embeddings = projection_layer(text_embeddings.mean(dim=1)).view(-1, 4, 64, 64)

        # Compute loss (Example: cosine similarity loss)
        loss = 1 - F.cosine_similarity(latents, projected_text_embeddings).mean()

        loss.backward()
        optimizer.step()
        total_loss += loss.item()

    print(f"Epoch {epoch+1} Loss: {total_loss / len(dataloader):.4f}")

# Save fine-tuned model
pipe.save_pretrained(output_dir)
print(f"Training complete. Fine-tuned model saved at {output_dir}")
