echo "Enter Username"
read username

echo "Enter Password"
stty -echo
read password

stty echo
env="ext"
choiceEnv=$env
# FOLLOWING COMMENTED OUT SINCE THERE IS ONLY 1 ENVIRONMENT VALID - dev

# choiceEnv=""
# isValidEnv=0
# while [ $isValidEnv -eq 0 ]
# do
# echo "Enter environment ($env) - Choices [dev, local]"
# read choiceEnv
# if test -z "$choiceEnv"
# then
#   choiceEnv=$env
# fi
# isValidEnv=$(echo $choiceEnv | perl -0777 -e 'if(<> =~ m/^(dev|local)$/){print 1}else{print 0}')
# done

if [ "$1" = "gui" ]; then
  CYPRESS_password=$password CYPRESS_username=$username yarn run cy:open --env configFile=$choiceEnv
else
  if [ "$1" = "headed" ]; then
    CYPRESS_password=$password CYPRESS_username=$username yarn run cy:headed --env configFile=$choiceEnv
  else
    if [ "$1" = "headless" ]; then
      CYPRESS_password=$password CYPRESS_username=$username yarn run cy:headless --env configFile=$choiceEnv
    fi
  fi
fi