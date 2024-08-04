class ChangeAvatarIdTypeInUsers < ActiveRecord::Migration[6.1]
  def change
    change_column :users, :avatar_id, :bigint
  end
end