# app/models/interview_log.rb
class InterviewLog < ApplicationRecord
  belongs_to :user

  validates :body, presence: true
  validates :feedback, presence: true
end