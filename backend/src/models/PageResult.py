from typing import List, Generic, TypeVar

T = TypeVar('T')


class PageResult(Generic[T]):
    page: int
    pageSize: int
    totalElements: int
    elements: List[T]

    def __init__(self, page: int, pageSize: int, totalElements: int, elements: List[T]):
        self.page = page
        self.pageSize = pageSize
        self.totalElements = totalElements
        self.elements = elements
