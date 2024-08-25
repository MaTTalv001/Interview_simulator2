class ModifyInterviewLogs < ActiveRecord::Migration[7.1]
  def change

    # evaluationカラムを削除
    remove_column :interview_logs, :evaluation, :integer

    # feedbackカラムを追加
    add_column :interview_logs, :feedback, :text
  end
end