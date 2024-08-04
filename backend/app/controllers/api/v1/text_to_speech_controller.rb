class Api::V1::TextToSpeechController < ApplicationController
    def generate
      text = params[:text]
      
      if text.blank?
        render json: { error: "Text cannot be blank" }, status: :unprocessable_entity
        return
      end
  
      service = TextToSpeechService.new
      audio_data = service.generate_speech(text)
      render json: { audio_data: audio_data }
    rescue StandardError => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end