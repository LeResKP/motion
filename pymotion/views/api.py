"""API for camera
"""


from pyramid.view import view_config, view_defaults

import colander

from ..models import Camera


@view_defaults(route_name='cams', renderer='json',
               permission='authenticated')
class CamerasViews(object):
    FIELDS = ['name', 'src', 'host', 'port', 'public_url']

    def __init__(self, request):
        self.request = request

    @view_config(request_method="GET")
    def get(self):
        lis = []
        cams = self.request.dbsession.query(Camera).all()
        for cam in cams:
            lis.append({
                "id": cam.id,
                "name": cam.name,
                "url": cam.get_url(),
                "enabled": cam.enabled,
                "detection_enabled": cam.detection_enabled,
                "upload_enabled": cam.upload_enabled,
            })
        return {'cams': lis}

    @view_config(request_method="POST")
    def post(self):
        from ..forms import camera_schema, errors_to_angular
        dic = self.request.json_body
        try:
            data = camera_schema.deserialize(dic)
        except colander.Invalid, e:
            self.request.response.status = 400
            return {'errors': errors_to_angular(e.asdict())}

        camera = Camera()
        for field in self.FIELDS:
            if field not in data:
                continue
            setattr(camera, field, data[field])
        self.request.dbsession.add(camera)
        return {}


@view_defaults(route_name='cams_id', renderer='json',
               permission='authenticated')
class CameraViews(object):
    FIELDS = ['name', 'src', 'host', 'port', 'public_url']

    def __init__(self, request):
        self.request = request
        self.camera = request.matchdict['cam']

    @view_config(request_method='GET')
    def get(self):
        camera = {
            'id': self.camera.id
        }
        for field in self.FIELDS:
            camera[field] = getattr(self.camera, field)

        return {
            'camera': camera
        }

    @view_config(request_method='PUT')
    def put(self):
        from ..forms import camera_schema, errors_to_angular
        dic = self.request.json_body
        try:
            data = camera_schema.deserialize(dic)
        except colander.Invalid, e:
            self.request.response.status = 400
            return {'errors': errors_to_angular(e.asdict())}

        for field in self.FIELDS:
            if field not in data:
                continue
            setattr(self.camera, field, data[field])
        return {}

    @view_config(request_method='DELETE')
    def delete(self):
        self.request.dbsession.delete(self.camera)
        return {}


@view_config(route_name='cams_stream', permission='authenticated')
def cams_stream(request):
    request.response.headers['X-Accel-Redirect'] = (
        str("/protected/cam/%s" % request.matchdict['id']))
    return request.response


@view_config(route_name='cams_enable', renderer='json',
             permission='authenticated')
def cams_enable(request):
    value = request.matchdict['value']
    cam = request.matchdict['cam']
    cam.enabled = value
    return {'value': value}


@view_config(route_name='cams_detection_enable', renderer='json',
             permission='authenticated')
def cams_detection_enable(request):
    value = request.matchdict['value']
    cam = request.matchdict['cam']
    cam.detection_enabled = value
    return {'value': value}


@view_config(route_name='cams_upload_enable', renderer='json',
             permission='authenticated')
def cams_upload_enable(request):
    value = request.matchdict['value']
    cam = request.matchdict['cam']
    cam.upload_enabled = value
    return {'value': value}
