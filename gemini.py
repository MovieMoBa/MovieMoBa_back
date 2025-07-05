# To run this code you need to install the following dependencies:
# pip install google-genai

import base64
import os
from google import genai
from google.genai import types


def generate(question):
    client = genai.Client(
        api_key="AIzaSyD1u0HO1IgcF6fxdehsgkvSCQZDPYcqFuE",
    )

    model = "gemini-2.0-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=question),
            ],
        ),
    ]
    tools = [
        types.Tool(url_context=types.UrlContext()),
    ]
    generate_content_config = types.GenerateContentConfig(
        tools=tools,
        response_mime_type="text/plain",
        system_instruction=[
            types.Part.from_text(text="""You are a assitent for making movie recommendations. The customer will come and tell one's movie taste. Then, you should make a movie recommendation according to the taste provided. If there are specific movies provided, you should make recommendations avoiding them. The recommendations are better when they are recently made. Make recommendations immediatly after getting the frist question."""),
        ],
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")

if __name__ == "__main__":
    question = input()
    generate(question)
