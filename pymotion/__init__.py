from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.config import Configurator
from pyramid.events import NewRequest
from pyramid.security import Allow, Authenticated


# Allow cross origin in dev
def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '1728000',
        })

    event.request.add_response_callback(cors_headers)




class RootFactory(object):
    __acl__ = [
        (Allow, Authenticated, 'authenticated'),
    ]

    def __init__(self, request):
        pass


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings, root_factory=RootFactory)
    secret = settings['authentication.cookie.secret']
    authn_policy = AuthTktAuthenticationPolicy(
        secret,
        hashalg='sha512',
        timeout=3600,
        max_age=3600,
    )
    authz_policy = ACLAuthorizationPolicy()
    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)

    config.include('pyramid_jinja2')
    config.include('.models')
    config.include('.routes')
    config.add_subscriber(add_cors_headers_response_callback, NewRequest)
    config.scan()
    return config.make_wsgi_app()
