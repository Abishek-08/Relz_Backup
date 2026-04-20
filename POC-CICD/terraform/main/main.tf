terraform {
  required_version = ">= 1.5.0"
}

# module "namespaces"{
#     source = "../namespaces"

#     argocd_namespace = "argocd"
#     # mongodb_namespace = "mongodb"
# }

module "argocd"{
    source = "../argocd"
    # namespace = module.namespaces.argocd_namespace
    # depends_on = [ module.namespaces ]
    namespace = "argocd"

}

module "mongodb"{
    source = "../mongodb"
    # namespace = module.namespaces.mongodb_namespace
    # depends_on = [ module.namespaces ]
    namespace = "argocd"
}