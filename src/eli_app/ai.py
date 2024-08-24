from google import generativeai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

from django.conf import settings

def ai_model(**kwargs):
    generativeai.configure(api_key=settings.GEMINI_API_KEY)
    return generativeai.GenerativeModel("gemini-1.5-flash", **kwargs)

def get_gemini_completion(system_prompt: str, query: str):
    harm_categories = (
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        HarmCategory.HARM_CATEGORY_HARASSMENT,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    )

    model = ai_model(
        system_instruction=system_prompt,
        safety_settings={c: HarmBlockThreshold.BLOCK_NONE for c in harm_categories},
    )

    response = model.generate_content(query).candidates[0]
    response_dict = type(response).to_dict(response, use_integers_for_enums=False)
    return response_dict
