from pyramid.response import Response
from pyramid.view import view_config

from sqlalchemy.exc import DBAPIError

from ..models import MyModel

from ..cam_config import CAMS


@view_config(route_name='cams', renderer='json')
def cams(request):
    lis = []
    for cam in CAMS:
        lis.append({
            "name": cam.name,
            "url": cam.get_url(),
        })
    return {'cams': lis}
