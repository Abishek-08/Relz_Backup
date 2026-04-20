# variable "argocd_namespace" {
#     type = string
#     default = "argocd"
# }

# # variable "mongodb_namespace" {
# #     type = string
# #     default = "mongodb"
# # }

# resource "kubernetes_namespace_v1" "argocd" {
#   metadata{
#     name = var.argocd_namespace
#   }
# }

# # resource "kubernetes_namespace_v1" "mongodb" {
# #   metadata {
# #     name = var.mongodb_namespace
# #   }
# # }

# output "argocd_namespace" {
#   value = kubernetes_namespace_v1.argocd.metadata[0].name
# }

# # output "mongodb_namespace" {
# #   value = kubernetes_namespace_v1.mongodb.metadata[0].name
# # }