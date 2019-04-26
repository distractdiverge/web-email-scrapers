# Google Mail Parser
Parse specifc emails when they come into gmail.

Extract the images from these emails, and store them in google drive.

## Required Tools
 * Terraform
 * NodeJS 

## Getting Started
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