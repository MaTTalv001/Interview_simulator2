class CreateInterviewLogs < ActiveRecord::Migration[6.1]
  def change
    create_table :interview_logs do |t|
      t.references :user, null: false, foreign_key: true
      t.references :company, null: false, foreign_key: { to_table: :company_types }
      t.text :body, null: false
      t.integer :evaluation

      t.timestamps
    end
  end
end
