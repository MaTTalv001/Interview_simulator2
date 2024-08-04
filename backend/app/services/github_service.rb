require 'octokit'

class GithubService
  def initialize
    @client = Octokit::Client.new(access_token: ENV['GITHUB_ACCESS_TOKEN'])
  end

  def recently_updated_repositories(username, limit = 5)
    options = {
      sort: 'pushed',  # 最後にプッシュ（コミット）された日時でソート
      direction: 'desc',  # 降順（最新のものから）
      per_page: limit
    }
    @client.repositories(username, options)
  end

  def repository_readme(repo_full_name)
    readme = @client.readme(repo_full_name, :accept => 'application/vnd.github.html')
    readme.force_encoding('UTF-8')
  rescue Octokit::NotFound
    nil
  end

  def user_contributions(username, days = 7)
    end_date = Date.today
    start_date = end_date - days

    events = @client.user_events(username)
    
    contributions = events.select do |event|
      event_date = event.created_at.to_date
      event_date >= start_date && event_date <= end_date &&
        ['PushEvent', 'PullRequestEvent', 'IssuesEvent'].include?(event.type)
    end

    {
      total: contributions.count,
      by_type: contributions.group_by(&:type).transform_values(&:count),
      by_date: contributions.group_by { |e| e.created_at.to_date }.transform_values(&:count)
    }
  end

  def repository_readme(repo_full_name)
    readme = @client.readme(repo_full_name, accept: 'application/vnd.github.raw')
    readme.force_encoding('UTF-8')
  rescue Octokit::NotFound
    "README is not available."
  rescue Octokit::Error => e
    Rails.logger.error "Failed to retrieve README: #{e.message}"
    "Error retrieving README."
  end


  def all_repository_names(username)
    options = { type: 'owner', sort: 'full_name', direction: 'asc' }
    repos = @client.repositories(username, options)
    repos.map(&:name)
  rescue Octokit::Error => e
    Rails.logger.error "Failed to retrieve repositories: #{e.message}"
    []
  end


end