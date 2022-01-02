#!/bin/bash
FOLDER=./
find "$FOLDER" -name '*.png' -exec sh -c 'convert "$0" pnm:- | cjpeg -quality 75 > "${0%%}-mozjpg-75.jpg"' {} \;
exit;
