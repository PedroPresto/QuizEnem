# Usa uma imagem oficial do Tomcat que já vem com Java 11.
# Esta será a base do nosso ambiente.
FROM tomcat:9.0-jdk11-openjdk

# Remove os aplicativos de exemplo que vêm com o Tomcat para limpar o ambiente.
RUN rm -rf /usr/local/tomcat/webapps/*

# Copia o seu arquivo .war pré-compilado para a pasta de deploy do Tomcat.
# Renomeamos para ROOT.war para que a aplicação seja a principal do servidor
# (acessível em seudominio.com/ em vez de seudominio.com/Quiz-Enem).
COPY dist/Quiz-Enem.war /usr/local/tomcat/webapps/ROOT.war

# Expõe a porta 8080, que é a porta padrão do Tomcat, para o mundo exterior do container.
EXPOSE 8080

# Comando padrão para iniciar o servidor Tomcat quando o container for executado.
CMD ["catalina.sh", "run"]