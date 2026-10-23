class CreateEnquiries < ActiveRecord::Migration[8.1]
  def change
    create_table :enquiries do |t|
      t.timestamps
      t.string :name , null: false
      t.string :email , null: false
      t.string :contact , null: false
      t.string :service , null: false
      t.text :requirement
    end
  end
end
