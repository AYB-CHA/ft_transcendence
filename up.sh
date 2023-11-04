#!/usr/bin/env bash

if docker compose up -d 2> /dev/null ; then
    cd ./backend && npm run start:dev &
    cd ./frontend && npm run dev & 
else
    echo "check if docker is running."
    exit 1
fi

curl -s "http://smacie.com/randomizer/borat.txt" | sort -R | head -n1

wait