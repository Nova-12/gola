import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from django.conf import settings

def write_body(link):
    body = """\
Hi gola user!
Your poll has finished.
You can check the result here: %s
Thanks for using gola.\
""" % (link)
    print body
    return body

def write_mail(sender, recipient, link):
    msg = []
    msg.append("From: %s" % sender)
    msg.append("To: %s" % recipient)
    msg.append("Subject: Your gola poll has finished")
    msg.append("")
    body = write_body(link)
    msg.append(body)
    return "\r\n".join(msg)

def send_mail(recipient, link):
    address = settings.EMAIL_SMTP_ADDRESS
    port = settings.EMAIL_SMTP_PORT
    sender_email = settings.EMAIL_SENDER_ADDRESS
    sender_pw = settings.EMAIL_SENDER_PASSWORD

    server = smtplib.SMTP(address, port)
    server.ehlo()
    server.starttls()
    server.login(sender_email, sender_pw)
    msg = write_mail(sender_email, recipient, link)
    server.sendmail(sender_email, recipient, msg)
    server.close()

