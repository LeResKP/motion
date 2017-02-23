from pyramid.response import Response
from pyramid.view import view_config

from sqlalchemy.exc import DBAPIError

from ..models import Camera

from ..cam_config import CAMS


@view_config(route_name='cams', renderer='json', permission='authenticated')
def cams(request):
    lis = []
    cams = request.dbsession.query(Camera).all()
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
