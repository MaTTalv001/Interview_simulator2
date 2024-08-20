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

    def end_interview
      messages = params[:messages]
      chatgpt_service = ChatgptService.new
      text_to_speech_service = TextToSpeechService.new
  
      feedback_prompt = "あなたはエンジニア面接担当者であり、同時にキャリアコンサルタントでもあります。以下の面接の会話ログを分析し、受験者(user)に対し、口語で、採用面接としてのフィードバックを行ってください(マークダウン表記などは不要です。)。強み、改善点、全体的な印象を含め、受験者のためになるようなアドバイスをお願いします"
  
      feedback_messages = [
        { role: 'system', content: feedback_prompt },
        { role: 'user', content: messages.map { |m| "#{m[:role]}: #{m[:content]}" }.join("\n") }
      ]
  
      feedback_response = chatgpt_service.conversation_chat(feedback_messages)
      audio_data = text_to_speech_service.generate_speech(feedback_response)
  
      render json: { text: feedback_response, audio: audio_data }
    end
  end