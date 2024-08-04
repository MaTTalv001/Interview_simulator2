class CreateInterviewers < ActiveRecord::Migration[6.1]
  def change
    create_table :interviewers do |t|
      t.string :interviewer_description
      t.string :interviewer_url

      t.timestamps
    end
  end
end
