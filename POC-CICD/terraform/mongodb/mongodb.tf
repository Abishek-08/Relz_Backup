variable "namespace" {
  type = string
}

resource "helm_release" "mongodb"{
    name = "mongodb"
    namespace = var.namespace
    create_namespace = true

    repository = "https://charts.bitnami.com/bitnami"
    chart = "mongodb"
    version = "15.6.15"

    values = [ <<EOF
    auth:
      enabled: false
    EOF
    ]
}