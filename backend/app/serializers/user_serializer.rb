class UserSerializer < ActiveModel::Serializer
  attributes :id, :nickname, :avatar, :github_repositories, :experience

  def avatar
    object.avatar ? { id: object.avatar.id, avatar_url: object.avatar.avatar_url } : nil
  end

  def experience
    object.experience ? { id: object.experience.id, experience: object.experience.experience } : nil
  end


  def github_repositories
    @instance_options[:github_repositories]
  end
end