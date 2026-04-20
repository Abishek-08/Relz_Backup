import cv2
import cvzone
import numpy as np

circle_count = set()
count = 0

cap = cv2.imread('./kolam_final _2.jpg')
cap = cv2.resize(cap,(650,490))

imgpre = cv2.GaussianBlur(cap,(5,5),3)
imgpre = cv2.Canny(imgpre,40,130)
kernel = np.ones((2,2),np.int8)
imgpre = cv2.dilate(imgpre,kernel,iterations=2)
imgpre = cv2.morphologyEx(imgpre,cv2.MORPH_CLOSE,kernel)

imgstack = cvzone.stackImages([cap,imgpre],2,1)
imgstack = cv2.resize(imgstack,(900,650))
cv2.imshow('picture',imgstack)
cv2.waitKey(0) & 0xFF == ord('q')

# imgcontour,confound = cvzone.findContours(cap,imgpre,30)

detected_circles = cv2.HoughCircles(imgpre,  
                   cv2.HOUGH_GRADIENT, 1, 30, param1 = 100, 
               param2 = 30, minRadius = 2, maxRadius = 40) 
  

if detected_circles is not None: 
  
    
    detected_circles = np.uint16(np.around(detected_circles)) 
  
    for pt in detected_circles[0, :]: 
        circle_count.add(count)
        count = count + 1

        a, b, r = pt[0], pt[1], pt[2] 
  
        
        cv2.circle(cap, (a, b), r, (0, 255, 0), 2) 
        
        cv2.circle(cap, (a, b), 1, (0, 0, 255), 3) 
          
print("Total Dot count: ",len(circle_count))
cv2.imshow("Detected Circle", cap) 
cv2.waitKey(0) 


