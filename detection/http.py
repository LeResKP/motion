from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
from SocketServer import ThreadingMixIn

import cv2
import time


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""


def create_handler(video_stream):

    class CamHandler(BaseHTTPRequestHandler):

        def do_GET(self):
            self.send_response(200)
            self.send_header(
                'Content-type',
                'multipart/x-mixed-replace; boundary=--jpgboundary')
            self.end_headers()
            while True:
                img = video_stream.frame
                ret, jpeg = cv2.imencode('.jpg', img)
                content = jpeg.tobytes()
                self.wfile.write("--jpgboundary")
                self.send_header('Content-type', 'image/jpeg')
                self.send_header('Content-length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                time.sleep(0.2)

    return CamHandler


def create_server(host, port, video_stream):
    return ThreadedHTTPServer((host, port), create_handler(video_stream))
