from threading import Thread

import cv2
import imutils
import datetime
import time


conf = {
    "delta_thresh": 5,
    "min_area": 500,
}


class VideoStream(Thread):

    def __init__(self, num, detection):
        super(VideoStream, self).__init__()
        self._active = True
        self.num = num
        self.video_stream = cv2.VideoCapture(self.num)
        self.avg = None
        self.frame = None
        self.detection = detection

    def stop(self):
        self._active = False
        self.video_stream.release()

    def run(self):
        # print 'detection called'
        # keep looping infinitely until the thread is stopped
        # for frame in self.video_stream.iter():
        while self._active:
            grabbed, frame = self.video_stream.read()
            if not grabbed:
                # TODO: add counter to break if too much error
                continue

            timestamp = datetime.datetime.now()
            text = "Unoccupied"

            # resize the frame, convert it to grayscale, and blur it
            frame = imutils.resize(frame, width=400)
            if self.detection:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                gray = cv2.GaussianBlur(gray, (21, 21), 0)

                # if the average frame is None, initialize it
                if self.avg is None:
                    print "[INFO] starting background model..."
                    self.avg = gray.copy().astype("float")
                    continue

                # accumulate the weighted average between the current frame and
                # previous frames, then compute the difference between the current
                # frame and running average
                cv2.accumulateWeighted(gray, self.avg, 0.5)
                frameDelta = cv2.absdiff(gray, cv2.convertScaleAbs(self.avg))

                # threshold the delta image, dilate the thresholded image to fill
                # in holes, then find contours on thresholded image
                thresh = cv2.threshold(
                    frameDelta, conf["delta_thresh"], 255, cv2.THRESH_BINARY)[1]
                thresh = cv2.dilate(thresh, None, iterations=2)
                tple = cv2.findContours(
                    thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

                if len(tple) == 2:
                    # opencv 2
                    cnts = tple[0]
                elif len(tple) == 3:
                    # opencv 3
                    cnts = tple[1]
                else:
                    raise NotImplementedError()

                # loop over the contours
                for c in cnts:
                    # if the contour is too small, ignore it
                    if cv2.contourArea(c) < conf["min_area"]:
                        continue

                    # compute the bounding box for the contour, draw it on the
                    # frame, and update the text
                    (x, y, w, h) = cv2.boundingRect(c)
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                    text = "Occupied"

                # draw the text and timestamp on the frame
                ts = timestamp.strftime("%A %d %B %Y %I:%M:%S%p")
                cv2.putText(frame, "Room Status: {}".format(text), (10, 20),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
                cv2.putText(frame, ts, (10, frame.shape[0] - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 0, 255), 1)

            self.frame = frame
            time.sleep(0.1)
