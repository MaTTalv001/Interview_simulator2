class CreateCompanyTypes < ActiveRecord::Migration[6.1]
  def change
    create_table :company_types do |t|
      t.string :company_description, null: false

      t.timestamps
    end
  end
end
