#!/bin/sh
set -e

echo "Attente de la disponibilité de MySQL..."
until mysql -h database -u todo_user -ptodo_password -e "SELECT 1"; do
    echo "MySQL n'est pas encore disponible - on attend..."
    sleep 2
done
echo "MySQL est prêt!"

mkdir -p /var/www/html/var/cache /var/www/html/var/log


if [ "$APP_ENV" = "dev" ]; then
    echo "Environnement de développement détecté, suppression et recréation de la base de données..."
    mysql -h database -u root -prootpassword -e "DROP DATABASE IF EXISTS todo_app; CREATE DATABASE todo_app;"
    mysql -h database -u root -prootpassword -e "GRANT ALL PRIVILEGES ON todo_app.* TO 'todo_user'@'%';"
    mysql -h database -u root -prootpassword -e "FLUSH PRIVILEGES;"
    
    sleep 2
    
    echo "Création du schéma de la base de données..."
    php /var/www/html/bin/console doctrine:schema:create --no-interaction
    
    echo "Chargement des fixtures de développement..."
    php /var/www/html/bin/console doctrine:fixtures:load --no-interaction
else
    echo "Environnement de production détecté, vérification des migrations..."
    php /var/www/html/bin/console doctrine:migrations:migrate --no-interaction
fi

echo "Nettoyage du cache..."
php /var/www/html/bin/console cache:clear

echo "Correction des permissions..."
chown -R www-data:www-data /var/www/html/var

echo "Backend prêt à l'emploi!"

exec "$@"