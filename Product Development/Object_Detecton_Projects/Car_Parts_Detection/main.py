from ultralytics import YOLO
import cv2

model = YOLO('yolo11n.pt')

cap = cv2.VideoCapture('car.mp4')

ret = True

while ret:
    ret,frame = cap.read()
    frame = cv2.resize(frame,(500,500))

    results = model(frame)[0]

    for result in results.boxes.data.tolist():
        x1,y1,x2,y2,conf,cls = result[:6]

        cv2.rectangle(frame,(int(x1),int(y1)),(int(x2),int(y2)),(255,0,0),2)
        label = model.names[int(cls)]
        cv2.putText(frame,str(label),(int(x1)-10,int(y1)-10),cv2.FONT_HERSHEY_COMPLEX,0.5,(0,255,255),1)

    cv2.imshow('video',frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()