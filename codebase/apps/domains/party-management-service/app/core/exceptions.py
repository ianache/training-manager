from fastapi import HTTPException


class DuplicateEmailError(HTTPException):
    def __init__(self, detail: str = "Email already registered"):
        super().__init__(status_code=409, detail=detail)


class DuplicateIdentificationError(HTTPException):
    def __init__(self, detail: str = "Identification already registered"):
        super().__init__(status_code=409, detail=detail)


class PartyNotFoundError(HTTPException):
    def __init__(self, detail: str = "Party not found"):
        super().__init__(status_code=404, detail=detail)


class AuthorizationError(HTTPException):
    def __init__(self, detail: str = "Access denied"):
        super().__init__(status_code=403, detail=detail)


class ValidationError(HTTPException):
    def __init__(self, detail: str = "Validation failed"):
        super().__init__(status_code=400, detail=detail)
