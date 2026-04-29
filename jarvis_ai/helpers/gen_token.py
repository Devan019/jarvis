#only one time runn

from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/meetings.space.created']

flow = InstalledAppFlow.from_client_secrets_file(
    'cred/google-auth.json', SCOPES)

creds = flow.run_local_server(port=0)

with open('cred/token.json', 'w') as token:
    token.write(creds.to_json())
