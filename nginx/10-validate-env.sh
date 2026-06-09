#!/bin/sh
set -eu

required_vars="BACKEND_API_BASE_URL KAKAO_REST_API_KEY"

for var_name in $required_vars; do
  eval "var_value=\${$var_name:-}"

  if [ -z "$var_value" ]; then
    echo "[entrypoint] Missing required environment variable: $var_name" >&2
    exit 1
  fi
done
