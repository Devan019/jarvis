from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from datetime import datetime, timedelta
from helpers.update_cred import get_valid_creds
import webbrowser

class GoogleMeet:
    

    #create google meet and return link
    def create_google_meet_and_get_link(self, summary="Meeting", start_time=None):

        #update link
        creds = get_valid_creds()

        #calender service
        service = build("calendar", "v3", credentials=creds)

        #for instant metting
        if not start_time:
            start_time = datetime.utcnow() + timedelta(seconds=1)

        # 1-day meet 
        end_time = start_time + timedelta(hours=24)

        #meetting sechudling
        event = {
            "summary": summary,
            "start": {
                "dateTime": start_time.isoformat() + "Z",
                "timeZone": "Asia/Kolkata",
            },
            "end": {
                "dateTime": end_time.isoformat() + "Z",
                "timeZone": "Asia/Kolkata",
            },
            "conferenceData": {
                "createRequest": {
                    "requestId": "jarvis-meet-" + str(int(datetime.utcnow().timestamp())),
                    "conferenceSolutionKey": {
                        "type": "hangoutsMeet"
                    }
                }
            },
        }

        #generate meet
        event = service.events().insert(
            calendarId="primary",
            body=event,
            conferenceDataVersion=1
        ).execute()

        #get meet link
        meet_link = event.get("conferenceData", {}) \
                         .get("entryPoints", [{}])[0] \
                         .get("uri")

        return meet_link
    
    #open a meet
    def open_meet_browser(self, url:str):
        try:
            webbrowser.open(url)
            return f"open that meet sucessfully"
        except Exception as e:
            return e
    
