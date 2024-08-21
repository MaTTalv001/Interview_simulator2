module Api
    module V1
      class ExperiencesController < ApplicationController
        def index
          @experiences = Experience.all
          render json: @experiences
        end
      end
    end
  end