<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html>
    <head>
        <title>Revisão de Questoes</title>
        <%@ include file="/includes/head.jsp"%>
        <link rel="stylesheet" href="${pageContext.request.contextPath}/estatisticas/revisao/revisao.css">
    </head>
    <body>
        <div class="app"> 
            <div class="revisao-header">
                <h1>👋 Olá, ${usuarioLogado.nome}!</h1>
                <p>Você respondeu <strong>${totalQuestoes}</strong> questões até agora. Continue praticando!</p>

                <div class="resumo-questoes">
                    <div id="acertosContador" class="resumo-card correto">✅ Acertos: ${acertos}</div>
                    <div id="errosContador" class="resumo-card errado">❌ Erros: ${erros}</div>

                    <c:set var="corClasse" value="barra-baixa" />
                    <c:if test="${taxaAcerto >= 70}">
                        <c:set var="corClasse" value="barra-alta" />
                    </c:if>
                    <c:if test="${taxaAcerto >= 40 && taxaAcerto < 70}">
                        <c:set var="corClasse" value="barra-media" />
                    </c:if>

                    <div class="grafico-wrapper">
                        <canvas id="graficoDesempenho"></canvas>
                    </div>


                    <div class="resumo-card taxa-barra">
                        <span>Taxa de acerto</span>
                        <div class="progress-container">
                            <div id="barraTaxaAcerto" class="barraTaxaAcerto ${corClasse}" style="width: ${taxaAcerto}%">
                                ${taxaAcerto}%
                            </div>
                        </div>
                        <div class="trend-indicator positive"><i class="fas fa-arrow-up"></i> 1,3% acima da média</div>
                    </div>
                </div>
            </div>

            <div class="filtros-wrapper">
                <h2 class="filtros-titulo">Filtros de Revisão</h2>
                <div class="filtros-selects">
                    <div class="filtro-box">
                        <label for="filtro-area">Área:</label>
                        <select id="filtro-area" onchange="filtrarQuestoes('area')">
                            <option value="todas">Todas</option>
                            <option value="Linguagens, Códigos e Tecnologias">Linguagens, Códigos e Tecnologias</option>
                            <option value="Matemática e suas Tecnologias">Matemática e suas Tecnologias</option>
                            <option value="Ciências da Natureza">Ciências da Natureza</option>
                            <option value="Ciências Humanas">Ciências Humanas</option>
                        </select>
                    </div>
                    <div class="filtro-box">
                        <label for="filtro-materia">Matéria:</label>
                        <select id="filtro-materia" onchange="filtrarQuestoes('materia')">
                            <option value="todas" data-area="todas">Todas</option>
                            <c:forEach var="entry" items="${materiaParaArea}">
                                <option value="${entry.key}" data-area="${entry.value}">${entry.key}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
            </div>
            <span>Questões Respondidas: </span>
            <c:forEach var="q" items="${revisoes}">
                <div class="questao" data-materia="${q.materia}" data-area="${q.area}" data-status="${q.status}" data-respondida="${q.respondida}" data-correta="${q.correta.toLowerCase()}">
                    <div class="questao-tags">
                        <c:if test="${not empty q.materia}"><span class="tag-materia">📚 ${q.materia}</span></c:if>
                        <c:if test="${not empty q.ano}"><span class="tag-ano">📅 ${q.ano}</span></c:if>
                        <c:if test="${not empty q.banca}"><span class="tag-banca">🏛️ ${q.banca}</span></c:if>
                        <c:if test="${not empty q.dificuldade}"><span class="tag-dificuldade">🎯 ${q.dificuldade}</span></c:if>
                        </div>

                        <p><strong>Questão ${q.id}:</strong> ${q.enunciado}</p>

                    <c:if test="${not empty q.anexo_texto}">
                        <div class="anexo-wrapper" onclick="toggleAnexo(this)">
                            <div class="anexo-header">
                                <span>Texto de Apoio</span>
                                <svg class="anexo-icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6"/>
                                </svg>
                            </div>
                            <div class="anexo-body">${q.anexo_texto}</div>
                        </div>
                    </c:if>

                    <c:forEach var="letra" items="${['a','b','c','d','e']}">
                        <c:set var="alternativa" value="${q[letra.toLowerCase()]}" />
                        <c:set var="classe">
                            <c:choose>
                                <c:when test="${letra == q.respondida && letra == q.correta.toLowerCase()}">correta</c:when>
                                <c:when test="${letra == q.respondida && letra != q.correta.toLowerCase()}">errada</c:when>
                                <c:when test="${letra == q.correta.toLowerCase()}">correta</c:when>
                                <c:otherwise>neutra</c:otherwise>
                            </c:choose>
                        </c:set>
                        <div class="alternativa ${classe}"><strong>${letra.toUpperCase()}.</strong> ${alternativa}</div>
                    </c:forEach>

                    <div class="comentario">💬 ${q.comentario}</div>
                </div>
            </c:forEach>
        </div>


        <script src="script.js"></script>
        <script src="${pageContext.request.contextPath}/estatisticas/revisao/revisao.js"></script>
    </body>
</html>
