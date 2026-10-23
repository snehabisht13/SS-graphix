class ApplicationMailer < ActionMailer::Base
  default from: -> { ENV.fetch("BREVO_SENDER_EMAIL") }
  layout "mailer"
end