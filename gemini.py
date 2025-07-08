# To run this code you need to install the following dependencies:
# pip install google-genai

import sys
import io
import base64
import os
from google import genai
from google.genai import types

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

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
    generate_content_config = types.GenerateContentConfig(
        response_mime_type="application/json",
        system_instruction=[
            types.Part.from_text(text="""You are a assitent for making movie recommendations. The recommendations are better when they are recently made. Make recommendations immediatly after getting the frist question. Please answer in Korean. The answer should be in a json form, with 'title', 'release_date', and 'description'. The 'release-date' should only contain the released year. The movies should be wrapped in a list. You will make 3 or more recommendations."""),
        ],
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        question = sys.argv[1]
    else:
        question = ""
    generate(question)
