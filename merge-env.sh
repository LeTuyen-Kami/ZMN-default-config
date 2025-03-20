#!/bin/bash

# Định nghĩa file nguồn và đích
ENV_SOURCE=".env"
TARGET_ENV=${1:-"production"}
ENV_TARGET=".env.$TARGET_ENV"

# Kiểm tra file nguồn có tồn tại không
if [ ! -f "$ENV_SOURCE" ]; then
  echo "⚠️ File .env không tồn tại!"
  exit 1
fi

# Loại bỏ dòng trống và comment khi đọc file gốc
grep -vE '^\s*#|^\s*$' "$ENV_SOURCE" > /tmp/env_source.tmp

# Nếu file đích tồn tại, loại bỏ dòng trống và comment, rồi đọc nội dung
if [ -f "$ENV_TARGET" ]; then
  grep -vE '^\s*#|^\s*$' "$ENV_TARGET" > /tmp/env_target.tmp
else
  touch /tmp/env_target.tmp
fi

# Gộp nội dung từ file gốc vào đầu file đích (loại bỏ trùng key, giữ giá trị từ .env)
awk -F '=' '!seen[$1]++' /tmp/env_source.tmp /tmp/env_target.tmp > "$ENV_TARGET"

# Dọn dẹp file tạm
rm -f /tmp/env_source.tmp /tmp/env_target.tmp

echo "✅ Đã merge $ENV_SOURCE vào $ENV_TARGET"