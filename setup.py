import os
import re

from setuptools import setup, find_packages


here = os.path.abspath(os.path.dirname(__file__))
# NOTE: don't use pkg_resources.require("pymotion")[0].version to get the
# version since the version interpreted, for example 0.1-alpha.1 is replaced by
# 0.1a1
with open(os.path.join(here, 'pymotion', '__init__.py')) as f:
    VERSION = re.compile(
        r".*__version__ = '(.*?)'", re.S
    ).match(f.read()).group(1)
with open(os.path.join(here, 'README.txt')) as f:
    README = f.read()
with open(os.path.join(here, 'CHANGES.txt')) as f:
    CHANGES = f.read()

requires = [
    'pyramid',
    'pyramid_jinja2',
    'pyramid_debugtoolbar',
    'pyramid_tm',
    'SQLAlchemy',
    'transaction',
    'zope.sqlalchemy',
    'waitress',
    'oauth2client',
    'deform',
    'google-api-python-client',
    'requests',
    'imutils',
]

tests_require = [
    'WebTest >= 1.3.1',  # py3 compat
    'pytest',  # includes virtualenv
    'pytest-cov',
]

dev_require = [
    'github3.py',
]

setup(name='pymotion',
      version=VERSION,
      description='pymotion',
      long_description=README + '\n\n' + CHANGES,
      classifiers=[
          "Programming Language :: Python",
          "Framework :: Pyramid",
          "Topic :: Internet :: WWW/HTTP",
          "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
      ],
      author='',
      author_email='',
      url='',
      keywords='web wsgi bfg pylons pyramid',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      extras_require={
          'testing': tests_require,
          'dev': dev_require,
      },
      install_requires=requires,
      entry_points="""\
      [paste.app_factory]
      main = pymotion:main
      [console_scripts]
      initialize_pymotion_db = pymotion.scripts.initializedb:main
      initialize_pymotion = pymotion.scripts.get_ng_build:create_ng_build_folder
      pymotion_detection = pymotion.detection.process:main
      """,
      )
