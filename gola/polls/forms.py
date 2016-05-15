from django import forms

class NewPollForm(forms.Form):
    title = forms.CharField(label="Title of this poll", max_length=200)
    noti_email = forms.EmailField(label="Email to get notified", max_length=100)
