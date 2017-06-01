"""Since I didn't manage to generate keys using py_valid I created this wrapper
to use node package: https://github.com/web-push-libs/web-push

I run npm install web-push in this folder to have web push binary
"""


import os
from subprocess import Popen, PIPE


def generate_keys():
    path = os.path.dirname(os.path.realpath(__file__))
    cmd = ['node', os.path.join(path, './node_modules/.bin/web-push'),
           'generate-vapid-keys', '--json']
    process = Popen(cmd, stdout=PIPE, stderr=PIPE)
    (stdout, stderr) = process.communicate()
    if process.returncode != 0:
        print unicode(stderr)
    print stdout
    print stderr


if __name__ == '__main__':
    generate_keys()
