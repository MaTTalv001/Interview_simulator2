# app/controllers/api/v1/comments_controller.rb
class Api::V1::CommentsController < ApplicationController
    
    def index
        @comments = Comment.includes(:user).order(created_at: :desc)
        # フィルタリングの適用
        @comments = @comments.where(style: params[:style]) if params[:style].present?
        @comments = @comments.where(category: params[:category]) if params[:category].present?
        @comments = @comments.where(experience: params[:experience]) if params[:experience].present?
        # ページネーションの適用
        @comments = @comments.page(params[:page]).per(10) 
        comments_with_likes = @comments.map do |comment|
            {
                id: comment.id,
                comment: comment.comment,
                style: comment.style,
                category: comment.category,
                experience: comment.experience,
                created_at: comment.created_at,
                updated_at: comment.updated_at,
                user: { id: comment.user.id, nickname: comment.user.nickname },
                likes_count: comment.likes_count,
                liked_by_current_user: comment.users_comments.exists?(user: @current_user)
            }
            end
            render json: {
                comments: comments_with_likes,
                total_pages: @comments.total_pages,
                current_page: @comments.current_page,
                total_count: @comments.total_count
            }
    end


    def create
        Rails.logger.info "Current user is loaded correctly: #{current_user.inspect}"
        @comment = @current_user.comments.build(comment_params)
        @comment.user_id = @current_user.id
        Rails.logger.info("Comment object after build: #{@comment.inspect}, user_id: #{@comment.user_id}")
        if @comment.save
            render json: @comment, status: :created
        else
            Rails.logger.error("Comment errors: #{@comment.errors.full_messages}")
            render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def destroy
        @comment = Comment.find(params[:id])
        if @comment.user_id == @current_user.id
          if @comment.destroy
            render json: { message: "コメントが削除されました" }, status: :ok
          else
            render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: "削除する権限がありません" }, status: :forbidden
        end
      end
    
    def like
        @comment = Comment.find(params[:id])
        @users_comment = UsersComment.find_by(user: @current_user, comment: @comment)

        if @users_comment
            # 既に「いいね」が存在する場合、取り消す
            @users_comment.destroy
        else
            # 「いいね」が存在しない場合、新しく作成
            UsersComment.create(user: @current_user, comment: @comment)
        end

        # 最新の「いいね」の数を返す
        render json: { likes_count: @comment.users_comments.count }
    end

    private

    def comment_params
        params.require(:comment).permit(:comment, :experience, :category, :style)
    end
end