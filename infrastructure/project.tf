provider "google" {
    project = "gmail-parser-238501"
    region = "us-east4"
}

resource "random_id" "instance_id" {
    byte_length = 8
}

resource "google_compute_instance" "default" {
    name = "test-vm-${random_id.instance_id.hex}"
    machine_type = "f1-micro"
    zone = "us-east4-a"

    boot_disk {
        initialize_params {
            image = "debian-cloud/debian-9"
        }
    }

    metadata_startup_script = "sudo apt-get update"

    network_interface {
        network = "default"

        access_config {

        }
    }
}

resource "google_pubsub_topic" "example" {
  name = "example-topic"

  labels = {
    foo = "bar"
  }
}