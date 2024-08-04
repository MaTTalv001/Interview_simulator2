class CreateAvatars < ActiveRecord::Migration[6.1]
  def change
    create_table :avatars do |t|
      t.string :avatar_url, null: false

      t.timestamps
    end
  end
end
