# app/models/interview_log.rb
class InterviewLog < ApplicationRecord
  belongs_to :user
  belongs_to :company_type, foreign_key: 'company_id'
end
