from typing import Any

from fastapi import HTTPException, status


class ForbiddenException(HTTPException):
    def __init__(self, detail: Any = None):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail
        )


class NotFoundException(HTTPException):
    def __init__(self, detail: Any = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail
        )
