import StringIO
import os
import requests
import shutil
import zipfile

from pymotion import __version__


API_RELEASES_URL = 'https://api.github.com/repos/LeResKP/pymotion/releases'
NG_BUILD_FOLDER = 'ng-build'


def create_ng_build_folder():
    if os.path.isdir(NG_BUILD_FOLDER):
        shutil.rmtree(NG_BUILD_FOLDER)
    r = requests.get(API_RELEASES_URL)
    if r.status_code != 200:
        raise ValueError('Bad status code %s' % r.status_code)

    releases = r.json()

    release = None
    for rel in releases:
        if rel['tag_name'] == __version__:
            release = rel
            break

    if not release:
        raise Exception('No release found for the current version %s' %
                        __version__)

    assert len(release['assets']) == 1
    url = release['assets'][0]['browser_download_url']

    r = requests.get(url, stream=True)
    if r.status_code != 200:
        raise ValueError('Bad status code %s' % r.status_code)

    z = zipfile.ZipFile(StringIO.StringIO(r.content))
    z.extractall(NG_BUILD_FOLDER)


if __name__ == '__main__':
    create_ng_build_folder()
