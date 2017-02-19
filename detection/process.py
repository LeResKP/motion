import multiprocessing
from threading import Thread

import signal
import time

from .video import VideoStream
from .http import create_server
from .config import CAMS


class ExitException(Exception):
    pass


def sigterm_handler(signal_number, stack_frame):
    raise ExitException


class VideoProcess(multiprocessing.Process):

    def __init__(self, camera):
        super(VideoProcess, self).__init__()
        self.camera = camera
        self.exit = multiprocessing.Event()

    def run(self):
        try:
            video_stream = VideoStream(self.camera.src)
            video_stream.start()
            server = create_server(
                self.camera.host, self.camera.port, video_stream)
            thread = Thread(target=server.serve_forever)
            thread.daemon = True
            thread.start()
            while not self.exit.is_set():
                time.sleep(0.5)
        except ExitException:
            video_stream.stop()
            server.shutdown()
            video_stream.join()
            thread.join()
        print "You exited!"

    def shutdown(self):
        print "Shutdown initiated"
        self.exit.set()


def main():
    signal.signal(signal.SIGTERM, sigterm_handler)
    signal.signal(signal.SIGINT, sigterm_handler)

    try:
        processes = []
        for cam in CAMS:
            p = VideoProcess(cam)
            processes.append(p)
            p.start()

        while True:
            time.sleep(0.5)
    except ExitException:
        for p in processes:
            p.shutdown()

        for p in processes:
            p.join()


if __name__ == '__main__':
    main()
