#! /bin/sh

# get ready to colorize output for clarity
RED='\033[0;31m'
BLUE='\033[0;34m'
GRAY='\033[0;37m'
RESET='\033[0m'


# use environment passed in on command line, or default to staging
ENVIRONMENT=${1:-staging}

# find mongo connection uri for that environment
DB_URI=`kubectl --context $ENVIRONMENT get configmap kaws-environment -o jsonpath="{.data.MONGOHQ_URL}"`

# pull remote data
echo "${BLUE}Dumping $ENVIRONMENT database. If this step fails or times out, make sure you are connected to the $ENVIRONMENT VPN.${GRAY}"
mongodump --uri=$DB_URI --out=./tmp-mongo-dump

# replace local db
echo "${BLUE}Replacing local database.${GRAY}"
mongorestore --drop ./tmp-mongo-dump

# clean up
if [ $? -eq 0 ]
then
  echo "${BLUE}Cleaning up.${GRAY}"
  rm -rf ./tmp-mongo-dump
  echo "${BLUE}Done.${RESET}"
else
  echo "${RED}mongorestore exited with non-zero status.${RESET}"
fi
