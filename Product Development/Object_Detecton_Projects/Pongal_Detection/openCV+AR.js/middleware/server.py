from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
from PIL import Image
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/test')
def test():
    return "Running successfully"

@app.route('/process_frame', methods=['POST'])
def process_frame():
    data = request.json
    image_data = data.get('image')  # Base64 encoded image

    if image_data:
        # Remove the 'data:image/jpeg;base64,' part from the imageData
        image_data = image_data.split(',')[1]
        # Decode the base64 string
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))

        # Convert the image to OpenCV format
        open_cv_image = np.array(image)
        open_cv_image = open_cv_image[:, :, ::-1].copy()  # Convert RGB to BGR

        # Use OpenCV to detect keypoints (e.g., using ORB)
        orb = cv2.ORB_create()
        gray = cv2.cvtColor(open_cv_image, cv2.COLOR_BGR2GRAY)
        kp, des = orb.detectAndCompute(gray, None)

        # For demonstration, return the number of keypoints detected
        return jsonify({"keypoints": len(kp)})

    return jsonify({"error": "No image data received"}), 400

if __name__ == '__main__':
    app.run(debug=True)
