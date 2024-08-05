class Api::V1::GithubController < ApplicationController
    def readme
      github_service = GithubService.new
      repo_full_name = "#{@current_user.nickname}/#{params[:repo_name]}"
      readme_content = github_service.repository_readme(repo_full_name)
  
      if readme_content
        render json: { readme: readme_content }
      else
        render json: { error: 'README not found' }, status: :not_found
      end
    end
  end