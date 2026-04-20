from flask import Flask, request, jsonify
import base64
from io import BytesIO
from PIL import Image
from flask_cors import CORS
from main_frontEnd import recognize_object
import numpy as np
import cv2

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        # Get the image data from the request
        data = request.get_json()
        image_data_url = data.get('image')

        # Remove the base64 metadata prefix (data:image/jpeg;base64,)
        image_data = image_data_url.split(",")[1]

        # Decode the base64 string to binary data
        image_binary = base64.b64decode(image_data)

        # Convert binary data to an image
        image = Image.open(BytesIO(image_binary))

        # Convert the PIL image to a NumPy array (OpenCV format)
        opencv_image = np.array(image)

        # Convert RGB to BGR (OpenCV uses BGR instead of RGB)
        if opencv_image.ndim == 3:
            opencv_image = cv2.cvtColor(opencv_image, cv2.COLOR_RGB2BGR)

        # Call the recognize_object function (assuming it processes the OpenCV image)
        if recognize_object(opencv_image):
           return jsonify({"message": "Image Found"}), 200
        else:
            return jsonify({"message":"Image Not Found"}), 412
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)
