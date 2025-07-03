FROM php:8.2-fpm

# Installer les extensions PHP nécessaires et les dépendances
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

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Définir le répertoire de travail
WORKDIR /var/www/html

# Copier composer.json et composer.lock
COPY composer.json composer.lock ./

# Installer les dépendances
RUN composer install --prefer-dist --no-scripts

# Copier le reste de l'application
COPY . .

# Finaliser l'installation de Composer
RUN composer dump-autoload --no-scripts --no-dev --optimize

# Corriger les permissions
RUN chown -R www-data:www-data var/

# Créer un script d'entrée
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Définir le script d'entrée
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Démarrer PHP-FPM
CMD ["php-fpm"]
