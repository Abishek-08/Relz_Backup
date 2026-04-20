# from datetime import datetime, timedelta
# from app.config import PPE_Compliance_Collection
# from zoneinfo import ZoneInfo



# class DetectionRepository:
#     def __init__(self):
#         self.collection = PPE_Compliance_Collection
#         self.timezone = ZoneInfo("Asia/Kolkata")

#     async def save_detection(self, detection_data: dict):
#         await self.collection.insert_one(detection_data)

#     async def get_detections_this_month(self):
#         now = datetime.now(self.timezone)
#         start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
#         return await self.collection.find({
#             "timestamp": {"$gte": start_of_month}
#         }).to_list(length=None)

#     async def get_non_compliance_this_week(self):
#         now = datetime.now(self.timezone)
#         start_of_week = now - timedelta(days=now.weekday())  # Monday as start of week
#         start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)

#         return await self.collection.find({
#             "timestamp": {"$gte": start_of_week},
#             "ppe_items": {"$elemMatch": {"compliant": False}}
#         }).to_list(length=None)

#     async def get_all_detections(self):
#         return await self.collection.find().to_list(length=None)

#     async def get_detections_today(self):
#         now = datetime.now(self.timezone)
#         start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
#         return await self.collection.find({
#             "timestamp": {"$gte": start_of_day}
#         }).to_list(length=None)
    
    

#     async def get_detection_count_by_day(self):
#         pipeline = [
#             {
#                 "$addFields": {
#                     "parsed_timestamp": {
#                         "$dateFromString": {
#                             "dateString": "$timestamp"
#                         }
#                     }
#                 }
#             },
#             {
#                 "$group": {
#                     "_id": {
#                         "year": {"$year": "$parsed_timestamp"},
#                         "month": {"$month": "$parsed_timestamp"},
#                         "day": {"$dayOfMonth": "$parsed_timestamp"}
#                     },
#                     "count": {"$sum": 1}
#                 }
#             },
#             {"$sort": {"_id": 1}}
#         ]
#         return await self.collection.aggregate(pipeline).to_list(length=None)
from datetime import datetime, timedelta
from app.config import PPE_Compliance_Collection
from zoneinfo import ZoneInfo


class DetectionRepository:
    def __init__(self):
        self.collection = PPE_Compliance_Collection
        self.timezone = ZoneInfo("Asia/Kolkata")

    async def save_detection(self, detection_data: dict):
        await self.collection.insert_one(detection_data)

    async def get_detections_this_month(self):
        now = datetime.now(self.timezone)
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        return await self.collection.find({
            "timestamp": {"$gte": start_of_month}
        }).to_list(length=None)

    async def get_detections_this_week(self):
        now = datetime.now(self.timezone)
        start_of_week = now - timedelta(days=now.weekday())
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)

        return await self.collection.find({
            "timestamp": {"$gte": start_of_week}
        }).to_list(length=None)

    async def get_all_detections(self):
        return await self.collection.find().to_list(length=None)

    async def get_detections_today(self):
        now = datetime.now(self.timezone)
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        return await self.collection.find({
            "timestamp": {"$gte": start_of_day}
        }).to_list(length=None)

    async def get_detection_count_by_day(self):
        pipeline = [
            {
                "$group": {
                    "_id": {
                        "year": {"$year": "$timestamp"},
                        "month": {"$month": "$timestamp"},
                        "day": {"$dayOfMonth": "$timestamp"}
                    },
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"_id": 1}}
        ]
        return await self.collection.aggregate(pipeline).to_list(length=None)