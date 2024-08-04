require 'httparty'

class ChatgptService
  include HTTParty
  base_uri 'https://api.openai.com/v1'
  format :json

  def initialize
    @options = {
      headers: {
        'Content-Type' => 'application/json',
        'Authorization' => "Bearer #{ENV['OPENAI_API']}"
      }
    }
  end

  # 単発のチャット機能
  def single_chat(message, system_message = nil)
    messages = []
    messages << { role: 'system', content: system_message } if system_message
    messages << { role: 'user', content: message }

    chat(messages)
  end

  # 会話の流れを維持するチャット機能
  def conversation_chat(messages)
    chat(messages)
  end

  private

  def chat(messages)
    body = {
      model: 'gpt-4o-mini',
      messages: messages
    }.to_json

    response = self.class.post('/chat/completions', body: body, headers: @options[:headers])

    if response.success?
      response.parsed_response['choices'][0]['message']['content']
    else
      handle_error_response(response)
    end
  end

  def handle_error_response(response)
    error_message = response.parsed_response['error']['message'] rescue '不明なエラーが発生しました'
    Rails.logger.error "OpenAI API Error: #{error_message}"
    raise StandardError, "OpenAI API Error: #{error_message}"
  end
end