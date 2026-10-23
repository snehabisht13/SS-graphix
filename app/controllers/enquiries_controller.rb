class EnquiriesController < ApplicationController
  def submit_form

    enquiry = enquiry_params

    EnquiryMailer.new_enquiry(enquiry).deliver_later

    EnquiryMailer.enquiry_confirmation(enquiry).deliver_later

    redirect_to root_path,
                notice: "Your enquiry has been submitted successfully. Check your email for confirmation."

  end

  private

  def enquiry_params
    params.permit(
      :name,
      :email,
      :contact,
      :service,
      :requirement
    )
  end
end