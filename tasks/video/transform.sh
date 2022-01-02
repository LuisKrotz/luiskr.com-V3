#!/bin/bash
FOLDER=./
find "$FOLDER" -name '*.mov' -exec sh -c 'ffmpeg -i "$0" -c:v h264 -preset:v ultrafast "${0%%}.mp4"' {} \;
exit;
