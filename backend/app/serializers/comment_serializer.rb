class CommentSerializer < ActiveModel::Serializer
    attributes :id, :comment, :created_at, :updated_at, :likes_count, :experience, :style, :category
    belongs_to :user, serializer: UserSerializer
  end
  