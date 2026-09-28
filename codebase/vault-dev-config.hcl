#!/usr/bin/env hcl
# =====================================================================
# Vault Configuration for Development
# =====================================================================
# This configuration is for LOCAL DEVELOPMENT ONLY.
# For production, use proper security measures:
# - Disable dev mode
# - Configure TLS
# - Use proper auth methods (AppRole, JWT, etc.)
# - Enable audit logging
# - Set up HA backend
# =====================================================================

# Storage backend: file-based (dev only)
storage "file" {
  path = "/vault/data"
}

# Listener configuration
listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_disable   = 1  # Disable TLS for dev (use HTTP only)
}

# Enable the API
api_addr = "http://vault:8200"

# Telemetry (optional)
telemetry {
  prometheus_retention_time = "30s"
  disable_hostname = true
}

# =====================================================================
# Development Mode Settings
# =====================================================================
# Run in dev mode: automatically unsealed, root token printed to logs
ui = true
