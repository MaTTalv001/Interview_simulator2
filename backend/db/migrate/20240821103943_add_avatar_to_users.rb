class AddAvatarToUsers < ActiveRecord::Migration[7.1]
  def change
    add_reference :users, :avatar, foreign_key: true, null: true
  end
end
