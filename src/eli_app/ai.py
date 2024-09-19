from google import generativeai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import json
from django.conf import settings
from openai import OpenAI
from pydantic import BaseModel, Field
from enum import StrEnum

class AiModelName(StrEnum):
    # Not using capital names to make ChatGPT names more readable.
    Gpt4o = "GPT-4o"
    Gpt4oMini = "GPT-4o mini"
    Gemini15Flash = "Gemini 1.5 Flash"


class ResponseFormat(BaseModel):
    """Output schema for LLM JSON responses."""
    title: str
    text: str


def fill_completion(conversation, model_name: AiModelName):
    conversation.ai_model_name = str(model_name)
    match model_name:
        case AiModelName.Gpt4o:
            response, raw = openai_response(conversation, "gpt-4o-2024-08-06")
        case AiModelName.Gpt4oMini:
            response, raw = openai_response(conversation, "gpt-4o-mini")
        case AiModelName.Gemini15Flash:
            response, raw = gemini_response(conversation)

    print(response)

    conversation.response_raw = raw
    conversation.response_title = response.title
    conversation.response_text = response.text

generativeai.configure(api_key=settings.GEMINI_API_KEY)

gemini_preamble = """
Your response must be a JSON object with the following schema:

Response = {
  "title": str,
  "text": str,
}

For the "title" JSON field, generate a short sentence that summarizes this conversation.
The response to the target audience should be placed in the JSON "text" field.
"""

def gemini_response(conversation):
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
    candidate = response.candidates[0]

    raw=type(candidate).to_dict(candidate, use_integers_for_enums=False)
    return ResponseFormat(**json.loads(response.text)), raw



openai_client = OpenAI()

openai_preamble = """
For the JSON field "title", generate a short sentence that summarizes this conversation.
Try not to literally refer to the word "analogy" in your title.

The JSON field "text" should contain your response to the user's query.
"""

def openai_response(conversation, model):
    completion = openai_client.beta.chat.completions.parse(
        model=model,
        messages=[
            {"role": "system", "content": openai_preamble + conversation.system_prompt},
            {"role": "user", "content": conversation.query},
        ],
        response_format=ResponseFormat)

    response = completion.choices[0].message.parsed
    raw = completion.to_dict(mode="json")
    return response, raw
