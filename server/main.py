import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
from PIL import Image
import io
import base64
from fastapi.middleware.cors import CORSMiddleware

class PromptRequest(BaseModel):
    prompt: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5175"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods like GET, POST, OPTIONS, etc.
    allow_headers=["*"],  # Allows all headers
)

# small_model = "stabilityai/stable-diffusion-2-1"

# local_model_path = r"C:\STORAGE\React_Projects\E-Commerce-Advanced\server\stable_diffusion_model"
local_model_path = r"C:\STORAGE\React_Projects\E-Commerce-Advanced\FineTuning StableD\fine_tuned_model"

print("Loading model from local path...")
pipe = StableDiffusionPipeline.from_pretrained(local_model_path, torch_dtype=torch.float16)
pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)
pipe.enable_attention_slicing()
pipe = pipe.to("cuda")
print("Model loaded successfully from disk.")

@app.post("/generate-image")
async def generate_image(request: PromptRequest):
    try:
        results = pipe(
            [request.prompt],
            num_inference_steps=50,
            guidance_scale=7.5,
            height=512,
            width=512
        )

        image = results.images[0]
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        return {"image": img_str}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
