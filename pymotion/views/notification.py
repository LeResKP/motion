"""API for Nofication
"""

import json

from pyramid.view import view_config, view_defaults

from ..models import Notification


@view_defaults(route_name='notification', renderer='json',
               permission='authenticated')
class NotificationView(object):

    def __init__(self, request):
        self.request = request

    @view_config(request_method="POST")
    def post(self):
        dic = self.request.json_body
        if 'subscription' not in dic:
            self.request.response.status = 400
            # TODO: ng format ?
            return {'errors': 'subscription required'}

        notification = self.request.user.notification
        if not notification:
            notification = Notification(user_id=self.request.user.id)

        notification.subscription = json.dumps(dic['subscription'])
        self.request.dbsession.add(notification)
        return {}
