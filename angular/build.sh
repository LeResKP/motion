#!/bin/bash

SCRIPT=$(readlink -f $0)
SCRIPTPATH=`dirname $SCRIPT`

# Be sure we run the script in it's folder
cd $SCRIPTPATH

rm -rf build/

npm run build:aot

# NOTE: we keep the path in node_modules to not have to update the index.html file
mkdir -p build/node_modules/google-fonts/
cp node_modules/google-fonts/material-icons.css build/node_modules/google-fonts/
mkdir -p build/node_modules/@angular/material/core/theming/prebuilt/
cp node_modules/@angular/material/core/theming/prebuilt/indigo-pink.css build/node_modules/@angular/material/core/theming/prebuilt/
mkdir -p build/node_modules/core-js/client/
cp node_modules/core-js/client/shim.min.js build/node_modules/core-js/client/
mkdir -p build/node_modules/zone.js/dist/
cp node_modules/zone.js/dist/zone.js build/node_modules/zone.js/dist/
mkdir -p build/node_modules/google-fonts
cp google-fonts/2fcrYFNaTjcS6g4U3t-Y5StnKWgpfO2iSkLzTz-AABg.ttf build/node_modules/google-fonts/
cp src/styles.css build/
cp src/index-aot.html build/index.html

cd build
zip -r pymotion-ng.zip *
