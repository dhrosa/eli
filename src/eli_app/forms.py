from django import forms

from .models import Style


class QueryForm(forms.Form):
    style = forms.ModelChoiceField(
        label="Explain like I'm a", queryset=Style.objects.all(), empty_label=None
    )
    query = forms.CharField(widget=forms.TextInput(attrs=dict(autocomplete="off")))
