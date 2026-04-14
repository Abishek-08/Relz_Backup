import json
import time
import cv2
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack
 
from app.application.Liveliness_Detection.head_movement_detection import detect_pose_direction
from app.application.Liveliness_Detection.eye_blink_detection import detect_blink, reset_status
from app.application.Liveliness_Detection.hand_gesture_detection import detect_hand_gestures, reset_hand_gestures
 
webrtc_router = APIRouter()
pcs = set()
 
 
class VideoTransformTrack(VideoStreamTrack):
    def __init__(self, track, channel_holder):
        super().__init__()
        self.track = track
        self.channel_holder = channel_holder
 
        # detector enable flags
        self.enabled_detectors = {"pose": False, "hands": False, "blink": False}
 
    async def recv(self):
        frame = await self.track.recv()
        img = frame.to_ndarray(format="bgr24")
        results = {}
 
        # --- Pose detection (works fine)
        if self.enabled_detectors.get("pose"):
            try:
                results["pose"] = detect_pose_direction(img)
            except Exception as e:
                results["pose_error"] = str(e)
 
        # --- Blink detection (works fine)
        if self.enabled_detectors.get("blink"):
            try:
                results["blink"] = detect_blink(img)
            except Exception as e:
                results["blink_error"] = str(e)
 
        # --- Hand gesture detection (LIVE)
        if self.enabled_detectors.get("hands"):
            try:
                # 🔥 Live gesture detection (runs mediapipe internally)
                gesture_result = detect_hand_gestures(img)
                results["hands"] = gesture_result
            except Exception as e:
                results["hands_error"] = str(e)
 
        # --- Send back results over DataChannel
        channel = self.channel_holder.get("channel")
        if channel and hasattr(channel, "readyState") and channel.readyState == "open":
            payload = {
                "timestamp": time.time(),
                "results": results,
            }
            try:
                channel.send(json.dumps(payload))
            except Exception:
                pass
 
        return frame
 
 
@webrtc_router.post("/offer")
async def offer(request: Request):
    """
    SDP Offer → Answer handshake.
    """
    params = await request.json()
    offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])
    pc = RTCPeerConnection()
    pcs.add(pc)
    channel_holder = {"channel": None}
 
    @pc.on("datachannel")
    def on_datachannel(channel):
        channel_holder["channel"] = channel
        print("✅ Data channel created:", channel.label)
 
        @channel.on("message")
        def on_message(message):
            try:
                data = json.loads(message)
                track: VideoTransformTrack = getattr(pc, "video_track", None)
 
                # Enable/disable detectors
                if "enable" in data:
                    if track:
                        for key in ["pose", "hands", "blink"]:
                            track.enabled_detectors[key] = key in data["enable"]
                        print("🔧 Updated detectors:", track.enabled_detectors)
 
                # Reset blink
                if data.get("command") == "reset_blink":
                    reset_status()
                    print("Blink status reset manually")
 
                # Reset hand gesture states
                if data.get("command") == "reset_hands":
                    reset_hand_gestures()
                    print("Hand gesture status reset manually")
 
            except Exception as e:
                print("⚠️ Failed to parse message or execute command:", e)
 
    @pc.on("track")
    def on_track(track):
        print("📹 Received track:", track.kind)
        if track.kind == "video":
            video_track = VideoTransformTrack(track, channel_holder)
            pc.video_track = video_track
            pc.addTrack(video_track)
 
    await pc.setRemoteDescription(offer)
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    return JSONResponse({"sdp": pc.localDescription.sdp, "type": pc.localDescription.type})
 