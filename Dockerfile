# ESTÁGIO 1: O Construtor (Builder)
# Usamos uma imagem que já tem Java JDK 11 e Ant instalados
FROM suzik/ant:1.10.12-jdk11 AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia todos os ficheiros do seu projeto para o container
COPY . .

# Executa o Ant usando o seu ficheiro build.xml para criar o .war
# A tarefa "dist" (ou "war") no seu build.xml será executada
RUN ant dist


# ESTÁGIO 2: O Executor (Runner)
# Agora, usamos a imagem leve do Tomcat para rodar a aplicação
FROM tomcat:9.0-jdk11-openjdk

# Remove os aplicativos de exemplo do Tomcat
RUN rm -rf /usr/local/tomcat/webapps/*

# Copia APENAS o ficheiro .war que foi gerado no Estágio 1
# para a pasta de deploy do Tomcat
COPY --from=builder /app/dist/Quiz-Enem.war /usr/local/tomcat/webapps/ROOT.war
# Expõe a porta 8080 e inicia o Tomcat
EXPOSE 8080
CMD ["catalina.sh", "run"]