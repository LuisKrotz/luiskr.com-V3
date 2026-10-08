#!/bin/bash
FOLDER=./
find "$FOLDER" -name '*.mp4' -exec sh -c 'ffmpeg -i "$0" -c:v h264 -preset:v ultrafast -vf scale="iw/2:ih/2" "${0%%}-scaledown-2x.mp4"' {} \;
exit;
