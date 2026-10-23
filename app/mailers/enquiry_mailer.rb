class EnquiryMailer < ApplicationMailer

  def new_enquiry(params)

    @name = params[:name]
    @email = params[:email]
    @contact = params[:contact]
    @service = params[:service]
    @requirement = params[:requirement]

    mail(
      to: ENV["SMTP_USERNAME"],
      from: ENV["SMTP_USERNAME"],
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
      from: ENV["SMTP_USERNAME"],
      subject: "Thank You #{params[:name]}"
    )

  end

end