#!/bin/bash
find . -name '*.png' -exec sh -c 'convert "$0" -quality 25 -gravity center -blur 0x10 "${0%%}-mozjpg3-MSSIM-tuned-kodak.jpg"' {} \;
exit;