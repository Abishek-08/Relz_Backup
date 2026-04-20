variable "namespace" {
  type = string
}

resource "helm_release" "argocd" {
  name = "argocd"
  namespace = var.namespace
  create_namespace = true

  repository = "https://argoproj.github.io/argo-helm"
  chart = "argo-cd"
  version = "5.51.6"
}