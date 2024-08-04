class User < ApplicationRecord
  belongs_to :avatar, optional: true
  belongs_to :experience, optional: true
    has_many :user_authentications
    has_many :comments
    has_many :users_comments
    has_many :comments, through: :users_comments
    has_many :interview_logs
  end
  