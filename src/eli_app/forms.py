from django import forms

from .models import Audience


class QueryForm(forms.Form):
    audience = forms.ModelChoiceField(
        label="Explain like I'm a", queryset=Audience.objects.all(), empty_label=None
    )
    query = forms.CharField(widget=forms.TextInput(attrs=dict(autocomplete="off")))
