#!/usr/bin/env bash
set -euo pipefail

# Simple setup script to build the Docker image, run docker-compose and perform a curl health check.
# Usage:
#   ./setup.sh           # build image and start production web service
#   ./setup.sh --dev     # start dev service (vite) instead
#   ./setup.sh --down    # stop and remove containers
#   DRY_RUN=1 ./setup.sh  # print commands instead of executing (useful for testing)

DRY_RUN=${DRY_RUN:-0}
MODE="web"

print() { printf "%s\n" "$*"; }
run() {
  if [ "${DRY_RUN}" = "1" ]; then
    print "DRY_RUN: $*"
  else
    eval "$@"
  fi
}

usage() {
  cat <<EOF
Usage: $0 [--dev|--down]

Options:
  --dev    Start the development service (vite on port 5173)
  --down   Stop and remove containers
  --help   Show this help
Environment:
  DRY_RUN=1   Print commands instead of executing (useful for testing)
EOF
}

if [ "$#" -gt 1 ]; then
  usage
  exit 1
fi

if [ "$#" -eq 1 ]; then
  case "$1" in
    --dev) MODE="dev" ;;
    --down) MODE="down" ;;
    --help) usage; exit 0 ;;
    *) usage; exit 1 ;;
  esac
fi

# detect docker compose command
COMPOSE_CMD=""
if command -v docker >/dev/null 2>&1; then
  if docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
  elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_CMD="docker-compose"
  fi
fi

if [ -z "${COMPOSE_CMD}" ]; then
  print "Error: docker compose not found. Please install Docker and docker compose." >&2
  exit 2
fi

PROJECT_IMAGE="olympiad:latest"


case "${MODE}" in
  web)
    # Ensure lockfile is up to date before building Docker image
    print "Checking for package-lock.json sync..."
    if [ -f package.json ] && [ -f package-lock.json ]; then
      # If npm v7+, use npm install --package-lock-only --silent to update lockfile if needed
      print "Running npm install to update lockfile if needed..."
      run npm install --package-lock-only --silent || run npm install --silent
    fi

    print "Building Docker image ${PROJECT_IMAGE}..."
    run docker build -t "${PROJECT_IMAGE}" .

    print "Starting production web service via compose (web)..."
    run ${COMPOSE_CMD} up --build -d web

    print "Waiting for http://localhost (health check)..."
    MAX_RETRIES=30
    SLEEP=1
    OK=0
    # Update health check port to 8125
    PORT=8125
    for i in $(seq 1 ${MAX_RETRIES}); do
      if [ "${DRY_RUN}" = "1" ]; then
        print "DRY_RUN: curl -sSf http://localhost/ >/dev/null && echo success"
        OK=1
        break
      fi
      if curl -sSf -o /dev/null http://localhost:${PORT}/; then
        OK=1
        print "health check passed (attempt ${i})."
        break
      fi
      printf "."
      sleep ${SLEEP}
    done
    if [ ${OK} -ne 1 ]; then
      print "\nHealth check failed after ${MAX_RETRIES} attempts. Showing web logs..." >&2
      ${COMPOSE_CMD} logs --tail=200 web || true
      exit 3
    fi

    print "Application is up. To stop: ${COMPOSE_CMD} down -v"
    ;;

  dev)
    print "Starting development service via compose (dev)..."
    run ${COMPOSE_CMD} up --build -d dev
    print "Dev server should be available at http://localhost:5173 (hot reload)."
    ;;

  down)
    print "Stopping and removing containers (all services defined in docker-compose.yml)..."
    run ${COMPOSE_CMD} down -v
    ;;
esac

exit 0
