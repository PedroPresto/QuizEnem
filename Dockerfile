# =================================================================
# ESTÁGIO 1: O Construtor (Builder)
# Alterado para usar o JDK 17, que suporta a sintaxe moderna do seu código.
# =================================================================
FROM eclipse-temurin:17-jdk AS builder

# Atualiza os pacotes e instala o Ant
RUN apt-get update && apt-get install -y ant

# O resto do processo de build continua igual
WORKDIR /app
COPY . .
RUN ant dist


# =================================================================
# ESTÁGIO 2: O Executor (Runner)
# Esta parte não precisa de ser alterada, o Tomcat 9 funciona bem com o .war gerado.
# =================================================================
FROM tomcat:9.0-jdk11-openjdk

RUN rm -rf /usr/local/tomcat/webapps/*

COPY --from=builder /app/dist/Quiz-Enem.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
CMD ["catalina.sh", "run"]