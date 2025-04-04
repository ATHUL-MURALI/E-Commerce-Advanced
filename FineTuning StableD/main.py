from diffusers import StableDiffusionPipeline
from diffusers.models.attention_processor import LoRAAttnProcessor
import torch
import os

# Define paths
model_id = "./stable_diffusion_model"  # Path to local base model
dataset_path = "./logos_resized"  # Dataset directory
output_dir = "./fine_tuned_model"  # Where to save fine-tuned model

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Load pre-trained model from local directory
pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float16,
    local_files_only=True  # Avoid downloading from Hugging Face
).to("cuda")

# Apply LoRA to U-Net attention layers
for name, module in pipe.unet.attn_processors.items():
    if isinstance(module, torch.nn.Module):  # Ensure module is a valid PyTorch module
        pipe.unet.attn_processors[name] = LoRAAttnProcessor(hidden_size=module.out_features)

# Define training parameters
epochs = 5
learning_rate = 1e-4
optimizer = torch.optim.AdamW(pipe.unet.parameters(), lr=learning_rate)

# Dummy Training Loop (Replace with actual dataset and loss calculation)
for epoch in range(epochs):
    print(f"Epoch {epoch+1}/{epochs} - Training...")
    optimizer.zero_grad()
    
    # Simulate forward + backward pass
    loss = torch.tensor(0.01, requires_grad=True)  # Replace with actual loss computation
    loss.backward()
    
    optimizer.step()
    print(f"Epoch {epoch+1} Loss: {loss.item()}")

# Save LoRA fine-tuned model
pipe.save_pretrained(output_dir)
print(f"Training complete. Fine-tuned model saved at {output_dir}")





# from diffusers import StableDiffusionPipeline
# from diffusers.models.attention_processor import LoRAAttnProcessor
# import torch
# import os
# from torchvision import transforms
# from PIL import Image
# from torch.utils.data import DataLoader, Dataset

# # Define paths
# model_id = "./stable_diffusion_model"  # Path to local base model
# dataset_path = "./logos_resized"  # Dataset directory
# output_dir = "./fine_tuned_model"  # Where to save fine-tuned model

# # Ensure output directory exists
# os.makedirs(output_dir, exist_ok=True)

# # Load pre-trained model from local directory
# pipe = StableDiffusionPipeline.from_pretrained(
#     model_id,
#     torch_dtype=torch.float16,
#     local_files_only=True  # Avoid downloading from Hugging Face
# ).to("cuda")

# # Apply LoRA to U-Net attention layers
# for name, module in pipe.unet.attn_processors.items():
#     if isinstance(module, torch.nn.Module):  # Ensure module is a valid PyTorch module
#         pipe.unet.attn_processors[name] = LoRAAttnProcessor(hidden_size=module.out_features)

# # Define dataset class
# class LogoDataset(Dataset):
#     def __init__(self, image_dir, transform=None):
#         self.image_dir = image_dir
#         self.transform = transform
#         self.image_files = [f for f in os.listdir(image_dir) if f.endswith(".png") or f.endswith(".jpg")]
    
#     def __len__(self):
#         return len(self.image_files)
    
#     def __getitem__(self, idx):
#         img_path = os.path.join(self.image_dir, self.image_files[idx])
#         image = Image.open(img_path).convert("RGB")
#         if self.transform:
#             image = self.transform(image)
#         return image

# # Define data transformation
# transform = transforms.Compose([
#     transforms.Resize((512, 512)),
#     transforms.ToTensor(),
#     transforms.Normalize([0.5], [0.5])
# ])

# # Load dataset and dataloader
# dataset = LogoDataset(dataset_path, transform)
# dataloader = DataLoader(dataset, batch_size=4, shuffle=True)

# # Define training parameters
# epochs = 5
# learning_rate = 1e-4
# optimizer = torch.optim.AdamW(pipe.unet.parameters(), lr=learning_rate)
# loss_fn = torch.nn.MSELoss()

# # Training loop
# for epoch in range(epochs):
#     print(f"Epoch {epoch+1}/{epochs} - Training...")
#     total_loss = 0.0
    
#     for batch in dataloader:
#         optimizer.zero_grad()
#         batch = batch.to("cuda", dtype=torch.float16)
        
#         # Dummy forward pass (use actual Stable Diffusion forward later)
#         generated_images = pipe(batch[0])  # Replace with actual forward pass
#         loss = loss_fn(generated_images, batch)  # Replace with a meaningful loss calculation
        
#         loss.backward()
#         optimizer.step()
#         total_loss += loss.item()
    
#     print(f"Epoch {epoch+1} Loss: {total_loss / len(dataloader)}")

# # Save LoRA fine-tuned model
# pipe.save_pretrained(output_dir)
# print(f"Training complete. Fine-tuned model saved at {output_dir}")
