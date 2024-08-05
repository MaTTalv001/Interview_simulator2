class Api::V1::InterviewController < ApplicationController
    def start
      readme = params[:readme]
      chatgpt_service = ChatgptService.new
      text_to_speech_service = TextToSpeechService.new
  
      prompt = "あなたは、エンジニア面接担当者です。最初は挨拶から始め、ユーザーのreadmeファイルを見て、何か質問を考えてください。\n\nREADME:\n#{readme}"
      Rails.logger.info("プロンプト")
      Rails.logger.info(prompt)
      chatgpt_response = chatgpt_service.single_chat(prompt)
      audio_data = text_to_speech_service.generate_speech(chatgpt_response)
  
      render json: { text: chatgpt_response, audio: audio_data }
    end
  
    def continue
      user_response = params[:user_response]
      chatgpt_service = ChatgptService.new
      text_to_speech_service = TextToSpeechService.new
  
      prompt = "ユーザーの回答: #{user_response}\n\nこの回答に対して、さらに深掘りする質問をしてください。"
      
      chatgpt_response = chatgpt_service.single_chat(prompt)
      audio_data = text_to_speech_service.generate_speech(chatgpt_response)
  
      render json: { text: chatgpt_response, audio: audio_data }
    end
  end