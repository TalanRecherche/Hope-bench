
from pydantic import BaseModel, Field
from typing import List, Optional

class SearchOptions(BaseModel):
    userId: Optional[str] = Field(default="", alias="userId")
    searchString: Optional[str] = Field(default="", alias="searchString")
    selfSearch: Optional[bool] = Field(default=False, alias="selfSearch")
    limitToAllowedCv: Optional[bool] = Field(default=True, alias="limitToAllowedCv")
    statusToCheck: Optional[List[int]] = Field(default_factory=lambda: [0, 1, 2, 3], alias="statusToCheck")
    onlyMainCv: Optional[bool] = Field(default=False, alias="onlyMainCv")
    page: Optional[int] = Field(default=0, alias="page")
    pageSize: Optional[int] = Field(default=10, alias="pageSize")
    

    
