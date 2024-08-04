class AddAvatarIdToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :avatar_id, :bigint, null: true unless column_exists?(:users, :avatar_id)
    add_foreign_key :users, :avatars
    add_index :users, :avatar_id unless index_exists?(:users, :avatar_id)
  end
end