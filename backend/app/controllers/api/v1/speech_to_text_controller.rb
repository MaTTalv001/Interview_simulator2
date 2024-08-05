class Api::V1::SpeechToTextController < ApplicationController
    def transcribe
      audio_file = params[:audio]
      
      if audio_file
        service = SpeechToTextService.new
        transcription = service.transcribe(audio_file)
        Rails.logger.info "Transcription: #{transcription}"
        render json: { transcription: transcription }, status: :ok
      else
        render json: { error: 'No audio file provided' }, status: :bad_request
      end
    rescue StandardError => e
      Rails.logger.error "Error transcribing audio: #{e.message}"
      render json: { error: 'Error transcribing audio' }, status: :internal_server_error
    end
  end