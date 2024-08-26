# app/models/comment.rb
class Comment < ApplicationRecord
  belongs_to :user, optional: false
  validates :comment, presence: true
  has_many :liking_users, through: :users_comments, source: :user
  has_many :users_comments
  has_many :users, through: :users_comments
  paginates_per 10

  def likes_count
    count = users_comments.count
    Rails.logger.info "Comment ID: #{id}, Likes Count: #{count}"
    count
  end
end
