class Api::V1::UsersController < ApplicationController
  before_action :fetch_github_repositories, only: [:current]
    # GET /api/v1/users
    def index

    end

    # GET /api/v1/users/:id
    def show
        @user = User.find(params[:id])
        render json: @user
    end

    # PATCH/PUT /api/v1/users/:id
    def update
        @user = User.find(params[:id])
        if @user.update(update_params)
        render json: @user
        else
        render json: @user.errors, status: :unprocessable_entity
        end
    end

    # DELETE /api/v1/users/:id
    def destroy
        @user = User.find(params[:id])
        @user.destroy
        head :no_content
    end

    # /api/v1/users/current

    def current
      if @current_user
        render json: @current_user, serializer: UserSerializer, github_repositories: @github_repositories
      else
        render json: { error: 'Not Authorized' }, status: :unauthorized
      end
    end

    def github_info
        github_service = GithubService.new
        
        # @current_user.nickname が GitHub のユーザー名であると仮定
        username = @current_user.nickname
        
        repos = github_service.user_repositories(username)
        
        # コミット数でソートされたリポジトリを取得
        sorted_repos = repos.sort_by do |repo|
          github_service.repository_commits(repo.full_name).count
        end.reverse
    
        # 上位5つのリポジトリとそのREADMEを取得
        top_repos_with_readme = sorted_repos.take(5).map do |repo|
          readme = github_service.repository_readme(repo.full_name)
          {
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            commits_count: github_service.repository_commits(repo.full_name).count,
            readme: readme ? Base64.decode64(readme.content) : nil
          }
        end
    
        render json: { repositories: top_repos_with_readme }
      rescue Octokit::NotFound
        render json: { error: "GitHub ユーザーが見つかりませんでした" }, status: :not_found
      rescue Octokit::Unauthorized
        render json: { error: "Github 認証失敗" }, status: :unauthorized
      end


    def avatars
      @avatars = Avatar.all
      render json: @avatars
    end
    
    def update_avatar
      if @current_user.update(avatar_id: params[:avatar_id])
        render json: @current_user, serializer: UserSerializer
      else
        render json: { error: 'アバターアップデート失敗' }, status: :unprocessable_entity
      end
    end

    def update_experience
      if @current_user.update(experience_id: params[:experience_id])
        render json: @current_user, serializer: UserSerializer
      else
        render json: { error: '経験アップデート失敗' }, status: :unprocessable_entity
      end
    end

    private

    def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end

    def fetch_github_repositories
      github_service = GithubService.new
      @github_repositories = github_service.all_repository_names(@current_user.nickname)
    rescue StandardError => e
      Rails.logger.error "レポジトリ取得失敗: #{e.message}"
      @github_repositories = []
    end



    
end