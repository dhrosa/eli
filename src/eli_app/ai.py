from google import generativeai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import json
from django.conf import settings

def ai_model(**kwargs):
    generativeai.configure(api_key=settings.GEMINI_API_KEY)
    return generativeai.GenerativeModel("gemini-1.5-flash", **kwargs)

preamble = """
Your response must be a JSON object with the following schema:

Response = {
  "text": str,
  "title": str,
}

The response to the target audience should be placed in the "text" field.

For the "title" field, genete a short sentence that summarizes this conversation.
"""

def fill_gemini_completion(conversation):
    harm_categories = (
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        HarmCategory.HARM_CATEGORY_HARASSMENT,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    )

    model = ai_model(
        system_instruction=preamble + conversation.system_prompt,
        safety_settings={c: HarmBlockThreshold.BLOCK_NONE for c in harm_categories},
        generation_config={"response_mime_type": "application/json"},
    )

    response = model.generate_content(conversation.query)
    conversation.structured_response = json.loads(response.text)
    candidate = response.candidates[0]
    conversation.raw_response = type(candidate).to_dict(candidate, use_integers_for_enums=False)
