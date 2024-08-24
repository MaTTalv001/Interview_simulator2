require 'httparty'

class SpeechToTextService
  include HTTParty
  base_uri 'https://api.openai.com/v1'
  format :json

  def initialize
    @options = {
      headers: {
        'Authorization' => "Bearer #{ENV['OPENAI_API']}"
      }
    }
  end

  def transcribe(audio_file)
    body = {
      multipart: true,
      model: 'whisper-1',
      file: audio_file,
      language: "ja"
    }

    response = self.class.post('/audio/transcriptions', body: body, headers: @options[:headers])

    if response.success?
      response.parsed_response['text']
    else
      handle_error_response(response)
    end
  end

  private

  def handle_error_response(response)
    error_message = response.parsed_response['error']['message'] rescue '不明なエラーが発生しました'
    Rails.logger.error "OpenAI API Error: #{error_message}"
    raise StandardError, "OpenAI API Error: #{error_message}"
  end
end