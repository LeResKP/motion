import StringIO
import getpass
import json
import os
import requests
import shutil
import zipfile

from pymotion import __version__


API_RELEASES_URL = 'https://api.github.com/repos/LeResKP/pymotion/releases'


def main():

    pwd = getpass.getpass('Github password for lereskp: ')

    from github3 import login
    gh = login('lereskp', password=pwd)
    repo = gh.repository('lereskp', 'pymotion')
    release = None
    for rel in repo.iter_releases():
        if rel.tag_name == __version__:
            release = rel
            break

    if not release:
        release = repo.create_release(
            tag_name=__version__,
            target_commitish='develop',
            name=__version__,
            body='Description',
            draft=False,
            prerelease=True
        )

    asset_ng = release.upload_asset(
        content_type='application/zip',
        name='pymotion-ng.zip',
        asset=open('./angular/build/pymotion-ng.zip', 'rb').read()
    )

    filename = None
    for root, dirs, files in os.walk('./dist/'):
        assert(len(files) == 1)
        filename = files[0]

    assert(filename)
    asset_py = release.upload_asset(
        content_type='application/x-gzip',
        name='pymotion-py.tar.gz',
        asset=open('./dist/%s' % filename, 'rb').read()
    )


if __name__ == '__main__':
    main()
