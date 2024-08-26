class AddCascadeDeleteToUsersComments < ActiveRecord::Migration[7.1]
  def up
    remove_foreign_key :users_comments, :comments

    add_foreign_key :users_comments, :comments, on_delete: :cascade
  end

  def down
    remove_foreign_key :users_comments, :comments

    add_foreign_key :users_comments, :comments
  end
end
