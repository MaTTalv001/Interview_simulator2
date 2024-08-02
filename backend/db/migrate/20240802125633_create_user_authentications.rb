class CreateUserAuthentications < ActiveRecord::Migration[7.1]
  def change
    create_table :user_authentications do |t|
      t.references :user, null: false, foreign_key: true
      t.string :provider, null: false # null制約を追加
      t.string :uid, null: false # null制約を追加

      t.timestamps
    end
  end
end
