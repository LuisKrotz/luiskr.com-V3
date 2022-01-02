#!/bin/bash
find . -name '*.mp4' -exec sh -c 'ffmpeg -i "$0" "${0%%}.jpg"' {} \;
exit;
