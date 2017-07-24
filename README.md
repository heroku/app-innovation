# Heroku App Innovation Workshop
What will you be deploying? 
A login form using hapi-auth-register, hapi-auth-login &amp; hapi-auth-jwt2 with a PostgreSQL DB

See the application running at: https://appinnov11.herokuapp.com/login

# Adding Heroku Button for Simple Deploy
<a href="https://heroku.com/deploy">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>


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

  
# 2 - Deploy the App to Heroku
From the command-line in Cloud9 run the following commands:
```
heroku login
heroku apps:create
git push heroku master
```
Open your Heroku app is it running? 

# 2a - Extend the App by adding Papertrail add-on
Either from the Heroku Dashboard or command-line add either Papertrail or Logentries. 
```
e.g. heroku addons:create papertrail
heroku addons:open papertrail
```
- Analyze the logs and see if you can figure out why the application is crashing

# 2b - Extend the App by adding Heroku Postres DB
In Heroku dashboard under the resource tab, search for Postgres in the add-on search box
- Select Postgres Hobby Dev plan and provision it to your app.
- Open the logs and verify that the database was added.
- Verify if the application is still crashing or working?


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

# Excercise 4 - Add Heroku Connect and Sync Data from Salesforce Org
- From dashboard or command-line add Heroku Connect as an add-on
- Click on Heroku Connect add-on and set up OAuth with the Salesforce DEV Org you signed up (pre-requisite step)
    Note that for developer Org select Production Org as Org type
    If you have access to your company’s sandbox Org you can also set up Heroku Connect with the Sandbox Org
- Once the authorization is successful, click on ‘map objects’ and select a few objects e.g. account, contacts and opportunity to SYNC.
- Setting up Sync 
    You can either select polling (2 minutes to 60 minutes) or streaming API. For this exercise we recommend using Streaming API to highlight near realtime sync from SF to Heroku Postgres
- Select a few fields under the objects to Sync, e.g. for the account object you can select name, city, state, etc.
- Once the data sync is done, click on the logs tab analyze the logs and see if there were any errors. 
- Click on the explore tab and review the synced data (PG & SF).

# Excercise 5 - User Heroku Postgres DataClips and/or update your app to display synced data from DB
- Once the data from the Salesforce Org is synced into Heroku database, you can query this data and show it in your app. You can do it either via Heroku Postgres Dataclips and/or using code to query the data and show it in a simple HTML5 page.
- Reference this https://devcenter.heroku.com/articles/dataclips for creating dataclips

