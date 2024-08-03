# app/models/users_comment.rb
class UsersComment < ApplicationRecord
  belongs_to :user
  belongs_to :comment
end
