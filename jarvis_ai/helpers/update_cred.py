from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
import os

def get_valid_creds():
    creds = None

    if os.path.exists("cred/token.json"):
        creds = Credentials.from_authorized_user_file("cred/token.json")

    # If token expired → refresh automatically
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())

        # save updated token
        with open("cred/token.json", "w") as token:
            token.write(creds.to_json())

    return creds