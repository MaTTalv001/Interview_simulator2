# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
# 既存のAvatarレコードをクリア
Avatar.destroy_all
# アバター画像のパスを生成
avatar_paths = (1..6).map { |i| "/avatars/avatar_#{i.to_s.rjust(3, '0')}.jpg" }

# アバターレコードを作成
avatar_paths.each do |path|
  Avatar.create!(avatar_url: path)
end
puts "Created #{Avatar.count} avatars"