#!/bin/bash

set -e

echo "Running fast pre-ci..."

cd sitebackend
chmod +x mvnw || true
./mvnw clean verify
cd ..

npm ci
npm audit --audit-level=high
npm run build
npm run test:run
npm run lint

echo "OK"
