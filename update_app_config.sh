# #!/bin/bash
# set -x
# # Đường dẫn đến thư mục chứa các file JavaScript build
# build_dir="dist"

# # Đường dẫn đến file config.json
# config_file="app-config.json"

# # Tìm tên file JavaScript sau khi build trong thư mục build
# js_file=$(find "$build_dir" -name "*.js" | head -n 1)

# # Tìm tên file CSS sau khi build trong thư mục build
# css_file=$(find "$build_dir" -name "*.css" | head -n 1)

# # Nếu tìm thấy file JavaScript và CSS
# if [ -n "$js_file" ] && [ -n "$css_file" ]; then
#     # Thay đổi tên file JavaScript trong config.json
#     new_config_content=$(sed "s/\"listSyncJS\": \[\"assets\/.*.js\"\]/\"listSyncJS\": \[\"assets\/$(basename "$js_file")\"\]/g" "$config_file")
#     #echo new_config_content
#     echo "$new_config_content"
#     # Thay đổi tên file CSS trong config.json
#     new_config_content=$(echo "$new_config_content" | sed "s/\"listCSS\": \[\"assets\/.*.css\"\]/\"listCSS\": \[\"assets\/$(basename "$css_file")\"\]/g")
#     echo "$new_config_content" > "$config_file.new"  # Write to a new file
#     mv "$config_file.new" "$config_file" # Replace the old file with the new file

#     echo "SyncJS file name replaced successfully. New file names: $(basename "$js_file"), $(basename "$css_file")"
# else
#     echo "Error: No JavaScript or CSS file found in $build_dir."
# fi

#!/bin/bash
set -x
# Đường dẫn đến thư mục chứa các file JavaScript build
build_dir="dist"

# Đường dẫn đến file config.json
config_file="app-config.json"

# Tìm tên file JavaScript sau khi build trong thư mục build
js_file=$(find "$build_dir" -name "index*.js" | head -n 1)

# Tìm tên file CSS sau khi build trong thư mục build
css_file=$(find "$build_dir" -name "*.css" | head -n 1)

# Nếu tìm thấy file JavaScript và CSS
if [ -n "$js_file" ] && [ -n "$css_file" ]; then
    # Thay đổi tên file JavaScript trong config.json
    new_config_content=$(sed "s/\"listSyncJS\": \[\"assets\/.*.js\"\]/\"listSyncJS\": \[\"assets\/$(basename "$js_file")\"\]/g" "$config_file")
    #echo new_config_content
    echo "$new_config_content"
    # Thay đổi tên file CSS trong config.json
    new_config_content=$(echo "$new_config_content" | sed "s/\"listCSS\": \[\"assets\/.*.css\"\]/\"listCSS\": \[\"assets\/$(basename "$css_file")\"\]/g")
    echo "$new_config_content" > "$config_file.new"  # Write to a new file
    mv "$config_file.new" "$config_file" # Replace the old file with the new file

    echo "SyncJS file name replaced successfully. New file names: $(basename "$js_file"), $(basename "$css_file")"
else
    echo "Error: No JavaScript or CSS file found in $build_dir."
fi
