provider "docker" {}

# environment
variable "env" {
  default = "local"
}
# postgres
variable "postgres_host" {
  default = "postgres"
}
variable "postgres_port" {
  default = "5432"
}
variable "postgres_user" {
  default = "postgres"
}
variable "postgres_password" {
  default = "GwWrrzx]CFh2#<?9"
}
variable "postgres_database" {
  default = "db"
}
# pgbouncer
variable "pgbouncer_host" {
  default = "pgbouncer"
}
variable "pgbouncer_port" {
  default = "5433"
}
# nginx
variable "nginx_host" {
  default = "nginx"
}
variable "nginx_http_port" {
  default = "80"
}
variable "nginx_https_port" {
  default = "443"
}
# api
variable "api_port" {
  default = "3000"
}
variable "api_version" {
  default = "0.0.1"
}
variable "api_url" {
  default = "http://nginx"
}
variable "api_num_instances" {
  default = 2
}
# ui
variable "ui_port" {
  default = "4000"
}
variable "ui_version" {
  default = "0.0.1"
}
variable "ui_num_instances" {
  default = 2
}

# network
resource "docker_network" "private_network" {
  name = "brainpower"
}

# postgres
resource "docker_container" "postgres" {
  name  = "postgres"
  hostname = var.postgres_host
  image = "postgres:alpine"
  restart = "always"

  env = [
    "POSTGRES_USER=${var.postgres_user}",
    "POSTGRES_PASSWORD=${var.postgres_password}",
    "POSTGRES_DB=${var.postgres_database}"
  ]

  volumes {
    host_path = abspath("../postgres")
    container_path = "/var/lib/postgresql/data"
  }

  ports {
    internal = "5432"
    external = var.postgres_port
    ip = "127.0.0.1"
  }

  networks_advanced {
    name = docker_network.private_network.name
    aliases = ["postgres"]
  }
}

# pgbouncer
resource "docker_container" "pgbouncer" {
  name  = "pgbouncer"
  hostname = var.pgbouncer_host
  image = "edoburu/pgbouncer:latest"
  restart = "always"

  env = [
    "LISTEN_ADDR=${var.pgbouncer_host}",
    "LISTEN_PORT=${var.pgbouncer_port}",
    "DB_USER=${var.postgres_user}",
    "DB_PASSWORD=${var.postgres_password}",
    "DB_HOST=${var.postgres_host}",
    "DB_NAME=${var.postgres_database}"
  ]

  ports {
    internal = var.pgbouncer_port
    external = var.pgbouncer_port
    ip = "127.0.0.1"
  }

  networks_advanced {
    name = docker_network.private_network.name
    aliases = ["pgbouncer"]
  }

  depends_on = [
    docker_container.postgres,
  ]
}

# api
resource "docker_container" "api" {
  count = var.env == "local" ? 1 : var.api_num_instances

  name  = "api-${count.index}"
  hostname = "api-${count.index}"
  image = "api:${var.api_version}"
  restart = "always"

  env = [
    "PGBOUNCER_HOST=${var.pgbouncer_host}",
    "PGBOUNCER_PORT=${var.pgbouncer_port}",
    "POSTGRES_USER=${var.postgres_user}",
    "POSTGRES_PASSWORD=${var.postgres_password}",
    "POSTGRES_DB=${var.postgres_database}",
    "PORT=${parseint("${var.api_port}", 10) + count.index}",
  ]

  ports {
    internal = parseint("${var.api_port}", 10) + count.index
    external = parseint("${var.api_port}", 10) + count.index
    ip = "127.0.0.1"
  }

  networks_advanced {
    name = docker_network.private_network.name
    aliases = ["api-${count.index}"]
  }

  depends_on = [
    docker_container.pgbouncer,
  ]
}

# ui
resource "docker_container" "ui" {
  count = var.env == "local" ? 1 : var.ui_num_instances

  name  = "ui-${count.index}"
  hostname = "ui-${count.index}"
  image = "ui:${var.ui_version}"
  restart = "always"

  env = [
    "API_URL=${var.api_url}",
    "PORT=${parseint("${var.ui_port}", 10) + count.index}",
  ]

  ports {
    internal = parseint("${var.ui_port}", 10) + count.index
    external = parseint("${var.ui_port}", 10) + count.index
    ip = "127.0.0.1"
  }

  networks_advanced {
    name = docker_network.private_network.name
    aliases = ["ui-${count.index}"]
  }
}

# nginx
resource "docker_container" "nginx" {
  name  = "nginx"
  hostname = var.nginx_host
  image = "nginx:alpine"
  restart = "always"

  volumes {
    host_path = abspath("../nginx/nginx-${var.env}.conf")
    container_path = "/etc/nginx/nginx.conf"
  }

  ports {
    internal = var.nginx_http_port
    external = var.nginx_http_port
    ip = "0.0.0.0"
  }

  ports {
    internal = var.nginx_https_port
    external = var.nginx_https_port
    ip = "0.0.0.0"
  }

  networks_advanced {
    name = docker_network.private_network.name
    aliases = ["nginx"]
  }

  depends_on = [
    docker_container.api,
    docker_container.ui,
  ]
}
