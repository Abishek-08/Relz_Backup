import cv2
import pandas as pd
import numpy as np
from ultralytics import YOLO
from tracker import*

model=YOLO('bestC.pt')

cap=cv2.VideoCapture('vid2.mp4')

region_of_interest = np.array([[210,250],[282,249],[279,308],[193,306]],np.int32)

tracker=Tracker()

ly1=276
ly2=278

bag_count = set()

while True:    
    ret,frame = cap.read()
    if not ret:
        break

    frame=cv2.resize(frame,(640, 480))
   

    results=model.predict(frame,classes=[0])
 
    a=results[0].boxes.data
    px=pd.DataFrame(a).astype("float")
    list=[]
             
    for index,row in px.iterrows():
        x1=int(row[0])
        y1=int(row[1])
        x2=int(row[2])
        y2=int(row[3])
        list.append([x1,y1,x2,y2])


    bbox_id=tracker.update(list)


    for bbox in bbox_id:
        x3,y3,x4,y4,id=bbox
        cx=int(x3+x4)//2
        cy=int(y3+y4)//2
        
        #Circle 
        cv2.circle(frame, (cx, cy), 3, (0, 255, 0), -1)

        # Draw rectangle and label
        cv2.rectangle(frame, (x3, y3), (x4, y4), (25, 15, 220), 2)
        cv2.putText(frame, f'{id}', (x3, y3 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)
        cv2.putText(frame, f'count: {len(bag_count)}', (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)


        if cv2.pointPolygonTest(region_of_interest,(cx,cy),False) == 1:
            bag_count.add(id)
            


    #Draw the line to count the no of cement bags gone
    cv2.polylines(frame,[region_of_interest],True,(0,255,0),2)
    

    print("Count: ",len(bag_count))
        
    cv2.imshow("RGB", frame)
    if cv2.waitKey(1)&0xFF==ord('q'):
        break


cap.release()
cv2.destroyAllWindows()