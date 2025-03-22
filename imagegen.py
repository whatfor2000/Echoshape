from openai import OpenAI
client = OpenAI(api_key="") # Add your API key here


def generate_image(prompt):
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        n=1,
    )
    # return "https://oaidalleapiprodscus.blob.core.windows.net/private/org-zYQH8jtPz5JReGlRPVUcDuoT/user-0ZefhSGK4ODNQjkV21EyM7P3/img-xMT1lxesj0ltYWrPfIJFL0u4.png?st=2025-03-22T05%3A32%3A04Z&se=2025-03-22T07%3A32%3A04Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-03-21T20%3A43%3A16Z&ske=2025-03-22T20%3A43%3A16Z&sks=b&skv=2024-08-04&sig=9y7W3fMSj2EYEz7q%2BufI1U1rM7TcYqLH2fU1zqCXwcY%3D"
    return response.data[0].url
