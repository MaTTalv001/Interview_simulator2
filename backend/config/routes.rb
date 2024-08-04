Rails.application.routes.draw do
  get '/auth/:provider/callback', to: 'sessions#create'
  mount ActionCable.server => '/ws'
  post '/registrations', to: 'registrations#create'
  # 下記は動作確認でトップに表示しているだけ
  root to: proc { [200, {}, ["Hello, world!!! Auto Deploy!!!!"]] }

  # ユーザー登録のルート(API)
  namespace :api do
    namespace :v1 do
      post 'text_to_speech/generate', to: 'text_to_speech#generate'
      resources :users, only: [] do
        collection do
          get 'current'
          get 'github_info'
        end
      end
    end
  end
  get "up" => "rails/health#show", as: :rails_health_check
end