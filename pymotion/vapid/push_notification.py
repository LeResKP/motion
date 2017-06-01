"""Since I didn't manage to use pywebpush I created this wrapper to use node
version of push notification
"""

import json
import os
from subprocess import Popen, PIPE


def send(private_key, public_key, email, subscription, payload):
    """
    """
    options = {
        'vapidDetails': {
            'subject': 'mailto:%s' % email,
            'privateKey': private_key,
            'publicKey': public_key,
        }

    }
    dic = {
        'options': options,
        'subscription': subscription,
        'payload': payload,
    }
    path = os.path.dirname(os.path.realpath(__file__))
    cmd = ['node', os.path.join(path, 'node', 'send_push_notification.js'),
           '%s' % json.dumps(dic)]

    process = Popen(cmd, stdout=PIPE, stderr=PIPE)
    (stdout, stderr) = process.communicate()
    if process.returncode != 0:
        print unicode(stderr)

    print 'out', stdout
    print 'err', stderr
