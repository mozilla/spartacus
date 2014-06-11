import os

import fabdeploytools.envs
from fabric.api import env, lcd, local, task
from fabdeploytools import helpers

import deploysettings as settings

env.key_filename = settings.SSH_KEY
fabdeploytools.envs.loadenv(settings.CLUSTER)
ROOT, SPARTACUS = helpers.get_app_dirs(__file__)

WEBPAY = '%s/webpay' % settings.WEBPAY_DIR
WEBPAY_PYTHON = '%s/venv/bin/python' % settings.WEBPAY_DIR

SPARTACUS_REF = helpers.git_ref(SPARTACUS)

SCL_NAME = getattr(settings, 'SCL_NAME', False)
if SCL_NAME:
    helpers.scl_enable(SCL_NAME)


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
        update_build_id()


@task
def deploy():
    helpers.deploy(name=settings.PROJECT_NAME,
                   app_dir='spartacus',
                   env=settings.ENV,
                   cluster=settings.CLUSTER,
                   domain=settings.DOMAIN,
                   root=ROOT)


@task
def update_build_id():
    with lcd(WEBPAY):
        local('%s manage.py spa_build_id %s' % (WEBPAY_PYTHON, SPARTACUS_REF))
