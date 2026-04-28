import pywhatkit
from const.mapper import PHONE_NUMBER_MAP


class WhatsApp:
    
    # send whatsapp message
    def send_whastapp_message(self, name: str, message: str):
        phone_number = PHONE_NUMBER_MAP.get(name)

        if not phone_number:
            return f"{name} dosen't exits at your mapper"

        # send msg
        pywhatkit.sendwhatmsg_instantly(phone_number, message)
