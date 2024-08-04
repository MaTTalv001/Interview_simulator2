require 'httparty'

class TextToSpeechService
  include HTTParty
  base_uri 'https://api.openai.com/v1'
  format :json

  VALID_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'].freeze

  def initialize
    @options = {
      headers: {
        'Content-Type' => 'application/json',
        'Authorization' => "Bearer #{ENV['OPENAI_API']}"
      }
    }
  end

  def generate_speech(text, voice = 'alloy', model = 'tts-1', save_to_file: false)
    unless VALID_VOICES.include?(voice)
      raise ArgumentError, "Invalid voice. Choose from: #{VALID_VOICES.join(', ')}"
    end

    body = {
      model: model,
      voice: voice,
      input: text
    }.to_json

    response = self.class.post('/audio/speech', body: body, headers: @options[:headers])

    if response.success?
      handle_successful_response(response, save_to_file)
    else
      handle_error_response(response)
    end
  end

  private

  def handle_successful_response(response, save_to_file)
    if save_to_file
      file_path = Rails.root.join('tmp/TTS', "speech_#{Time.now.to_i}.mp3")
      File.open(file_path, 'wb') do |file|
        file.write(response.body)
      end
      file_path.to_s
    else
      "data:audio/mpeg;base64,#{Base64.strict_encode64(response.body)}"
    end
  end

  def handle_error_response(response)
    error_message = response.parsed_response['error']['message'] rescue '不明なエラーが発生しました'
    Rails.logger.error "OpenAI API Error: #{error_message}"
    raise StandardError, "OpenAI API Error: #{error_message}"
  end
end