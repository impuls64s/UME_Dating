import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import aiosmtplib

from config import SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD


logger = logging.getLogger(__name__)


async def send_password(to_email: str, password: str) -> bool:
    subject = f"Ваш пароль"
    body = f"Ваш пароль: {password} от UME Dating."

    msg = MIMEMultipart()
    msg['From'] = SMTP_USERNAME
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        await aiosmtplib.send(
            msg,
            hostname=SMTP_SERVER,
            port=SMTP_PORT,
            username=SMTP_USERNAME,
            password=SMTP_PASSWORD,
            use_tls=True,
        )
        logger.info(f"Password sent to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send password to {to_email}: {e}")
    return False


# import asyncio
# print(asyncio.run(send_password('impuls64g@gmail.com', 'qweqwe1234')))
