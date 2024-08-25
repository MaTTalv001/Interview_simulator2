class RemoveCompanyIdFromInterviewLogs < ActiveRecord::Migration[7.1]
  def up
    remove_column :interview_logs, :company_id
    remove_index :interview_logs, name: "index_interview_logs_on_company_id", if_exists: true
  end

  def down
    add_column :interview_logs, :company_id, :bigint
    add_index :interview_logs, :company_id, name: "index_interview_logs_on_company_id"
  end
end
