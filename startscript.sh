#!/bin/bash

# Simple bash script for launching Firefox with 2 useful tabs
# and main.js
nohup /mnt/c/Program\ Files\ \(x86\)/Mozilla\ Firefox/firefox.exe localhost:8888 open.spotify.com &
rm -v nohup.out
nodemon index.js
