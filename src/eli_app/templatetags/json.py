from django import template

import json
from django.utils.safestring import mark_safe
from pygments import highlight
from pygments.formatters.html import HtmlFormatter
from pygments.lexers.data import JsonLexer


register = template.Library()

@register.filter
def to_pretty_json(field):
    data = json.dumps(field, indent=2)
    formatter = HtmlFormatter(style="monokai")
    response = highlight(data, JsonLexer(), formatter)
    return mark_safe(
        f"<style>{formatter.get_style_defs()}</style>{response}"
    )
