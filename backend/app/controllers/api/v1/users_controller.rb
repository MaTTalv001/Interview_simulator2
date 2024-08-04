class Api::V1::UsersController < ApplicationController
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
        render json: { user: @current_user }
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
        render json: { error: "GitHub user not found" }, status: :not_found
      rescue Octokit::Unauthorized
        render json: { error: "GitHub API authentication failed" }, status: :unauthorized
      end

    private

    def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end

    
end