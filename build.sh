#!/usr/bin/env sh


sh ./angular/build.sh
rm -rf dist
python setup.py sdist
python -m pymotion.scripts.release
