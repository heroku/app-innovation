# Heroku App Innovation Workshop

# Adding Heroku Button for Simple Deploy
<a href="https://heroku.com/deploy">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

A login form using hapi-auth-register, hapi-auth-login &amp; hapi-auth-jwt2 with a PostgreSQL DB

## What?
This repo is a *showcase* for how to build a login flow using Hapi.js.  
We use the following plugins:
+ [**hapi-register**](https://github.com/dwyl/hapi-register)
+ [**hapi-login**](https://github.com/dwyl/hapi-login)
+ [**hapi-postgres-connection**](https://github.com/dwyl/hapi-postgres-connection)
+ [**hapi-auth-jwt2**](https://github.com/dwyl/hapi-auth-jwt2)

# App-Innovation-Workshop - Exercises

# 1 - Setup on Cloud9
- Create a Cloud9 Account
- Fork the Github repo (https://github.com/heroku/app-innovation) to your github account.
- On Cloud9 console clone the repo e.g. if you are cloning from heroku/app-innovation-workshop you will use the following command:
```
git clone https://github.com/heroku/app-innovation
```
- Once the cloud9 repo is created, Run this command:
  ```
  sh setup.sh && . ~/.profile
  ```

  
# 2 - Deploy to Heroku and fix the error
From the command-line in Cloud9 run the following commands:
```
heroku login
heroku apps:create
git push heroku master
```
Open your Heroku app is it running? 
Check the logs and identify what it needs.
Add the required dependency.

# 3 - Heroku CI/CD and Review Apps
## Setup the Pipeline
- Open the app
- Go to "Deploy"
- Click "New Pipeline..."
- Click "Create Pipeline"
- Click on the menu for the app and select "Move app to `staging`"

## Setup CI
- Click on "Tests"
- Click on "Connect to Github"
- Search for heroku-workshop
- Click "Connect"
- Click "Enable Heroku CI"
- Click the "Tests" tab
- Click "+ New Test"
- Click "Start Test Run"
You should see the test pass.

## Continuous Deployment
- Click on the app menu for the staging app
- Click "Configure Automatic Deploys"
- Check "Wait for CI to pass before deploy"
- Click "Enable Automatic Deploys"

## Review Apps
- Click "Enable Review Apps..."
- Check "Create New..." and check "Destroy stale..."
- Click "Enable"

## View a Review App in Action
- In Github go to your "Code" tab of your repo
- Change ACME Co to the name of your team e.g. Team #2
- Check the option under Commit changes: "Create a new branch for this commit and start a pull request"
- In Heroku you should see that a new Review App will be created
- Launch the new app and verify the changes are in place
- In Github go ahead and merge the pull request and close it.
- In Heroku Pipeline dashboard verify that the Review App is automatically destroyed and the changes are pushed to the Staging branch
- Open the app in the staging branch and verify that the App displays your team # instead of Acme Co.

And that's a real-life review-app -> CI -> CD scenario!
