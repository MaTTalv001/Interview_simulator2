# app/models/interviewer.rb
class Interviewer < ApplicationRecord
  belongs_to :company_type, foreign_key: 'company_id'
  has_many :interview_logs
end
