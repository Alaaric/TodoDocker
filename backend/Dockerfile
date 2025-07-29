FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libzip-dev \
    default-mysql-client \
    && docker-php-ext-install \
    intl \
    opcache \
    pdo \
    pdo_mysql \
    zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./

RUN composer install --prefer-dist --no-scripts

COPY . .

RUN composer dump-autoload --no-scripts --optimize

RUN chown -R www-data:www-data var/

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

CMD ["php-fpm"]
