# Heroku App Innovation Workshop Prerequisites
## Required Online Accounts (mandatory)
  - Sign up for Heroku free account at https://signup.heroku.com
  - Create a free github account at https://github.com/join
  - If using windows laptop (not mac or linux) sign up for Cloud9IDE at https://aws.amazon.com/cloud9/
  - Create a free Salesforce Developer Account at https://developer.salesforce.com/signup

## Pre-work (not mandatory)
  - Complete the Salesforce trails which will get you started with the basics of deploying apps on Heroku at https://trailhead.salesforce.com/en/trails/heroku_enterprise


# App-Innovation-Workshop - Exercises
What will you be deploying? 
A simple NodeJS app with ExpressJS, add Heroku Postgres DB, Heroku Connect and integrate with Salesforce Org

# One slide overview of Heroku Architecture
```
https://goo.gl/c4T1A8
```

# 1 - Fork the Github Repository and Setup Dev Environment
- Signup for a Heroku account, or use your Corporate login
- Create a Cloud9 IDE Account (https://aws.amazon.com/cloud9/) - be sure you sign up for the free version. A credit card may be required as of 2016, but it will not be charged.
-- Create a new C9 workspace: Choose a name, Select "Private", and choose the "NodeJS" template 
- Find your salesforce Developer Edition org login (sign up for a new org (https://developer.salesforce.com/signup), or use an existing one)
- To ensure you don't update these files in the original github repo, fork the Github repo (https://github.com/heroku/app-innovation) to your github account (via github dashboard).
- On Cloud9 console clone the repo e.g. if you are cloning from heroku/app-innovation you will use the following command in the console at the bottom of the C9 Workspace.:
```
git clone https://github.com/heroku/app-innovation 
```
- Once the cloud9 repo is created, Run this command:
  ```
  sh setup.sh && . ~/.profile
  
  ```
- Upgrade the Heroku Toolbelt
  First, remove the directory ~/.local/share/heroku/:
  ```
  rm -rf ~/.local/share/heroku/
  ```
- Then download the latest heroku toolbelt 
  ```
  wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh
  ```

# 2 - Deploy to Heroku
From the command-line in Cloud9 run the following commands:
```
heroku login 
```
Note: if this command fails, be sure you upgraded the heroku toolbelt above
```
heroku create --app <appName> --team <teamName> 
```
Please replace "appName" with the app name you want and the team name with the assigned team
```
git push heroku master 
```
This pushes the code from the master branch of the github repo, up to your new heroku app


Open your Heroku app and you should see the app running

# 3 - Extending the App with Logging add-on
Extend the app with logging add-on
```
heroku addons:create papertrail
heroku addons:open papertrail
```

# 4 - Extending the App with Postgres DB
In this step you will add a free Heroku Postgres Starter Tier dev database to your app.
```
heroku addons:create heroku-postgresql:hobby-dev
```
Edit your package.json file to add the pg npm module to your dependencies:
```
"dependencies": {
    "pg": "6.x",
    "ejs": "2.5.6",
    "express": "4.15.2",
    "cool-ascii-faces": "1.3.4"
}

//Note: You can edit the code in VI in the command line, or just double click on the file on the left side of the c9.io IDE - easier right?
```

- Now edit your index.js file to use this module to connect to the database specified in your DATABASE_URL environment variable:
```
var pg = require('pg');
```
Copy paste the code below in the body of index.js
```
app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) { 
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});
```
If you get errors from the pg.connect line above, you can ignore them

- This ensures that when you access your app using the /db route, it will return all rows in the test_table table.

- Create a table and insert a record
```
1. heroku pg:psql

2. create table test_table (id integer, name text);

3. insert into test_table values (1, 'hello database');

4. \q
```

# 4b - Add Heroku Connect
Add a demo version of Heroku Connect (Bi-directional sync engine between Heroku Postgres and Salesforce (sales and service clouds). 
Note: This demo version of Heroku Connect keeps 10k rows in sync between salesforce and your app's PG database.
```
heroku addons:create herokuconnect:demo
```
Click on Heroku Connect in the dashboard and provision the connection to a Salesforce Developer Edition Org.
- Map a few objects and corresponding fields 
- Enable the streaming API for Sync from Salesforce to Heroku Postgres

## Bonus
Once the data is synced to database, modify the database code in the previous step to output the results from Salesforce
Create a new route in index.js, name it salesforce

# 5 - Monitoring: Exercise
## Offense
You are a hacker. You live in eastern hackistan. You have a contract with EvilCorp to take down a site that competes with them. Your mission is to take down WellCo!
The discovery phase of your attack has already been completed. A colleague of yours has identified several HTTP endpoints that seem to have weaknesses:

- `/messages`
- `/clocks`
- `/rockets`
- `/beverages`
- `/maps`
- `/pipes`
- `/bins`
- `/handles`
- `/children`

Your task is to pick one of these endpoints, and attack it with everything you have. Try to take down WellCo:

```
artillery quick --duration 60 --rate 10 -n 20 http://my.app.dev/api/resource
```

If and when the WellCo engineer can identify the endpoint you are attacking, they will block it, and your attack will be thwarted.
## Defense
You are a dev ops engineer at WellCo - a company that makes products that work well.
You are on call, supporting an app that has been deployed to production.
Unfortunately, this app has gained the reputation for being "the problem app". And now it's 23:30 on a Friday, and you get an SMS message.

The "problem app" is acting up again. You suspect the site may even be under denial-of-service attack.

But how do you identify the vulnerability? Use your knowledge of Logplex and NewRelic to decide which endpoint is being attacked!  Once you've determined that, try to form a hypothesis as to which resource is being used up by the endpoint by inspecting New Relic and Logplex.

## Turn About is Fair Play
After you have successfully attacked and defended an end-point, switch roles! WellCo should attack EvilCorp.
Pick a different endpoint, and work your way through until you can identify the signature of each attack, using Logplex and NewRelic.
Happy hacking!


## Exercise
- Run an `artillery` command
- Observe the `rps` (requests per second)
- Scale the app out  (more dynos)
- Re-run the `artillery` command
- Observe the `rps` (requests per second) is higher

Don't forget to scale down at the end of the day!


# 6 - Heroku CI/CD and Review Apps
## Setup the Pipeline
- Open the app
- Go to "Deploy"
- Click "New Pipeline..."
- Click "Create Pipeline"
- Click on the menu for the app and select "Move app to `staging`"

## Setup CI
- Click on "Tests"
- Click on "Connect to Github"
- Search for app-innovation
- Click "Connect"
- Click "Enable Heroku CI"
- Click the "Tests" tab
- Click "+ New Test"
- Click "Start Test Run"


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
- Select a file e.g. views/pages/index.ejs and make a simple change like "Welcome to the Heroku Workshop"
- Click "New Pull Request"
- Click "Create Pull Request"
- In Heroku you should see that a new Review App will be created

  > NOTE: Tests will _not_ run because for this demo you haven't created a new commit.  The tests would have been run when this branch was pushed in real life.

- Open the URL and make sure things look good
- Go to Github and merge the pull request
- The tests should pass and it should auto-deploy

And that's a real-life review-app -> CI -> CD scenario!
