#!/bin/sh

echo ""
project_name="gmail-tadpoles-parser"

#
# Create Project if it does not exist
#
echo "Checking to see if a project exists"
existing_project_id=$(gcloud projects list \
    --filter="name ~ ^${project_name}" \
    --format="value(name)" \
    --limit=1)

if [ -z "$existing_project_id" ]
then
    echo "Project does not exist, generating project id"
    random=$(hexdump -n 4 -e '4/4 "%08x" 1 "\n"' /dev/random)
    project_id="${project_name}-${random}"

    echo "Creating Google Project '$project_id'"
    gcloud projects create ${project_id}

    export TF_VAR_project_id="${project_id}"

    echo "\xE2\x9C\x94 Project ${project_id} Created.\n"
else
    export TF_VAR_project_id="${existing_project_id}"
    echo "\xE2\x9C\x94 Project ${existing_project_id} exists.\n"
    project_id="${existing_project_id}"
fi

echo "Getting the Billing Id"
billing_id=$(gcloud beta billing accounts list --format="value(name)" --limit=1)
echo "Setting Project Billing"
gcloud beta billing projects link ${project_id} \
  --billing-account ${billing_id}
echo "\xE2\x9C\x94 Billing Updated.\n"

#
# Enable PubSub API in project
#
echo "# Enabling googleapis required by terraform"
gcloud services enable compute.googleapis.com --project=${project_id}
echo "\xE2\x9C\x94 Services Enabled for ${existing_project_id}.\n"