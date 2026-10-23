require "net/http"
require "json"

class BrevoDelivery
  def initialize(*args, **options); end

  def deliver!(mail)
    uri = URI("https://api.brevo.com/v3/smtp/email")

    html = mail.html_part&.decoded
    text = mail.text_part&.decoded

    unless html || text
      body = mail.body.decoded
      html = body if mail.content_type&.include?("html")
      text = body unless html
    end

    payload = {
      sender: {
        name: "SS Graphix",
        email: ENV.fetch("BREVO_SENDER_EMAIL")
      },
      to: Array(mail.to).map { |email| { email: email } },
      subject: mail.subject,
      replyTo: mail.reply_to&.first && {
        email: mail.reply_to.first
      }
    }

    payload[:htmlContent] = html if html
    payload[:textContent] = text if text

    request = Net::HTTP::Post.new(uri)
    request["api-key"] = ENV.fetch("BREVO_API_KEY")
    request["Content-Type"] = "application/json"
    request["Accept"] = "application/json"
    request.body = JSON.generate(payload)

    response = Net::HTTP.start(
      uri.hostname,
      uri.port,
      use_ssl: true,
      open_timeout: 10,
      read_timeout: 20
    ) do |http|
      http.request(request)
    end

    unless response.is_a?(Net::HTTPSuccess)
      raise "Brevo email failed: #{response.code} #{response.body}"
    end

    response
  end
end

ActionMailer::Base.add_delivery_method :brevo_api, BrevoDelivery
