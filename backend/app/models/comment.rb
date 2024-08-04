# app/models/comment.rb
class Comment < ApplicationRecord
  belongs_to :user
  has_many :users_comments
  has_many :users, through: :users_comments
end
