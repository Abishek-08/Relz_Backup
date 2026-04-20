import cv2 as cv
import numpy as np

def open_camera():
    cap = cv.VideoCapture(1)
    if not cap.isOpened():
        cap = cv.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open any camera")
        exit(0)
    return cap

def detect_background(frame):
    hsv = cv.cvtColor(frame, cv.COLOR_BGR2HSV)
    lower_green, upper_green = np.array([35, 50, 50]), np.array([85, 255, 255])
    lower_black, upper_black = np.array([0, 0, 0]), np.array([180, 255, 50])  # Low brightness black
    mask_green = cv.inRange(hsv, lower_green, upper_green)
    mask_black = cv.inRange(hsv, lower_black, upper_black)
    green_ratio = np.sum(mask_green > 0) / mask_green.size
    black_ratio = np.sum(mask_black > 0) / mask_black.size
    if green_ratio > 0.3:
        return "green"
    elif black_ratio > 0.3:
        return "black"
    else:
        return "unknown"

def remove_background(frame, background_type):
    if background_type == "green":
        lower, upper = np.array([35, 50, 50]), np.array([85, 255, 255])
    elif background_type == "black":
        lower, upper = np.array([0, 0, 0]), np.array([180, 255, 50])
    else:
        return frame  # No valid background detected, return original frame
    hsv = cv.cvtColor(frame, cv.COLOR_BGR2HSV)
    mask = cv.inRange(hsv, lower, upper)
    mask_inv = cv.bitwise_not(mask)
    return cv.bitwise_and(frame, frame, mask=mask_inv)

def preprocess_frame(frame):
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    gray = cv.GaussianBlur(gray, (5, 5), 0)
    _, bw = cv.threshold(gray, 30, 255, cv.THRESH_BINARY | cv.THRESH_OTSU)
    kernel = np.ones((3, 3), np.uint8)
    bw = cv.morphologyEx(bw, cv.MORPH_CLOSE, kernel, iterations=2)
    return bw

def detect_objects(frame, bw):
    contours, _ = cv.findContours(bw, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
    objects = []
    for c in contours:
        area = cv.contourArea(c)
        if area < 3000 or area > 100000:
            continue  # Ignore very small or very large objects
        rect = cv.minAreaRect(c)
        box = cv.boxPoints(rect)
        box = np.int32(box)
        center = (int(rect[0][0]), int(rect[0][1]))
        width, height = int(rect[1][0]), int(rect[1][1])
        angle = int(rect[2])
        if width < height:
            angle = 90 - angle
        else:
            angle = -angle
        objects.append((box, center, angle))
    return objects

def draw_annotations(frame, objects):
    for box, center, angle in objects:
        cv.drawContours(frame, [box], 0, (0, 0, 255), 2)
        label = f"Rotation: {angle} degrees"
        font_scale, font_thickness = 0.7, 2
        font = cv.FONT_HERSHEY_SIMPLEX
        text_size, _ = cv.getTextSize(label, font, font_scale, font_thickness)
        text_w, text_h = text_size
        text_x = max(10, min(center[0] - 50, frame.shape[1] - text_w - 10))
        text_y = max(30, min(center[1], frame.shape[0] - 10))
        cv.rectangle(frame, (text_x - 10, text_y - text_h - 10),
                     (text_x + text_w + 10, text_y + 10), (255, 255, 255), -1)
        cv.putText(frame, label, (text_x, text_y), font, font_scale, (0, 0, 0), font_thickness)

def main():
    cap = open_camera()
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read frame")
            break
        background_type = detect_background(frame)
        print(f"Detected Background: {background_type}")
        processed_frame = remove_background(frame, background_type)
        bw = preprocess_frame(processed_frame)
        objects = detect_objects(frame, bw)
        draw_annotations(frame, objects)
        cv.imshow('Live Object Orientation', frame)
        key = cv.waitKey(1)
        if key & 0xFF == ord('q') or cv.getWindowProperty('Live Object Orientation', cv.WND_PROP_VISIBLE) < 1:
            break
    cap.release()
    cv.destroyAllWindows()

if __name__ == "__main__":
    main()











































