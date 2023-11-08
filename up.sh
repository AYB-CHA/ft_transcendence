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
    echo Check if docker is running
fi

wait