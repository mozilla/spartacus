import os

import fabdeploytools.envs
from fabric.api import env, lcd, local, task
from fabdeploytools import helpers

import deploysettings as settings

env.key_filename = settings.SSH_KEY
fabdeploytools.envs.loadenv(settings.CLUSTER)
ROOT, SPARTACUS = helpers.get_app_dirs(__file__)


@task
def pre_update(ref):
    with lcd(SPARTACUS):
        local('git fetch')
        local('git fetch -t')
        local('git reset --hard %s' % ref)


@task
def update():
    with lcd(SPARTACUS):
        local('npm install')
        local('node -e "require(\'grunt\').cli()" null abideCompile')
        local('node -e "require(\'grunt\').cli()" null stylus')
        local('node -e "require(\'grunt\').cli()" null requirejs')
        local('node -e "require(\'grunt\').cli()" null nunjucks')


@task
def deploy():
    helpers.deploy(name=settings.PROJECT_NAME,
                   app_dir='spartacus',
                   env=settings.ENV,
                   cluster=settings.CLUSTER,
                   domain=settings.DOMAIN,
                   root=ROOT)
