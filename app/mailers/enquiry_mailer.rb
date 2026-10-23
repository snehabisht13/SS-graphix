class EnquiryMailer < ApplicationMailer

  def new_enquiry(params)

    @name = params[:name]
    @email = params[:email]
    @contact = params[:contact]
    @service = params[:service]
    @requirement = params[:requirement]

    mail(
      to: ENV.fetch("BREVO_SENDER_EMAIL"),
      from: ENV.fetch("BREVO_SENDER_EMAIL"),
      reply_to: @email,
      subject: "New Enquiry from #{@name}"
    )

  end

  def enquiry_confirmation(params)

    @name = params[:name]
    @email = params[:email]
    @service = params[:service]

    mail(
      to: @email,
      from: ENV.fetch("BREVO_SENDER_EMAIL")
      subject: "Thank You #{params[:name]}"
    )

  end

end