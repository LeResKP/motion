import pyramid.httpexceptions as exc
from pyramid.security import remember
from pyramid.view import view_config

import sqlalchemy.orm.exc as sqla_exc

from oauth2client import client

from ..models.user import User

# Resources:
# https://developers.google.com/identity/protocols/OAuth2WebServer
# https://developers.google.com/api-client-library/python/auth/web-app


class AuthenticationCompleted(object):

    def __init__(self, credentials):
        self.credentials = credentials


def _get_flow(request):
    key = request.registry.settings['google_oauth2.consumer_key']
    secret = request.registry.settings['google_oauth2.consumer_secret']
    flow = client.OAuth2WebServerFlow(
        client_id=key,
        client_secret=secret,
        scope='https://www.googleapis.com/auth/userinfo.email',
        redirect_uri=request.route_url('login-callback'))
    return flow


def login(request):
    # TODO: handle error
    flow = _get_flow(request)
    auth_uri = flow.step1_get_authorize_url()
    return exc.HTTPFound(auth_uri)


def callback(request):
    # TODO: handle error
    auth_code = request.params.get('code')
    flow = _get_flow(request)
    credentials = flow.step2_exchange(auth_code)
    email = credentials.id_token['email']
    try:
        user = request.dbsession.query(User).filter_by(
            email=email, activated=True).one()
    except (sqla_exc.NoResultFound, sqla_exc.MultipleResultsFound):
        raise exc.HTTPUnauthorized()
    headers = remember(request, user.id)
    return exc.HTTPFound('/', headers=headers)


def includeme(config):
    config.add_view(login, route_name='login')
    config.add_view(callback, route_name='login-callback')
    config.add_route('login', '/login')
    config.add_route('login-callback', '/login/callback')
    config.scan(__name__)
