echo "\n-----------------------------"
echo "Updating Node..."
echo "-----------------------------\n"

. ~/.profile
nvm install stable
nvm current

echo "\n-----------------------------"
echo "Updating Heroku CLI..."
echo "-----------------------------\n"

npm install -g heroku-cli

echo "\n-----------------------------"
echo "Setting up Artillary..."
echo "-----------------------------\n"

npm install -g artillery
artillery dino
