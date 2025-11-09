# from datetime import datetime, timedelta, timezone

# import jwt

# from config import JWTSettings


# TYPE_ACCESS_TOKEN = 'access'
# TYPE_REFRESH_TOKEN = 'refresh'  # Не используется 


# def create_access_token(payload: dict) -> str:
#     to_encode = payload.copy()
#     now = datetime.now(timezone.utc)
#     expire = now + timedelta(minutes=JWTSettings.access_token_expire_minutes)
#     to_encode.update({"exp": expire, 'iat': now})
#     encoded_jwt = jwt.encode(to_encode, JWTSettings.secret_key, algorithm=JWTSettings.algorithm)
#     return encoded_jwt


# def verify_token(token: str) -> dict | str:
#     decoded_token = jwt.decode(token, JWTSettings.secret_key, algorithms=[JWTSettings.algorithm])
#     return decoded_token



# a_payload = {'sub': 1, 'name': 'oleg'}
# access_token = create_access_token(a_payload)
# print(access_token)

# print(verify_token(access_token))
