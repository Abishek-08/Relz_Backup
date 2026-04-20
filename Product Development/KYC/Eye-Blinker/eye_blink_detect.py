import cv2
import cvzone
from cvzone.FaceMeshModule import FaceMeshDetector
from cvzone.PlotModule import LivePlot

cap = cv2.VideoCapture(0)
detector = FaceMeshDetector(maxFaces=1)
# leftIdList = [22,23,24,26,110,157,158,159,160,161,130,243]
leftIdList = [33,7,163,144,145,153,154,155,133,173,157,158,159,160,161,246]
rightIdList = [362,382,381,380,374,373,390,249,263,466,388,387,386,385,384,398]
leftRatioList = []
leftPlot = LivePlot(640,480,[0,30])
rightPlot = LivePlot(640,480,[0,30])

while True:
    ret,frame = cap.read()
    frame = cv2.resize(frame, (640, 480))

    frame, faces = FaceMeshDetector.findFaceMesh(detector, img=frame, draw=False)

    if faces:
        face = faces[0]
        for id in leftIdList:
            cv2.circle(frame,(face[id]),2,(255,0,255))

        for id in rightIdList:
            cv2.circle(frame,(face[id]),2,(255,0,255))

        # Left-Eye
        leftUp = face[159]
        leftDown = face[23]
        leftLeft = face[130]
        leftRight = face[243]
        print("Left-up: ", leftUp)
        print("Left-Down: ", leftDown)

        # Right-Eye
        rightUp = face[386]
        rightDown = face[253]
        rightLeft = face[362]
        rightRight = face[263]


        # Left-Eye
        leftLengthVertical,_ =  detector.findDistance(leftUp,leftDown)
        leftLengthHorizontal,_ = detector.findDistance(leftLeft, leftRight)
        cv2.line(frame,leftUp,leftDown,(0,200,0),2)
        print("Length-vertical: ", leftLengthVertical)
        cv2.line(frame,leftLeft,leftRight,(0,255,0),2)


        # Right-Eye
        cv2.line(frame,rightUp,rightDown,(0,200,0),2)
        cv2.line(frame,rightLeft,rightRight,(0,255,0),2)
        rightLengthVertical,_ =  detector.findDistance(rightUp,rightDown)
        rightLengthHorizontal,_ = detector.findDistance(rightLeft, rightRight)


        # Left-Eye
        leftRatio = int((leftLengthVertical/leftLengthHorizontal)*100)
        # leftRatioList.append(leftRatio)
        # if len(leftRatioList) > 1:
        #     leftRatioList.pop()
        
        # print('leftRatio-List: ',leftRatioList)
        # leftRatioAvg = sum(leftRatioList)/len(leftRatioList)


        # Right-Eye
        rightRatio = int((rightLengthVertical/rightLengthHorizontal)*100)

        # Left-Eye
        leftImgPlot = leftPlot.update(leftRatio)

        # Left-Eye
        rightImgPlot = leftPlot.update(rightRatio)



        imgStack = cvzone.stackImages([frame, leftImgPlot,rightImgPlot],2, 1)


    cv2.imshow('video', imgStack)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()