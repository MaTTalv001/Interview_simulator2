require 'httparty'
require 'streamio-ffmpeg'

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
    file_to_send = need_conversion?(audio_file) ? convert_to_mp3(audio_file) : audio_file
    
    body = {
      multipart: true,
      model: 'whisper-1',
      file: File.new(file_to_send.path, 'rb'),
      language: "ja"
    }

    response = self.class.post('/audio/transcriptions', body: body, headers: @options[:headers])

    File.delete(file_to_send.path) if file_to_send.is_a?(Tempfile) && File.exist?(file_to_send.path)

    if response.success?
      response.parsed_response['text']
    else
      handle_error_response(response)
    end
  end

  private

  def need_conversion?(file)
    movie = FFMPEG::Movie.new(file.path)
    !['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm'].include?(movie.audio_codec)
  end

  def convert_to_mp3(input_file)
    temp_file = Tempfile.new(['converted', '.mp3'])
    movie = FFMPEG::Movie.new(input_file.path)
    movie.transcode(temp_file.path, audio_codec: 'libmp3lame')
    temp_file
  end

  def handle_error_response(response)
    error_message = response.parsed_response['error']['message'] rescue '不明なエラーが発生しました'
    Rails.logger.error "OpenAI API Error: #{error_message}"
    raise StandardError, "OpenAI API Error: #{error_message}"
  end
end