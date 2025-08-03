# =================================================================
# ESTÁGIO 1: O Construtor (Builder)
# MUDANÇA IMPORTANTE: Alterado para usar o JDK 11.
# Isso garante que o código será compilado para a mesma versão do Java
# que será usada para rodar a aplicação, resolvendo o erro UnsupportedClassVersionError.
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
# Esta parte não muda, continuamos usando o Tomcat com JDK 11.
# =================================================================
FROM tomcat:9.0-jdk11-openjdk

# Limpa a pasta de apps padrão do Tomcat
RUN rm -rf /usr/local/tomcat/webapps/*

# Copia o arquivo .war, que agora foi compilado com Java 11, para a pasta do Tomcat
COPY --from=builder /app/dist/Quiz-Enem.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
