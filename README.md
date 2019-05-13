# Google Mail Parser
Parse specifc emails when they come into gmail.

Extract the images from these emails, and store them in google drive.

## Required Tools
 * Terraform
 * NodeJS 

## Getting Started
### Generating OAuth Credentials
In order to make use of this gmail parser, you will first need 
to setup oauth credentials with google apis. This can be done in
the google cloud console ([here](https://developers.google.com/identity/protocols/OAuth2?hl=en_US#basicsteps)).

Basically, you will need to generate OAuth credentials for your 
account (developer account), and then download the json file.
Once you have the oauth credentials json, update the ```.env```
file's variable ```GOOGLE_CREDENTIALS_PATH``` to the location of
this new ```credentials.json``` file.

### OAuth token
After you have the OAuth credentials, you'll be able to run this
console program. 

```
npm run generate:token
``` 

Running this command will print out an URL that you must navigate
to. After opening this window, you will authorize the 
"Application" that represents the ```credentials.json``` generated
previously. This will then download a ```token.json``` file.
After generating the token, you can then run the ```npm start```
part of this CLI. 


### Setting up Infrastructure
 * Setup Service User - [Tutorial](https://cloud.google.com/community/tutorials/managing-gcp-projects-with-terraform)
 * Download the GCP user credentials.
 * Set the [ENV Variable](https://www.terraform.io/docs/providers/google/provider_reference.html) for the credentials JSON of the terraform service user

   ```sh
   export GOOGLE_APPLICATION_CREDENTIALS="/Users/${USER}/.gcp/${USER}-terraform-admin.json"
   ```

### Bootstrap Project Creation
This project assumes that you're running GCP w/o an organization, so I've choosen to use bash + gcloud cli to generate the project and enable the services. Run the included bash script to create and setup the GCP project.

```bash
./infrastructure/bootstrap.sh
```

After executing the bootstrap script, you will need to then set the project_id in terraform.tfvars (or via environment variable).

```terraform
project_id=<project-id>
```

OR

```bash
export TF_VAR_project_id=<project-id>
```

### Running the project locally
TODO