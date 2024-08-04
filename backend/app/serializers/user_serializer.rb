class UserSerializer < ActiveModel::Serializer
    attributes :id, :nickname, :avatar
  
    def avatar
      object.avatar ? { id: object.avatar.id, avatar_url: object.avatar.avatar_url } : nil
    end
  end