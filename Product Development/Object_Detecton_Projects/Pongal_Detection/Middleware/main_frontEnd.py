import cv2
import numpy as np
from ultralytics import YOLO

def recognize_object(cap):

    model = YOLO('./assets/Kolam_1_Best.pt')

    circle_count = set()
    
    
    cap = cv2.resize(cap,(650,490))

    # Run YOLO object detection
    results = model.predict(cap)[0]

    # Iterate over the detected boxes
    for box in results.boxes:
        count = 0
        class_id = results.names[box.cls[0].item()]
        cords = box.xyxy[0].tolist()
        cords = [round(x) for x in cords]
        # conf = round(box.conf[0].item(), 2)

        cropped_image = cap[cords[1]:cords[3],cords[0]:cords[2]]
        

        imgpre = cv2.GaussianBlur(cropped_image,(5,5),3)
        imgpre = cv2.Canny(imgpre,40,130)
        kernel = np.ones((2,2),np.int8)
        imgpre = cv2.dilate(imgpre,kernel,iterations=2)
        imgpre = cv2.morphologyEx(imgpre,cv2.MORPH_CLOSE,kernel)

        detected_circles = cv2.HoughCircles(imgpre,cv2.HOUGH_GRADIENT, 1, 30, param1 = 100,param2 = 30, minRadius = 1, maxRadius = 50) 
  

        if detected_circles is not None: 
            detected_circles = np.uint16(np.around(detected_circles)) 
            
            for pt in detected_circles[0, :]: 
                circle_count.add(count)
                count = count + 1

                a, b, r = pt[0], pt[1], pt[2] 
                cv2.circle(cap, (a, b), r, (0, 255, 0), 2) 
                cv2.circle(cap, (a, b), 1, (0, 0, 255), 3) 
          
        print("Total Dot count: ",len(circle_count))
        return True if len(circle_count) == 21 else False

