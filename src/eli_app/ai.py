from google import generativeai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import json
from django.conf import settings
from openai import OpenAI
from pydantic import BaseModel


generativeai.configure(api_key=settings.GEMINI_API_KEY)

gemini_preamble = """
Your response must be a JSON object with the following schema:

Response = {
  "text": str,
  "title": str,
}

For the "title" JSON field, generate a short sentence that summarizes this conversation.
The response to the target audience should be placed in the JSON "text" field.
"""

def fill_gemini_completion(conversation):
    harm_categories = (
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        HarmCategory.HARM_CATEGORY_HARASSMENT,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    )

    model = generativeai.GenerativeModel(
        "gemini-1.5-flash",
        system_instruction=gemini_preamble + conversation.system_prompt,
        safety_settings={c: HarmBlockThreshold.BLOCK_NONE for c in harm_categories},
        generation_config={"response_mime_type": "application/json"},
    )

    response = model.generate_content(conversation.query)
    conversation.structured_response = json.loads(response.text)
    candidate = response.candidates[0]
    conversation.raw_response = type(candidate).to_dict(candidate, use_integers_for_enums=False)

openai_client = OpenAI()

openai_preamble = """
For the JSON field "title", generate a short sentence that summarizes this conversation.
Try not to literally refer to the word "analogy" in your title.

The JSON field "text" should contain your response to the user's query.
"""

class ResponseFormat(BaseModel):
    title: str
    text: str

def fill_openai_completion(conversation):
    completion = openai_client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": openai_preamble + conversation.system_prompt},
            {"role": "user", "content": conversation.query},
        ],
        response_format=ResponseFormat)

    print(completion.choices[0].message.parsed)
    conversation.structured_response["openai"] = completion.to_dict(mode="json")
