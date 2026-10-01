#!/bin/sh
# Genera el manifiesto de Native Federation con el origen público del entorno.
# Así la misma imagen sirve en local, QA y PROD sin recompilar.
set -eu
ORIGIN="${PORTAL_PUBLIC_ORIGIN:-http://localhost:4200}"
cat > /usr/share/nginx/html/federation.manifest.json <<JSON
{
  "mfe-catalog": "${ORIGIN}/mfe/catalog/remoteEntry.json",
  "mfe-collaborators": "${ORIGIN}/mfe/collaborators/remoteEntry.json"
}
JSON
echo "federation.manifest.json → ${ORIGIN}/mfe/*"
