<div class="question-text">
    <p><%= session.getAttribute("enunciado")%></p>



    <%
        String anexo = (String) session.getAttribute("anexoTexto");
        boolean modoAdmin = "admin".equals(request.getParameter("materia")); // ou use um atributo melhor
        if (anexo != null && !anexo.trim().isEmpty()) {
    %>
    <div class="anexo-wrapper <%= modoAdmin ? "expanded" : "" %>" onclick="toggleAnexo(this)">
    <div class="anexo-header">
        <span>Texto de Apoio</span>
        <svg class="anexo-icon" xmlns="http://www.w3.org/2000/svg" fill="none" 
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
        </svg>
    </div>
    <div class="anexo-body" 
         <%= modoAdmin ? "style='max-height:500px; padding:8px 16px 16px;'" : "" %>>
        <%= anexo.replaceAll("\\\\", "\\\\").replaceAll("\n", "<br/>") %>
    </div>
</div>

    <%
        }
    %>




</div>

<div class="options">
    <label class="option">
        <input type="radio" name="answer" value="a">
            <span class="option-text">
                <span class="option-letter">A</span>
                <%= session.getAttribute("opcaoA")%>
            </span>
    </label>

    <label class="option">
        <input type="radio" name="answer" value="b">
            <span class="option-text">
                <span class="option-letter">B</span>
                <%= session.getAttribute("opcaoB")%>
            </span>
    </label>

    <label class="option">
        <input type="radio" name="answer" value="c">
            <span class="option-text">
                <span class="option-letter">C</span>
                <%= session.getAttribute("opcaoC")%>
            </span>
    </label>

    <label class="option">
        <input type="radio" name="answer" value="d">
            <span class="option-text">
                <span class="option-letter">D</span>
                <%= session.getAttribute("opcaoD")%>
            </span>
    </label>

    <label class="option">
        <input type="radio" name="answer" value="e">
            <span class="option-text">
                <span class="option-letter">E</span>
                <%= session.getAttribute("opcaoE")%>
            </span>
    </label>
</div>

<div class="question-footer">
    <button class="btn btn-outline" id="voltarButton" onclick="anterior()">Anterior</button>
    <button class="btn btn-primary" onclick="checkAnswer()">Checar Resposta</button>
    <button class="btn btn-outline" id="avancarButton" onclick="avancar()">Próxima</button>
</div>

<%
    String comentarioQuestao = (String) session.getAttribute("comentarioQuestao");
    modoAdmin = "admin".equals(request.getParameter("materia")); // já detecta o modo
    if (comentarioQuestao != null && !comentarioQuestao.trim().isEmpty()) {
%>
<div class="anexo-wrapper <%= modoAdmin ? "expanded" : "" %>" 
     <%= modoAdmin ? "" : "onclick=\"toggleAnexo(this)\"" %>>
    <div class="anexo-header">
        <span>Comentário da questão</span>
        <svg class="anexo-icon" xmlns="http://www.w3.org/2000/svg" fill="none" 
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
        </svg>
    </div>
    <div class="anexo-body" 
         <%= modoAdmin ? "style='max-height:500px; padding:8px 16px 16px;'" : "" %>>
        <%= comentarioQuestao.replaceAll("\\\\", "\\\\").replaceAll("\n", "<br/>") %>
    </div>
</div>
<%
    }
%>



<script>
    document.body.classList.add("loading");

    window.addEventListener("load", () => {
        const spinner = document.getElementById("loadingSpinner");

        // Garante que o layout já foi pintado antes de remover
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (spinner) {
                    spinner.classList.add("fade-out");

                    setTimeout(() => {
                        spinner.style.display = "none";
                        document.body.classList.remove("loading");
                    }, 400);
                }
            });
        });
    });
</script>



