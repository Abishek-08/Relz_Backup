import cv2

# Global variables to store coordinates
ix, iy = -1, -1

# Mouse callback function
def draw_circle(event, x, y, flags, param):
    global ix, iy
    if event == cv2.EVENT_LBUTTONDOWN:
        ix, iy = x, y
        cv2.circle(img, (x, y), 5, (255, 0, 0), -1)
        print(f"Coordinates: ({x}, {y})")


# Load the image
img = cv2.imread('space_bg.jpg')

# Create a window and bind the callback function
cv2.namedWindow('image')
cv2.setMouseCallback('image', draw_circle)

while(True):
    cv2.imshow('image', img)
    k = cv2.waitKey(1) & 0xFF
    if k == 27:
        break
    elif k == ord('s'):
        print(f"Last clicked coordinates: ({ix}, {iy})")

cv2.destroyAllWindows()