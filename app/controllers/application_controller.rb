class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception # leave this at the top

  realtime_controller({:queue => :redis})
  respond_to :html, :json, :js

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
  #devise_parameter_sanitizer.permit(:sign_up, keys: [:user])
  devise_parameter_sanitizer.permit(:account_update) do |user_params|
    user_params.permit(:steemaccount, :email, :password, :current_password, :password_confirmation)
  end
  devise_parameter_sanitizer.permit(:sign_in) do |user_params|
    user_params.permit(:email, :password, :remember_me)
  end
  end
  def realtime_user_id
    current_user&.id
  end
  helper_method :api, :follow_api
  private
  def api
    @@API ||= Radiator::Api.new
  end
  def follow_api
    @@FOLLOW_API ||= Radiator::FollowApi.new
  end
  
  def realtime_server_url
    # point this to your node.js-socket.io-redis/zmq realtime server (you can set this later)
    return 'https://steemstars-tadasu85.c9users.io:8082'
  end
  
end

