# 全てのテーブルをクリア（注意: 本番環境では絶対に使用しないこと）
UserAuthentication.destroy_all
User.destroy_all
Avatar.destroy_all
Experience.destroy_all

# アバターのシード
avatar_data = [
  { id: 1, avatar_url: "/avatars/avatar_001.jpg" },
  { id: 2, avatar_url: "/avatars/avatar_002.jpg" },
  { id: 3, avatar_url: "/avatars/avatar_003.jpg" },
  { id: 4, avatar_url: "/avatars/avatar_004.jpg" },
  { id: 5, avatar_url: "/avatars/avatar_005.jpg" },
  { id: 6, avatar_url: "/avatars/avatar_006.jpg" }
]

avatar_data.each do |data|
  Avatar.create!(id: data[:id], avatar_url: data[:avatar_url])
end

puts "Created #{Avatar.count} avatars"

# 経験レベルのシード
experience_data = [
  { id: 1, experience: "完全未経験" },
  { id: 2, experience: "IT部門経験（プログラミングなし）" },
  { id: 3, experience: "プログラミング経験(アプリ開発なし)" },
  { id: 4, experience: "WEBエンジニア1年以内" },
  { id: 5, experience: "WEBエンジニア2年以上" }
]

experience_data.each do |data|
  Experience.create!(id: data[:id], experience: data[:experience])
end

puts "Created #{Experience.count} experiences"

# IDシーケンスをリセット
ActiveRecord::Base.connection.execute("ALTER TABLE avatars AUTO_INCREMENT = 7;")
ActiveRecord::Base.connection.execute("ALTER TABLE experiences AUTO_INCREMENT = 6;")