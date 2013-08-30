#!/usr/bin/env ruby

require 'zendesk/deployment'

set :repository, "git@github.com:zendesk/npm_lazy.git"
set :application, "npm_lazy"
set :deploy_to, "/data/zendesk_#{application}"
set :environments, [:master1, :master2, :qa, :staging, :pod1, :pod2, :pod3]

set :user, "zendesk"
set :group, "zendesk"

# ruby
set :ruby_loader, "/usr/local/bin/rvmrun default"

# zendesk_npm_lazy deploy
namespace :deploy do
  task :restart do
    sudo "sv restart npm_lazy"
  end

  task :npm_install do
    run "cd #{release_path} && rm -rf node_modules/ || true"
    run "cd #{release_path} && PATH=#{release_path}/bin:$PATH nice npm install --production"
    update_config
  end

  task :update_config do
    run "ln -nfs /data/zendesk_npm_lazy/config/config.js #{release_path}/config.js"
    run "ln -nfs /var/log/zendesk #{release_path}/log"
  end
end

after "deploy:update_code","deploy:npm_install"
