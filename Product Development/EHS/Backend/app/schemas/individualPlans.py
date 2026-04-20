from pydantic import BaseModel
from typing import Optional

class IndividualPlans(BaseModel):
    individualPlanId:Optional[int] = None
    plan_Id:Optional[int] = None
    solution_Id:Optional[int] = None
