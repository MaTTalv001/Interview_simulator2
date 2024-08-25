class ChangeCompanyIdToNullableInInterviewLogs < ActiveRecord::Migration[7.1]
  def change
    change_column_null :interview_logs, :company_id, true
  end
end
