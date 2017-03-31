from pyramid.view import view_config, view_defaults

import colander

from ..models import User


@view_defaults(route_name='users', renderer='json',
               permission='authenticated')
class UsersView(object):
    FIELDS = ['email', 'activated', 'is_admin']

    def __init__(self, request):
        self.request = request

    @view_config(request_method="GET")
    def get(self):
        lis = []
        users = self.request.dbsession.query(User).all()
        for user in users:
            lis.append({
                "id": user.id,
                "email": user.email,
                "activated": user.activated,
                "is_admin": user.is_admin,
            })
        return {'users': lis}

    @view_config(request_method="POST")
    def post(self):
        from ..forms import errors_to_angular, user_schema
        dic = self.request.json_body
        try:
            data = user_schema.deserialize(dic)
        except colander.Invalid, e:
            self.request.response.status = 400
            return {'errors': errors_to_angular(e.asdict())}

        user = User()
        for field in self.FIELDS:
            setattr(user, field, data[field])
        self.request.dbsession.add(user)
        return {}


@view_defaults(route_name='users_id', renderer='json',
               permission='authenticated')
class UserView(object):
    FIELDS = ['email', 'activated', 'is_admin']

    def __init__(self, request):
        self.request = request
        self.user = request.matchdict['user']

    @view_config(request_method='GET')
    def get(self):
        user = {
            'id': self.user.id
        }
        for field in self.FIELDS:
            user[field] = getattr(self.user, field)

        return {
            'user': user
        }

    @view_config(request_method='PUT')
    def put(self):
        from ..forms import errors_to_angular, user_schema
        dic = self.request.json_body
        try:
            data = user_schema.deserialize(dic)
        except colander.Invalid, e:
            self.request.response.status = 400
            return {'errors': errors_to_angular(e.asdict())}

        for field in self.FIELDS:
            setattr(self.user, field, data[field])
        return {}

    @view_config(request_method='DELETE')
    def delete(self):
        self.request.dbsession.delete(self.user)
        return {}
