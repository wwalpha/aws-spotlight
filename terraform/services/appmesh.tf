# ----------------------------------------------------------------------------------------------
# App Mesh
# ----------------------------------------------------------------------------------------------
resource "aws_appmesh_mesh" "this" {
  name = "arms_mesh"

  spec {
    egress_filter {
      type = "DROP_ALL"
    }
  }
}

# ----------------------------------------------------------------------------------------------
# App Mesh - Auth Virtual Node
# ----------------------------------------------------------------------------------------------
resource "aws_appmesh_virtual_node" "auth" {
  name      = "auth_node"
  mesh_name = aws_appmesh_mesh.this.id

  spec {
    listener {
      port_mapping {
        port     = 8080
        protocol = "http"
      }
    }

    service_discovery {
      aws_cloud_map {
        service_name   = aws_service_discovery_service.auth.name
        namespace_name = aws_service_discovery_private_dns_namespace.this.name
      }
    }
  }
}

# ----------------------------------------------------------------------------------------------
# App Mesh - Token Virtual Node
# ----------------------------------------------------------------------------------------------
resource "aws_appmesh_virtual_node" "token" {
  name      = "token_node"
  mesh_name = aws_appmesh_mesh.this.id

  spec {
    listener {
      port_mapping {
        port     = 8080
        protocol = "http"
      }
    }

    service_discovery {
      aws_cloud_map {
        service_name   = aws_service_discovery_service.token.name
        namespace_name = aws_service_discovery_private_dns_namespace.this.name
      }
    }
  }
}

# ----------------------------------------------------------------------------------------------
# App Mesh - Resource Virtual Node
# ----------------------------------------------------------------------------------------------
resource "aws_appmesh_virtual_node" "resource" {
  name      = "resource_node"
  mesh_name = aws_appmesh_mesh.this.id

  spec {
    listener {
      port_mapping {
        port     = 8080
        protocol = "http"
      }
    }

    service_discovery {
      aws_cloud_map {
        service_name   = aws_service_discovery_service.resource.name
        namespace_name = aws_service_discovery_private_dns_namespace.this.name
      }
    }
  }
}

# ----------------------------------------------------------------------------------------------
# App Mesh - User Virtual Node
# ----------------------------------------------------------------------------------------------
resource "aws_appmesh_virtual_node" "user" {
  name      = "user_node"
  mesh_name = aws_appmesh_mesh.this.id

  spec {
    listener {
      port_mapping {
        port     = 8080
        protocol = "http"
      }
    }

    service_discovery {
      aws_cloud_map {
        service_name   = aws_service_discovery_service.user.name
        namespace_name = aws_service_discovery_private_dns_namespace.this.name
      }
    }
  }
}

# ----------------------------------------------------------------------------------------------
# App Mesh - Auth Virtual Service
# ----------------------------------------------------------------------------------------------
resource "aws_appmesh_virtual_service" "auth" {
  name      = "${aws_service_discovery_service.auth.name}.${aws_service_discovery_private_dns_namespace.this.name}"
  mesh_name = aws_appmesh_mesh.this.id

  spec {
    provider {
      virtual_node {
        virtual_node_name = aws_appmesh_virtual_node.auth.name
      }
    }
  }
}

# ----------------------------------------------------------------------------------------------
# App Mesh - User Virtual Service
# ----------------------------------------------------------------------------------------------
resource "aws_appmesh_virtual_service" "user" {
  name      = "${aws_service_discovery_service.user.name}.${aws_service_discovery_private_dns_namespace.this.name}"
  mesh_name = aws_appmesh_mesh.this.id

  spec {
    provider {
      virtual_node {
        virtual_node_name = aws_appmesh_virtual_node.user.name
      }
    }
  }
}


# # ----------------------------------------------------------------------------------------------
# # App Mesh - Resource Virtual Node
# # ----------------------------------------------------------------------------------------------
# resource "aws_appmesh_virtual_node" "resource" {
#   name      = "resource_node"
#   mesh_name = aws_appmesh_mesh.this.id

#   spec {
#     backend {
#       virtual_service {
#         virtual_service_name = aws_appmesh_virtual_service.reso.name
#       }
#     }

#     backend {
#       virtual_service {
#         virtual_service_name = aws_appmesh_virtual_service.worker.name
#       }
#     }

#     listener {
#       port_mapping {
#         port     = 8080
#         protocol = "http"
#       }
#     }

#     service_discovery {
#       aws_cloud_map {
#         service_name   = aws_service_discovery_service.backend_api.name
#         namespace_name = aws_service_discovery_private_dns_namespace.microservice.name
#       }
#     }
#   }
# }
