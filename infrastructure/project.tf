provider "google" {
    credentials = "${file("CREDENTIALS_FILE.json")}"
    project = "gmail-parser-238501"
    region = "us-east4"
}