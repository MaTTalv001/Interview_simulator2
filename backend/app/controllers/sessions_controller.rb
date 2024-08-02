class SessionsController < ApplicationController
    skip_before_action :authenticate_request, only: [:create]

    def create
        frontend_url = ENV['REACT_APP_API_URL']
        user_info = request.env['omniauth.auth']
        # GitHubのユーザーIDを取得
        github_user_id = user_info.uid
        # 組織メンバー検索用にNicknameを取得（ネスト構造）
        github_username = user_info.info.nickname
        provider = "github"
        token = generate_token_with_github_user_id(github_user_id, provider)
        
        user_authentication = UserAuthentication.find_by(uid: github_user_id, provider: provider)
        
        if user_authentication
            Rails.logger.info("アプリユーザー登録されている")
            redirect_to "#{frontend_url}/MyPage?token=#{token}", allow_other_host: true
        else
            Rails.logger.info("まだアプリユーザー登録されていない")
            # 仮のユーザーを作成
            user = User.create(nickname: github_username)
            UserAuthentication.create(user_id: user.id, uid: github_user_id, provider: provider)
            redirect_to "#{frontend_url}/MyPage?token=#{token}", allow_other_host: true
        end
    end

    private

    def generate_token_with_github_user_id(github_user_id, provider)
        exp = Time.now.to_i + 24 * 3600
        payload = { github_user_id: github_user_id, provider: provider, exp: exp }
        hmac_secret = ENV['JWT_SECRET_KEY']
        JWT.encode(payload, hmac_secret, 'HS256')
    end
end