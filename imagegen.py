from openai import OpenAI
client = OpenAI(api_key="") # Add your API key here


def generate_image(prompt):
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        # return "https://i.kym-cdn.com/entries/icons/original/000/036/070/cover5.jpg"
        return response.data[0].url
    except Exception as e:
        print("Error generating image:", e)
        return None
