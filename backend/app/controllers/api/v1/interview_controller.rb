class Api::V1::InterviewController < ApplicationController
    def start
      readme = params[:readme]
      chatgpt_service = ChatgptService.new
      text_to_speech_service = TextToSpeechService.new
  
      system_prompt = "あなたは、エンジニア面接担当者です。初回は挨拶をしましょう。ユーザーからは「面接の想定質問」または「リポジトリのreadmeファイル」が入力されます。それを見て、面接担当者として質問を考えてください。質問は1つずつとします。途中で話題を変えても構いません。ユーザーの入力がない場合や内容が乏しい場合は、エンジニア採用の面接にありそうな質問をしてください。"
      
      messages = [
        { role: 'system', content: system_prompt },
        { role: 'user', content: "入力:\n#{readme}" }
      ]
  
      chatgpt_response = chatgpt_service.conversation_chat(messages)
      audio_data = text_to_speech_service.generate_speech(chatgpt_response)

      # アシスタントの応答をmessagesに追加
      messages << { role: 'assistant', content: chatgpt_response }
  
      render json: { text: chatgpt_response, audio: audio_data, messages: messages }
    end
  
    def continue
      messages = params[:messages]
      user_response = params[:user_response]
  
      messages << { role: 'user', content: user_response }
  
      chatgpt_service = ChatgptService.new
      text_to_speech_service = TextToSpeechService.new
  
      chatgpt_response = chatgpt_service.conversation_chat(messages)
      audio_data = text_to_speech_service.generate_speech(chatgpt_response)
  
      messages << { role: 'assistant', content: chatgpt_response }
  
      render json: { text: chatgpt_response, audio: audio_data, messages: messages }
    end
  end