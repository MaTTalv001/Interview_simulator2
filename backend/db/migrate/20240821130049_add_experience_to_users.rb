class AddExperienceToUsers < ActiveRecord::Migration[7.1]
  def change
    add_reference :users, :experience, null: true, foreign_key: true
  end
end
