provider "kubernetes"{
    config_path = "/home/abishekkumar/.kube/config"
    config_context = "minikube"
}

provider "helm"{
    kubernetes = {
      config_path = "/home/abishekkumar/.kube/config"
      config_context = "minikube"
    }
}

# provider "kubernetes" {
#   host                   = "https://127.0.0.1:63101"
#   client_certificate     = file("C:/Users/nagarjun.suresh/.minikube/profiles/minikube/client.crt")
#   client_key             = file("C:/Users/nagarjun.suresh/.minikube/profiles/minikube/client.key")
#   cluster_ca_certificate = file("C:/Users/nagarjun.suresh/.minikube/ca.crt")
# }

# provider "helm" {
#   kubernetes {
#     host                   = "https://127.0.0.1:63101"
#     client_certificate     = file("C:/Users/nagarjun.suresh/.minikube/profiles/minikube/client.crt")
#     client_key             = file("C:/Users/nagarjun.suresh/.minikube/profiles/minikube/client.key")
#     cluster_ca_certificate = file("C:/Users/nagarjun.suresh/.minikube/ca.crt")
#   }
# }
