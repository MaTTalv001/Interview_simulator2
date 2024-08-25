class Api::V1::InterviewLogsController < ApplicationController
    def index
        logs = @current_user.interview_logs.order(created_at: :desc)
        render json: logs
      end
    
    def create
      interview_log = @current_user.interview_logs.new(interview_log_params)
  
      if interview_log.save
        render json: { message: '面接ログを保存しました', id: interview_log.id }, status: :created
      else
        render json: { errors: interview_log.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    private
  
    def interview_log_params
      params.require(:interview_log).permit(:body, :feedback)
    end
  end