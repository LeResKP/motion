from pyramid.response import Response
from pyramid.security import remember
from pyramid.view import view_config, view_defaults

from sqlalchemy.exc import DBAPIError
import sqlalchemy.orm.exc as sqla_exc

import deform

from ..models import Camera, User

from ..cam_config import CAMS

from apiclient import discovery
import httplib2
from oauth2client import client


@view_defaults(route_name='auth_login', renderer='json')
class AuthView(object):

    def __init__(self, request):
        self.request = request

    @view_config(request_method="GET", permission='authenticated')
    def get(self):
        return {}


    @view_config(request_method="POST")
    def post(self):
        auth_code = self.request.json_body['token']
        print('token', auth_code)
        CLIENT_SECRET_FILE = '/home/lereskp/dev/github/pymotion/client_secret_motion.json'

        credentials = client.credentials_from_clientsecrets_and_code(
            CLIENT_SECRET_FILE,
            # ['https://www.googleapis.com/auth/drive.appdata', 'profile',
            # 'email'],
            ['https://www.googleapis.com/auth/userinfo.email'],
            auth_code)

        # # Call Google API
        # http_auth = credentials.authorize(httplib2.Http())
        # drive_service = discovery.build('drive', 'v3', http=http_auth)
        # appfolder = drive_service.files().get(fileId='appfolder').execute()

        # Get profile info from ID token
        userid = credentials.id_token['sub']
        email = credentials.id_token['email']
        # TODO: log the user

        try:
            user = self.request.dbsession.query(User).filter_by(
                email=email, activated=True).one()
        except (sqla_exc.NoResultFound, sqla_exc.MultipleResultsFound):
            raise exc.HTTPUnauthorized()
        headers = remember(self.request, user.id)
        self.request.response.headerlist.extend(headers)
        return {'email': email}


@view_config(request_method="GET", renderer='json', route_name='auth_test')
def test(request):
    print 'hello'
    auth_code = '4/vkZdrNd5qzUu9U2aO3xI71RiZV2i9VrO2svv-sVK3D0'
    auth_code = '4/cqbyn9WSKutwYrOIb15Rfa-uDCkWj4jfSapxdr6FBuw'
    CLIENT_SECRET_FILE = '/home/lereskp/dev/github/pymotion/client_secret_motion.json'

    print open(CLIENT_SECRET_FILE, 'r').read()
    credentials = client.credentials_from_clientsecrets_and_code(
        CLIENT_SECRET_FILE,
        ['https://www.googleapis.com/auth/userinfo.email'],
        # ['https://www.googleapis.com/auth/drive.appdata', 'profile', 'email'],
        auth_code)

    # Call Google API
    http_auth = credentials.authorize(httplib2.Http())
    drive_service = discovery.build('drive', 'v3', http=http_auth)
    appfolder = drive_service.files().get(fileId='appfolder').execute()

    # Get profile info from ID token
    userid = credentials.id_token['sub']
    email = credentials.id_token['email']
    return {'userid': userid, 'email': email}

