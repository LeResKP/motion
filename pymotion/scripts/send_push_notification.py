import os
import sys

import transaction

from pyramid.paster import (
    get_appsettings,
    setup_logging,
    )

from pyramid.scripts.common import parse_vars

from ..models.meta import Base
from ..models import (
    get_engine,
    get_session_factory,
    get_tm_session,
    )
from ..models import Notification
from ..vapid import push_notification


def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri> [var=value]\n'
          '(example: "%s development.ini")' % (cmd, cmd))
    sys.exit(1)


def main(argv=sys.argv):
    if len(argv) < 2:
        usage(argv)
    config_uri = argv[1]
    options = parse_vars(argv[2:])
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, options=options)

    engine = get_engine(settings)
    Base.metadata.create_all(engine)

    session_factory = get_session_factory(engine)
    dbsession = get_tm_session(session_factory, transaction.manager)
    notifications = dbsession.query(Notification).filter(
        Notification.subscription is not None).all()

    for notification in notifications:
        push_notification.send(
            private_key=settings['vapid_private_key'],
            public_key=settings['vapid_public_key'],
            email='a.matouillot@gmail.com',
            subscription=notification.subscription,
            payload={
                'title': 'Test',
                'options': {
                    'body': 'This is my message',
                    'data': {
                        'url': 'http://localhost:8081/'
                    }
                }
            })


if __name__ == '__main__':
    main()
