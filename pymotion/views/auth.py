import json

import pyramid.httpexceptions as exc
from pyramid.security import forget, remember, unauthenticated_userid
from pyramid.view import view_config, view_defaults

from oauth2client import client, crypt
import sqlalchemy.orm.exc as sqla_exc

from ..models import User


@view_config(context=exc.HTTPForbidden, renderer='json')
def forbidden_view(context, request):
    if unauthenticated_userid(request):
        request.response.status_int = 403
        return {'msg': "You don't have the right to access this resource"}

    request.response.status_int = 401
    return {'msg': "You are not loggedin"}


@view_defaults(route_name='keys', renderer='json')
class KeysView(object):

    def __init__(self, request):
        self.request = request

    @view_config(request_method="GET")
    def get(self):
        return {
            'google_oauth2_client_id': self.request.registry.settings[
                'google_oauth2_client_id'],
            'vapid_public_key': self.request.registry.settings[
                'vapid_public_key']
        }


@view_defaults(route_name='auth_login', renderer='json')
class AuthView(object):

    def __init__(self, request):
        self.request = request

    @view_config(request_method="GET")
    def get(self):
        userid = self.request.authenticated_userid
        if not userid:
            self.request.response.status = 401
            return {'msg': "You are not loggedin"}

        user = self.request.dbsession.query(User).get(userid)
        return {
            'email': user.email,
            'is_admin': user.is_admin,
        }

    @view_config(request_method="POST")
    def post(self):
        token = self.request.json_body['token']

        CLIENT_ID = json.load(open(self.request.registry.settings[
            'google_oauth2.secret_file'], 'r'))['web']['client_id']
        try:
            idinfo = client.verify_id_token(token, CLIENT_ID)

            if idinfo['iss'] not in ['accounts.google.com',
                                     'https://accounts.google.com']:
                raise crypt.AppIdentityError("Wrong issuer.")
        except crypt.AppIdentityError:
            # Invalid token
            raise crypt.AppIdentityError("Wrong issuer.")

        email = idinfo['email']

        try:
            user = self.request.dbsession.query(User).filter_by(
                email=email, activated=True).one()
        except (sqla_exc.NoResultFound, sqla_exc.MultipleResultsFound):
            raise exc.HTTPUnauthorized()
        if not user.activated:
            raise exc.HTTPUnauthorized()

        headers = remember(self.request, user.id)
        self.request.response.headerlist.extend(headers)
        return {
            'email': user.email,
            'is_admin': user.is_admin,
        }


@view_defaults(route_name='auth_logout', renderer='json')
class LogoutView(object):

    def __init__(self, request):
        self.request = request

    @view_config(request_method="POST")
    def post(self):
        headers = forget(self.request)
        self.request.response.headerlist.extend(headers)
        return {}
