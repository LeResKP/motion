class Camera(object):

    def __init__(self, **kw):
        self.src = kw['src']
        self.name = kw['name']
        self.host = kw['host']
        self.port = kw['port']
        self.public_url = kw['public_url']

    def get_url(self):
        if self.public_url:
            return self.public_url
        return '%s:%s' % (self.host, self.port)


CONFIG = {
    "cams": [
        {
            "src": 0,
            "name": "Salon 1",
            "host": "127.0.0.1",
            "port": 8080,
            "public_url": 'http://rpi/cams/0',
        },
        {
            "src": 1,
            "name": "Salon 2",
            "host": "127.0.0.1",
            "port": 8081,
            "public_url": 'http://rpi/cams/1',
        }
    ]
}


CAMS = [Camera(**cam) for cam in CONFIG['cams']]
