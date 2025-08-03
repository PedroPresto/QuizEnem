# =================================================================
# ESTÁGIO 1: O Construtor (Builder)
# MUDANÇA IMPORTANTE: Alterado para usar o JDK 17.
# O Java 17 é uma versão de Suporte de Longo Prazo (LTS) que entende
# a sintaxe moderna do seu código (Text Blocks com """), resolvendo o erro de compilação.
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
# MUDANÇA IMPORTANTE: Alterado para usar o Tomcat com JDK 17.
# Isso garante que o ambiente de execução seja o mesmo do ambiente de compilação.
# =================================================================
FROM tomcat:9.0-jdk17-openjdk

# Limpa a pasta de apps padrão do Tomcat
RUN rm -rf /usr/local/tomcat/webapps/*

# Copia o arquivo .war, que agora foi compilado com Java 17, para a pasta do Tomcat
COPY --from=builder /app/dist/Quiz-Enem.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080
