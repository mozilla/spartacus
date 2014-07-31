FROM muffinresearch/centos-nodejs-mkt:0.1

RUN yum install -y fontconfig \
    freetype \
    libfreetype.so.6 \
    libfontconfig.so.1 \
    libstdc++.so.6 \
    wget \
    tar \
    bzip2

ENV PHANTOMJS_VERSION 1.9.7
ENV IS_DOCKER 1

RUN wget -q -O - https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2 | tar xjC /opt
RUN ln -s /opt/phantomjs-$PHANTOMJS_VERSION-linux-x86_64/bin/phantomjs /usr/bin/phantomjs

RUN mkdir -p /spartacus
ADD package.json /spartacus/package.json

WORKDIR /spartacus
RUN npm install
