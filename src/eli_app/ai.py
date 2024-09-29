import json
from enum import StrEnum

from django.conf import settings
from google import generativeai
from google.generativeai.types import HarmBlockThreshold, HarmCategory
from openai import OpenAI
from pydantic import BaseModel

from .models import ChatResponseEvent


class AiModelName(StrEnum):
    # Not using capital names to make ChatGPT names more readable.
    Gpt4o = "GPT-4o"
    Gpt4oMini = "GPT-4o mini"


class ResponseFormat(BaseModel):
    """Output schema for LLM JSON responses."""

    title: str
    text: str


def fill_completion(conversation, model_name: AiModelName):
    conversation.ai_model_name = str(model_name)
    match model_name:
        case AiModelName.Gpt4o:
            response = openai_response(conversation, "gpt-4o-2024-08-06")
        case AiModelName.Gpt4oMini:
            response = openai_response(conversation, "gpt-4o-mini")

    conversation.response_title = response.title
    conversation.response_text = response.text


openai_client = OpenAI()

openai_preamble = """
For the JSON field "title", generate a short sentence that summarizes this conversation.
Try not to literally refer to the word "analogy" in your title.

The JSON field "text" should contain your response to the user's query.
"""


def openai_response(conversation, model):
    system_prompt = openai_preamble + conversation.system_prompt
    completion = openai_client.beta.chat.completions.parse(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": conversation.query},
        ],
        response_format=ResponseFormat,
    )

    event = ChatResponseEvent(
        system_prompt=system_prompt,
        prompt=conversation.query,
        response=completion.to_dict(mode="json"),
    )
    event.save()
    conversation.chat_response_event = event

    return completion.choices[0].message.parsed


class QuerySuggestion(BaseModel):
    suggestions: list[str]


def query_suggestions(suggestion_request):
    prompt = f"""
    Generate {suggestion_request["count"]} prompts using the following examples as a starting point:

    "What is a cat?"
    "What is the Higgs Boson?"
    "Describe how a bird flies"
    "Explain the plot of the movie 'Speed'"
    "Describe how machine learning works"
    "How do banks work?"

    The prompts should be very short, direct, and simply-worded.
    The prompts should be very random and unrelated to the examples.
    """
    completion = openai_client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "user", "content": prompt},
        ],
        temperature=suggestion_request["temperature"],
        response_format=QuerySuggestion,
    )

    ChatResponseEvent(
        system_prompt="", prompt=prompt, response=completion.to_dict(mode="json")
    ).save()
    return completion.choices[0].message.parsed.suggestions
