import multiprocessing
import os
import signal
import sys
import time

from pyramid.paster import get_appsettings

from threading import Thread

from .http import create_server
from ..models import (
    get_engine,
    get_session_factory,
    Camera,
)
from .video import VideoStream


class ExitException(Exception):
    pass


def sigterm_handler(signal_number, stack_frame):
    raise ExitException


class VideoProcess(multiprocessing.Process):

    def __init__(self, camera, dbsession):
        super(VideoProcess, self).__init__()
        self.camera = camera
        self.dbsession = dbsession
        self.exit = multiprocessing.Event()

    def run(self):
        try:
            video_stream = VideoStream(
                num=self.camera.src,
                detection=self.camera.detection_enabled)
            video_stream.start()
            server = create_server(
                self.camera.host, self.camera.port, video_stream)
            thread = Thread(target=server.serve_forever)
            thread.daemon = True
            thread.start()
            while not self.exit.is_set():
                self.dbsession.refresh(self.camera)
                if not self.camera.enabled:
                    self.shutdown()
                    return
                video_stream.detection = self.camera.detection_enabled
                time.sleep(0.5)
        except ExitException:
            video_stream.stop()
            server.shutdown()
            video_stream.join()
            thread.join()

    def shutdown(self):
        self.exit.set()


def start_processes(processes, dbsession):
    # Cleanup old process
    for p in [p for p in processes if not p.is_alive()]:
        processes.remove(p)
    cams = dbsession.query(Camera).filter_by(enabled=True).all()
    started_cams = [p.camera for p in processes]
    for cam in cams:
        if cam not in started_cams:
            # start missing process
            p = VideoProcess(cam, dbsession)
            processes.append(p)
            p.start()


def run(dbsession):
    signal.signal(signal.SIGTERM, sigterm_handler)
    signal.signal(signal.SIGINT, sigterm_handler)

    try:
        processes = []
        while True:
            start_processes(processes, dbsession)
            time.sleep(0.5)

    except ExitException:
        for p in processes:
            p.shutdown()

        for p in processes:
            p.join()


def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri>\n'
          '(example: "%s production.ini")' % (cmd, cmd))
    sys.exit(1)


def main(argv=sys.argv):
    if len(argv) != 2:
        usage(argv)
    config_uri = argv[1]
    settings = get_appsettings(config_uri)
    engine = get_engine(settings)
    session_factory = get_session_factory(engine)
    run(session_factory())


if __name__ == '__main__':
    main()
