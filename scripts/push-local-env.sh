#!/usr/bin/env bash
cat .env | grep -v '^#' | grep -v '^$' | while IFS='=' read -r key value; do
  echo "$value" | vercel env add "$key" production
done
