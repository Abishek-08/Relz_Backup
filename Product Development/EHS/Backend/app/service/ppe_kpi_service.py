# from datetime import datetime,timedelta
# from collections import defaultdict
# from app.repository.ppe_detection_repository import DetectionRepository
# from dateutil import parser  # make sure this is imported


# class KPIService:
#     def __init__(self, repo:DetectionRepository):
#         self.repo = repo

#     async def ppe_compliance_rate_this_month(self):
#         detections = await self.repo.get_detections_this_month()

#         total_detections = len(detections)
#         compliant_count = sum(
#             1 for d in detections if all(item["compliant"] for item in d.get("ppe_items", []))
#         )

#         return round((compliant_count / total_detections) * 100, 2) if total_detections else 0

#     async def non_compliance_incidents_this_week(self):
#         incidents = await self.repo.get_non_compliance_this_week()
#         return len(incidents)

#     async def compliance_score_by_zone(self):
#         detections = await self.repo.get_detections_today()

#         zone_data = defaultdict(lambda: {"compliant": 0, "total": 0})

#         for det in detections:
#             zone = det["zone"]
#             compliant = all(item["compliant"] for item in det.get("ppe_items", []))
#             zone_data[zone]["compliant"] += int(compliant)
#             zone_data[zone]["total"] += 1

#         zone_scores = {
#             zone: round((data["compliant"] / data["total"]) * 100, 2)
#             if data["total"] else 0
#             for zone, data in zone_data.items()
#         }

#         return zone_scores

#     async def compliance_streak(self):
#         detections = await self.repo.get_all_detections()

#         daily_summary = defaultdict(list)
#         for d in detections:
#             timestamp = d["timestamp"]
#             if isinstance(timestamp, str):
#                 timestamp = parser.isoparse(timestamp)
#             date_str = timestamp.strftime("%Y-%m-%d")
#             daily_summary[date_str].append(d)

#         streak = 0
#         today = datetime.now().date()

#         for i in range(0, 365):
#             day = today - timedelta(days=i)
#             day_str = day.strftime("%Y-%m-%d")

#             if day_str not in daily_summary:
#                 break

#             day_records = daily_summary[day_str]

#             if any(any(not item["compliant"] for item in d.get("ppe_items", [])) for d in day_records):
#                 break

#             streak += 1

#         return streak
    
#     async def detection_days_summary(self):
#           return await self.repo.get_detection_count_by_day()    
    

from datetime import datetime, timedelta
from collections import defaultdict
from app.repository.ppe_detection_repository import DetectionRepository
from dateutil import parser  # make sure this is imported


class KPIService:
    def __init__(self, repo: DetectionRepository):
        self.repo = repo

    async def ppe_compliance_rate_this_month(self):
        detections = await self.repo.get_detections_this_month()

        total_ppe_items = 0  # 🔄 UPDATED
        compliant_items = 0  # 🔄 UPDATED

        for d in detections:
            ppe_items = d.get("ppe_items", [])
            total_ppe_items += len(ppe_items)
            compliant_items += sum(1 for item in ppe_items if item["compliant"])

        return round((compliant_items / total_ppe_items) * 100, 2) if total_ppe_items else 0

    async def non_compliance_incidents_this_week(self):
        detections = await self.repo.get_detections_this_week()  # 🔄 UPDATED method to fetch all detections this week

        non_compliance_count = 0

        for d in detections:
            ppe_items = d.get("ppe_items", [])
            if any(not item["compliant"] for item in ppe_items):
                non_compliance_count += 1

        return non_compliance_count

    async def compliance_score_by_zone(self):
        detections = await self.repo.get_detections_today()

        zone_data = defaultdict(lambda: {"compliant": 0, "total": 0})

        for det in detections:
            zone = det["zone"]
            ppe_items = det.get("ppe_items", [])
            total_items = len(ppe_items)
            compliant_items = sum(1 for item in ppe_items if item["compliant"])

            zone_data[zone]["compliant"] += compliant_items
            zone_data[zone]["total"] += total_items

        zone_scores = {
            zone: round((data["compliant"] / data["total"]) * 100, 2)
            if data["total"] else 0
            for zone, data in zone_data.items()
        }

        return zone_scores

    async def compliance_streak(self):
        detections = await self.repo.get_all_detections()

        daily_summary = defaultdict(list)
        for d in detections:
            timestamp = d["timestamp"]
            if isinstance(timestamp, str):
                timestamp = parser.isoparse(timestamp)
            date_str = timestamp.strftime("%Y-%m-%d")
            daily_summary[date_str].append(d)

        streak = 0
        today = datetime.now().date()

        for i in range(0, 365):
            day = today - timedelta(days=i)
            day_str = day.strftime("%Y-%m-%d")

            if day_str not in daily_summary:
                break

            day_records = daily_summary[day_str]

            if any(any(not item["compliant"] for item in d.get("ppe_items", [])) for d in day_records):
                break

            streak += 1

        return streak

    async def detection_days_summary(self):
        return await self.repo.get_detection_count_by_day()