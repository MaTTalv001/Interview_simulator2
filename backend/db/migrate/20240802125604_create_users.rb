class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :nickname, null: false  # null制約を追加

      t.timestamps
    end
  end
end
