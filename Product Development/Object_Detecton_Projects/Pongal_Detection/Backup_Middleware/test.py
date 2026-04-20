import cv2
import numpy as np
import cvzone

# Read the image
cap = cv2.imread('./kolam2.jpeg')
cap = cv2.resize(cap, (640, 480))

# Apply GaussianBlur, Canny edge detection, dilation, and morphological close
imgpre = cv2.GaussianBlur(cap, (5, 5), 3)
imgpre = cv2.Canny(imgpre, 150, 300)

# You can visualize imgpre to check how the edges look
cv2.imshow('Canny Edges', imgpre)

kernel = np.ones((2, 2), np.int8)
imgpre = cv2.dilate(imgpre, kernel, iterations=2)
imgpre = cv2.morphologyEx(imgpre, cv2.MORPH_CLOSE, kernel)

# Find contours in the edge-detected image
contours, _ = cv2.findContours(imgpre, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Create an empty image to draw the circles
circle_img = np.zeros_like(cap)

for contour in contours:
    # Fit a minimum enclosing circle to each contour
    (x, y), radius = cv2.minEnclosingCircle(contour)
    
    if radius > 30:  # Filter out very small contours
        # Calculate the contour area and the circle area
        area = cv2.contourArea(contour)
        circle_area = np.pi * radius ** 2
        
        # Calculate the circularity (a perfect circle has circularity = 1)
        circularity = 4 * np.pi * area / (cv2.arcLength(contour, True) ** 2)
        
        # Debugging: Print the circularity value
        print(f"Circularity: {circularity}, Radius: {radius}")
        
        # If the circularity is close to 1, draw the circle
        if circularity > 1:  # You can adjust this threshold based on your needs
            cv2.circle(circle_img, (int(x), int(y)), int(radius), (0, 255, 0), 2)

# Stack the original image and the filtered image with circles only
imgstack = cvzone.stackImages([cap, circle_img], 2, 1)
imgstack = cv2.resize(imgstack, (900, 650))

# Display the result
cv2.imshow('Filtered Circles', imgstack)
cv2.waitKey(0)
cv2.destroyAllWindows()
