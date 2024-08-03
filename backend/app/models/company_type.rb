# app/models/company_type.rb
class CompanyType < ApplicationRecord
    has_many :interview_logs
  end
  