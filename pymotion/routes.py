from . import models


def any_of(segment_name, *allowed):
    def predicate(info, request):
        if info['match'][segment_name] in allowed:
            info['match'][segment_name] = bool(
                int(info['match'][segment_name]))
            return True
    return predicate


def exist_camera(info, request):
    cam_id = info['match']['id']
    cam = request.dbsession.query(models.Camera).get(cam_id)
    if cam:
        info['match']['cam'] = cam
        return True


def exist_user(info, request):
    user_id = info['match']['id']
    user = request.dbsession.query(models.User).get(user_id)
    if user:
        info['match']['user'] = user
        return True


def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    config.add_route('auth_login', '/api/auth/login')
    config.add_route('cams', '/api/cams')
    config.add_route('cams_stream', '/api/cams/{id}/stream')
    config.add_route('cams_id', '/api/cams/{id}',
                     custom_predicates=[exist_camera])

    config.add_route('users', '/api/users')
    config.add_route('users_id', '/api/users/{id}',
                     custom_predicates=[exist_user])

    config.add_route(
        'cams_enable', '/api/cams/{id}/enable/{value}',
        custom_predicates=(any_of('value', '0', '1'), exist_camera))
    config.add_route(
        'cams_detection_enable', '/api/cams/{id}/detection/{value}',
        custom_predicates=(any_of('value', '0', '1'), exist_camera))
    config.add_route(
        'cams_upload_enable', '/api/cams/{id}/upload/{value}',
        custom_predicates=(any_of('value', '0', '1'), exist_camera))
