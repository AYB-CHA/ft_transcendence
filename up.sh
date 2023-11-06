#!/usr/bin/env bash


trap cleanup SIGINT

cleanup () {
    pkill -P $$
    exit 0
}

if docker compose up -d 2> /dev/null ; then
    cd ./backend && npx prisma db push && npm run start:dev &
    cd ./frontend && npm run dev & 
else
    open /Applications/Docker.app
    echo "Check if docker is running."
    exit 1
fi

curl -s "http://smacie.com/randomizer/borat.txt" | sort -R | head -n1

wait