# =================================================================
# ESTÁGIO 1: O Construtor (Builder)
# Usamos uma imagem oficial do Java 11 e instalamos o Ant nela.
# =================================================================
FROM eclipse-temurin:11-jdk AS builder

# Atualiza os pacotes e instala o Ant
RUN apt-get update && apt-get install -y ant

# O resto do processo de build continua igual
WORKDIR /app
COPY . .
RUN ant dist


# =================================================================
# ESTÁGIO 2: O Executor (Runner)
# Esta parte não muda.
# =================================================================
FROM tomcat:9.0-jdk11-openjdk

RUN rm -rf /usr/local/tomcat/webapps/*

COPY --from=builder /app/dist/Quiz-Enem.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]