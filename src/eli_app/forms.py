from django import forms

from .models import Audience
from .ai import AiModelName

AI_MODEL_CHOICES = [
    (name.name, name.value) for name in AiModelName
    ]

class QueryForm(forms.Form):
    audience = forms.ModelChoiceField(
        label="Explain Like I'm A", queryset=Audience.objects.all(), empty_label=None
    )
    query = forms.CharField(widget=forms.TextInput(attrs=dict(autocomplete="off")))
    ai_model = forms.ChoiceField(choices=AI_MODEL_CHOICES, label="AI Model")
