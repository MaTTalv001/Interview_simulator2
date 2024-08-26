class AddExperienceCategoryStyleToComments < ActiveRecord::Migration[7.1]
  def change
    add_column :comments, :experience, :string
    add_column :comments, :category, :string
    add_column :comments, :style, :string
  end
end
