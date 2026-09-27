#!/usr/bin/env bash
# =====================================================================
# TST-001 · Ejecuta el DDL y las pruebas en contenedores desechables.
# Uso:  bash run-tests.sh mysql|postgresql [engine|portable]
#   engine   (defecto): party-mysql.sql / party-postgresql.sql
#   portable          : party-portable.sql en el motor indicado
# Requiere Docker. Los contenedores se crean con --rm y se detienen al final.
# Salida: una línea "<test> PASS|FAIL" por aserción y los errores esperados.
# =====================================================================
set -u
ENGINE="${1:?mysql|postgresql}"
VARIANT="${2:-engine}"
HERE="$(cd "$(dirname "$0")" && pwd)"
DDL_DIR="$HERE/../ddl"
NAME="dm-tst001-$ENGINE-$$"
TESTS="00-fixtures.sql t01-un-nivel-vigente-por-rol.sql t02-identificacion-unica.sql t03-codigo-colaborador-unico.sql t04-correo-laboral-unico-vigente.sql t05-anonimizacion.sql"

cleanup() { docker stop "$NAME" >/dev/null 2>&1 || true; }
trap cleanup EXIT

timeout 20 docker info >/dev/null 2>&1 || { echo "PENDIENTE: el daemon de Docker no responde (Docker Desktop detenido; D28)"; exit 2; }

if [ "$ENGINE" = mysql ]; then
  DDL="$DDL_DIR/party-mysql.sql"; [ "$VARIANT" = portable ] && DDL="$DDL_DIR/party-portable.sql"
  timeout 300 docker run -d --rm --name "$NAME" -e MYSQL_ROOT_PASSWORD=test -e MYSQL_DATABASE=party mysql:8.0 >/dev/null || exit 3
  # el servidor definitivo (no el temporal de inicialización) anuncia "port: 3306"
  for i in $(seq 1 45); do docker logs "$NAME" 2>&1 | grep -q "ready for connections.*port: 3306" && break; sleep 2; done
  RUN_STRICT="docker exec -i $NAME mysql -uroot -ptest --default-character-set=utf8mb4 party"
  RUN_LAX="docker exec -i $NAME mysql -uroot -ptest --default-character-set=utf8mb4 --force -N party"
  T06="t06-aviso-plazo.mysql.sql"
else
  DDL="$DDL_DIR/party-postgresql.sql"; [ "$VARIANT" = portable ] && DDL="$DDL_DIR/party-portable.sql"
  # D30: versión estable más reciente de PostgreSQL (etiqueta "latest", no fija).
  # La versión real se imprime abajo y debe registrarse en TST-001 al ejecutar.
  timeout 300 docker run -d --rm --pull always --name "$NAME" -e POSTGRES_PASSWORD=test -e POSTGRES_DB=party postgres:latest >/dev/null || exit 3
  # por TCP: el servidor temporal de inicialización solo escucha en el socket
  for i in $(seq 1 30); do docker exec "$NAME" pg_isready -h 127.0.0.1 -U postgres >/dev/null 2>&1 && break; sleep 2; done
  echo "== Versión: $(docker exec "$NAME" psql -X -t -A -U postgres -d party -c 'SHOW server_version;' 2>/dev/null)"
  RUN_STRICT="docker exec -i $NAME psql -X -q -v ON_ERROR_STOP=1 -U postgres -d party"
  RUN_LAX="docker exec -i $NAME psql -X -q -t -A -F ' ' -v ON_ERROR_STOP=0 -U postgres -d party"
  T06="t06-aviso-plazo.postgresql.sql"
fi

echo "== DDL: $(basename "$DDL") en $ENGINE"
$RUN_STRICT < "$DDL" || { echo "DDL FAIL"; exit 1; }
echo "DDL OK"
for t in $TESTS $T06; do
  echo "== $t"
  $RUN_LAX < "$HERE/$t" 2>&1 | grep -E "PASS|FAIL|ERROR"
done
