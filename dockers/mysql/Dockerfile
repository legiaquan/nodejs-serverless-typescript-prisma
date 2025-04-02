FROM mysql:8.0

# Custom MySQL configuration
COPY ./dockers/mysql/my.cnf /etc/mysql/conf.d/my.cnf

# Set default authentication plugin
CMD ["mysqld", "--default-authentication-plugin=mysql_native_password"]
