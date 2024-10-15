export function getSymfonyScript() {
  return `#!/usr/bin/env bash

DC="docker compose -f compose.local.yml --env-file .env --env-file .env.local"
DE="$DC exec"
DR="$DC run --rm"

success() {
  echo -e "\\033[32m$\{1}\\033[0m"
}

error() {
    echo -e "\\033[31m\`basename $0\`: $\{1}\\033[0m"
}

usage() {

   echo
   echo -e "usage: \\033[32m\`basename $0\`\\033[0m <command>"
   echo
   echo "commands:"
   echo "- dev                    Launch the development server"
   echo "- build                  Build the image of the compose file"
   echo "- start [service]        Start the development or the specified service"
   echo "- stop [service]         Stop the development server or the specified service"
   echo "- restart [service]      Restart the development server or the specified service"
   echo "- clean                  Clean all volatiles directories (var, vendor, node_modules, public/build)"
   echo "- log [service]          Print logs of all services or specific one if given"
   echo "- ps                     List all running containers"
   echo "- database               Execute doctrine:schema:update"
   echo "- connect <service>      Connect to the container"
   echo "- console                Execute bin/console command"
   echo "- yarn                   Execute yarn command"
   echo "- composer               Execute composer command"
   echo "- <vendor-binary>        Execute vendor binary (ex: phpstan, php-cs-fixer, ...) if installed"
   echo
   echo "services:"
   echo "- php                    PHP, Symfony service"
   echo "- db                     Database service"
   echo "- node                   Node service (optional)"
   echo "- mail                   Mail service (optional)"
   echo "- minio                  Minio (S3) service (optional)"
   echo "- influxdb               InfluxDb service (optional)"
   echo "- pdf                    Gotenberg (PDF) service (optional)"
   echo
}

isDockerRunning() {
  docker info &> /dev/null
  if [[ $? -ne 0 ]]; then
    error "Docker is not installed or launched"
    exit 2
  fi
}

function handle_containers_ctrlc() {
  $DC down "$@"
}

## Show help
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    usage
    exit 0
fi

## Variables
COMMAND="$1"
shift

isDockerRunning

case "$COMMAND" in
  "dev")
  trap handle_containers_ctrlc SIGINT
  $DC up --build --force-recreate "$@"
  ;;
  "build")
  $DC build "$@"
  ;;
  "start")
  $DC up --build --force-recreate -d "$@"
  ;;
  "stop")
  $DC down "$@"
  ;;
  "restart")
  $DC restart "$@"
  ;;
  "clean")
  rm -rf public/build node_modules vendor var
  ;;
  "ps")
  $DC ps
  ;;
  "log")
  $DC logs -f "$@"
  ;;
  "database")
  $DE php symfony console doctrine:schema:update --force --complete
  ;;
  "connect")
  $DE -it "$@" sh
  ;;
  "console")
  $DE -it php symfony console "$@"
  ;;
  "yarn")
  $DR -it node yarn "$@"
  ;;
  "composer")
  $DE -it php composer "$@"
  ;;
  *)
  # Check if the command is a vendor binary
  if [[ -f "./vendor/bin/$COMMAND" ]]; then
    $DE -it php ./vendor/bin/$COMMAND $*
  else
    error "Unknown command"
    usage
    exit 1
  fi
esac

exit 0
`
}
