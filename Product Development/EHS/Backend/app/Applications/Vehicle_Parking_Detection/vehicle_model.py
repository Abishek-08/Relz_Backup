import cv2
import pandas as pd
import numpy as np
from ultralytics import YOLO
import time
from fastapi import WebSocket
from app.schemas.vehicles import Vehicles
from sqlalchemy.orm import Session 
from app.dependency.mysql_dependency import get_db
from app.service.vehicle_service import update_Vehicle_service
# from pymongo import MongoClient

def generateFrame():
    # client = MongoClient("mongodb://localhost:27017/")
    model = YOLO('assets/Vehicle_Detection/yolov8s.pt')
    cap = cv2.VideoCapture('assets/Vehicle_Detection/parking1.mp4')

    my_file = open("assets/Vehicle_Detection/coco.txt", "r")
    data = my_file.read()
    class_list = data.split("\n")

    areas = [
        [(52, 364), (30, 417), (73, 412), (88, 369)],
        [(105, 353), (86, 428), (137, 427), (146, 358)],
        [(159, 354), (150, 427), (204, 425), (203, 353)],
        [(217, 352), (219, 422), (273, 418), (261, 347)],
        [(274, 345), (286, 417), (338, 415), (321, 345)],
        [(336, 343), (357, 410), (409, 408), (382, 340)],
        [(396, 338), (426, 404), (479, 399), (439, 334)],
        [(458, 333), (494, 397), (543, 390), (495, 330)],
        [(511, 327), (557, 388), (603, 383), (549, 324)],
        [(564, 323), (615, 381), (654, 372), (596, 315)],
        [(616, 316), (666, 369), (703, 363), (642, 312)],
        [(674, 311), (730, 360), (764, 355), (707, 308)],
    ]

    last_space_count = None  # To track changes

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        time.sleep(1)
        frame = cv2.resize(frame, (1020, 500))

        results = model.predict(frame)
        a = results[0].boxes.data
        px = pd.DataFrame(a.cpu().numpy()).astype("float")

        lists = [[] for _ in range(12)]

        for index, row in px.iterrows():
            x1 = int(row[0])
            y1 = int(row[1])
            x2 = int(row[2])
            y2 = int(row[3])
            d = int(row[5])
            c = class_list[d]
            
            if 'car' in c:
                cx = int((x1 + x2) // 2)
                cy = int((y1 + y2) // 2)

                for i, area in enumerate(areas):
                    result = cv2.pointPolygonTest(np.array(area, np.int32), (cx, cy), False)
                    if result >= 0:
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        cv2.circle(frame, (cx, cy), 3, (0, 0, 255), -1)
                        lists[i].append(c)
                        cv2.putText(frame, str(c), (x1, y1), cv2.FONT_HERSHEY_COMPLEX, 0.5, (255, 255, 255), 1)

        space = 12 - sum(len(lst) for lst in lists)
        occupied = 12 - space
        print(f"Free spaces: {space}, Occupied: {occupied}")

        # Service call when space count changes
        if last_space_count is None or last_space_count != space:
            vehicle_data = Vehicles(vehicleId=1, occupiedSlot=occupied, unOccupiedSlot=space, totalParkingSlot=12)
            db_gen = get_db()
            db = next(db_gen)
            try:
                update_Vehicle_service(vehicle=vehicle_data, db=db)
                
            finally:
                db.close()
            last_space_count = space

        for i, area in enumerate(areas):
            color = (0, 255, 0) if len(lists[i]) == 0 else (0, 0, 255)
            cv2.polylines(frame, [np.array(area, np.int32)], True, color, 2)
            cv2.putText(frame, str(i + 1), (area[0][0], area[0][1] - 10), cv2.FONT_HERSHEY_COMPLEX, 0.5, color, 1)

        cv2.putText(frame, str(space), (23, 30), cv2.FONT_HERSHEY_PLAIN, 3, (255, 255, 255), 2)

        ret, jpeg = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')

    cap.release()
    cv2.destroyAllWindows()
