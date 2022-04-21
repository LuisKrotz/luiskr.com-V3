execute transform.sh - if the files aren't .mov, change the ext. on the scipt, this will generate the uncompressed mp4 file.
execute the reduce.sh - if 1920 use the i/2 def. config, if the video is 4K change to i/4 this will generate a smaller video for the previews
execute the create-thumb to generate a poster from the first frame of the mp4 files
execute the mozjpg-25+blur to compress to 25% optimized mozjpg and add a blut to the thumb, this will improve compression as there are many more similar pixels in a blurred image