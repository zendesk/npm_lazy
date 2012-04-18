#!/usr/bin/env ruby

require 'yaml'
require 'json'
require 'alpha_omega/deploy'

set :repository, "git@github.com:zendesk/npm_lazy.git"
set :application, "zendesk_npm_lazy"
set :releases, [ "alpha", "omega" ]
set :deploy_to, "/data/#{application}"

set :user, "zendesk"
set :group, "zendesk"

# ruby
set :ruby_loader, "/data/zendesk/bin/rvmrun ree"

# branches
set :branch, AlphaOmega.what_branch(%w(master) + [%r(/)])

# pods, hosts, groups
AlphaOmega.setup_pods self, "/data/zendesk_chef" do |adm, n|
  %w( role[zendesk_npm_lazy]
  ).any? {|r| n["run_list"].member? r }
end

# zendesk_npm_lazy deploy
namespace :zendesk_npm_lazy do
  task :restart do
    sudo "sv restart npm_lazy"
  end

  task :update_code do
    run "cd #{release_path} && rm -rf node_modules/ || true"
    run "cd #{release_path} && PATH=#{release_path}/bin:$PATH nice npm install --production"
    update_config
  end

  task :update_config do
    run "ln -nfs /data/zendesk/config/npm_lazy_config.js #{release_path}/config.js"
    run "ln -nfs /var/log/zendesk #{release_path}/log"
  end
end

after "deploy:update_code","zendesk_npm_lazy:update_code"
after "deploy:restart", "zendesk_npm_lazy:restart"
