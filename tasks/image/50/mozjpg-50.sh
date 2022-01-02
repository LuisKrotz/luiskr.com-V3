#!/bin/bash
FOLDER=./
find "$FOLDER" -name '*.png' -exec sh -c 'convert "$0" pnm:- | cjpeg -quality 50 > "${0%%}-mozjpg-50.jpg"' {} \;
exit;
