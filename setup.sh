echo "\n-----------------------------"
echo "Updating Node..."
echo "-----------------------------\n"

. ~/.profile
nvm install 7
nvm alias default 7

echo "\n-----------------------------"
echo "Updating Heroku CLI..."
echo "-----------------------------\n"

heroku update

echo "\n-----------------------------"
echo "Setting up Yarn..."
echo "-----------------------------\n"

npm install -g yarn
yarn
