# maybe use api ?
# must use a better gpu for genarate image
import torch
from diffusers import StableDiffusionPipeline

pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16)
pipe = pipe.to("cpu")

prompt = "a photo of an astronaut riding a horse on mars"
image = pipe(prompt).images[0]
image.show()