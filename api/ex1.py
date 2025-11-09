# from argon2 import PasswordHasher
# ph = PasswordHasher()
# hash = ph.hash("correct horse battery staple")
# print(hash)

# ph.verify(hash, "correct horse battery staple2")


import secrets

def generate_auth_token() -> str:
    return secrets.token_urlsafe(32)

print(generate_auth_token())
