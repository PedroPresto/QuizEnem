
<div class="performance-card">
    <h3>Desempenho</h3>
    <div class="metrics-grid">
        <div class="metric">
            <span class="metric-value questoes">--</span>
            <span class="metric-label questoes">Questões Respondidas</span>
        </div>
        <div class="metric">
            <span class="metric-value taxa">--</span>
            <span class="metric-label taxa">Taxa de Acertos</span>
        </div>
        <div class="metric">
            <span class="metric-value top">--</span>
            <span class="metric-label top">Melhor Matéria</span>
        </div>
    </div>

    <div class="botao-container">
        <button class="botao-switch principal ativo" data-section="geral">GERAL</button>
        <button class="botao-switch principal" data-section="materias">MATÉRIAS</button>
        <button class="botao-switch principal" data-section="resumo">RESUMO</button>
    </div>


    <h4 class="secaoTittle">Seu progresso geral</h4>
   
    <div class="chart-container">
        <div class="chart-scroll">
            <canvas id="performanceChart"></canvas>
        </div>
    </div>
    
     <div class="botao-container secundario">
         <button class="botao-switch sub ativo" data-section="areas" data-sub="areas">ÁREAS</button>
        <button class="botao-switch sub" data-section="materias" data-sub="materias">MATÉRIAS</button>
    </div>


</div>