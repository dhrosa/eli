from django import forms
from .models import Style



class QueryForm(forms.Form):
    style = forms.ModelChoiceField(queryset=Style.objects.all(), empty_label=None)
    query = forms.CharField()
