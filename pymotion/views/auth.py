import pyramid.httpexceptions as exc
from pyramid.security import remember, unauthenticated_userid
from pyramid.view import view_config, view_defaults

import sqlalchemy.orm.exc as sqla_exc
from oauth2client import client

from ..models import User


@view_config(context=exc.HTTPForbidden, renderer='json')
def forbidden_view(context, request):
    if unauthenticated_userid(request):
        request.response.status_int = 403
        return {'msg': "You don't have the right to access this resource"}

    request.response.status_int = 401
    return {'msg': "You are not loggedin"}


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
        secret_file = self.request.registry.settings[
            'google_oauth2.secret_file']
        credentials = client.credentials_from_clientsecrets_and_code(
            secret_file,
            'https://www.googleapis.com/auth/userinfo.email',
            token)

        email = credentials.id_token['email']
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
