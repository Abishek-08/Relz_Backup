from ultralytics import YOLO
import cv2

model = YOLO('yolo11n.pt')

frame = cv2.imread('sam_ph1.jpg')


frame = cv2.resize(frame,(360,450))

results = model.predict(frame,classes=[67])[0]

for result in results.boxes.data.tolist():
    x1,y1,x2,y2,conf,cls = result[:6]

    box_width = int(x2) - int(x1)
    box_height = int(y2) - int(y1)

    print("height: ",box_height)
   
    # ratio_pixel_mm = 153/14
    # mm = box_height/ratio_pixel_mm
    # cm = mm/10
    mm = 0.264583333*box_height
    cm = mm/10

    
    cv2.rectangle(frame,(int(x1),int(y1)),(int(x2),int(y2)),(255,0,0),2)
    label = model.names[int(cls)]
    cv2.putText(frame,str(label),(int(x1)-10,int(y1)-10),cv2.FONT_HERSHEY_PLAIN,1,(0,255,255),2)
    cv2.putText(frame,"{}".format(round(cm,2)),(int(x1)-30,int(y1)-30),cv2.FONT_HERSHEY_PLAIN,1,(0,0,255),2)
    

cv2.imshow('video',frame)
cv2.waitKey(0)
cv2.destroyAllWindows()

