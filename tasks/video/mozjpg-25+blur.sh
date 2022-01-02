#!/bin/bash
find . -name '*.jpg' -exec sh -c 'convert "$0" -quality 25 -gravity center -blur 0x10 "${0%%}-thumb.jpg"' {} \;
exit;