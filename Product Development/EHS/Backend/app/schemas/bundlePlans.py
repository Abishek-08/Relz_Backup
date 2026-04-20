from pydantic import BaseModel
from typing import Optional

class BundlePlans(BaseModel):
    bundlePlanId:Optional[int] = None
    plan_Id:Optional[int] = None
    industry_Id:Optional[int] = None 