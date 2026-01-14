from bson import ObjectId


class User:
    def __init__(self, email: str, hashed_password: str):
        self.email = email
        self.hashed_password = hashed_password

    def to_dict(self):
        return {
            "email": self.email,
            "hashed_password": self.hashed_password
        }
