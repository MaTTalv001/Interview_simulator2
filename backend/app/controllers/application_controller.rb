class ApplicationController < ActionController::API
    before_action :authenticate_request

    protected

    def authenticate_request
        header = request.headers['Authorization']
        header = header.split(' ').last if header
        begin
            @decoded = JwtService.decode(header)
            # UserAuthenticationをGitHubのuser_idで検索
            user_auth = UserAuthentication.find_by(uid: @decoded["github_user_id"])
            # UserAuthenticationから関連するUserを取得
            @current_user = user_auth.user if user_auth
            Rails.logger.info(@current_user)
            unless @current_user
                # @current_userが見つからない場合のエラー処理
                raise ActiveRecord::RecordNotFound, 'User not found'
            end
        rescue ActiveRecord::RecordNotFound, JWT::DecodeError => e
            Rails.logger.error "Authentication error: #{e.message}"
            render json: { errors: e.message }, status: :unauthorized
        end
    end

  def current_user
    @current_user
  end

    def fetch_github_repositories
        github_service = GithubService.new
        @github_repositories = github_service.recently_updated_repositories(@current_user.nickname)
      rescue StandardError => e
        Rails.logger.error "Error fetching GitHub repositories: #{e.message}"
        @github_repositories = []
      end
end
