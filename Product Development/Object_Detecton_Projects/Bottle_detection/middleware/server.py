from flask import Flask, Response
from flask_cors import CORS
from detect import generate_frames  # Import the function from detect.py

app = Flask(__name__)
CORS(app)  # Enable CORS if you need to access it from another origin (e.g., React frontend)

@app.route('/live')
def video():
    # Stream the MJPEG content
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
