#!/bin/bash
FOLDER=.
find "$FOLDER" -name '*.png' -exec sh -c 'convert "$0" pnm:- | cjpeg -quality 100 > "${0%%}.jpg"' {} \;
exit;
