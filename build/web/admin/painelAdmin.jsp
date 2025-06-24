<!DOCTYPE html>
<html lang="pt-BR" data-theme="dark">
    <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Adicionar Questões ENEM</title>
        <meta name="description" content="Interface para adicionar questões do ENEM" />    
        <link rel="stylesheet" href="painelAdmin.css"
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    </head>
    <body>      
         
            
        <div id="app">
            <header>
                <h1><%
                model.Usuario usuario = (model.Usuario) session.getAttribute("usuarioLogado");
                if (usuario != null) {
                    out.print("Usuário logado: " + usuario.getNome());
                   
                }
                %></h1> 
               
             
            </header>

            <form id="questionForm">
                <div class="form-section">
                    <div class="form-group">
                        <label for="subject">Matéria</label>
                        <select id="subject" name="subject" required>
                            <option value="">Selecione a matéria</option>
                            <option value="matematica">Matemática</option>
                            <option value="portugues">Português</option>
                            <option value="historia">História</option>
                            <option value="geografia">Geografia</option>
                            <option value="fisica">Física</option>
                            <option value="quimica">Química</option>
                            <option value="biologia">Biologia</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="year">Ano da Questão</label>
                        <input type="number" id="year" name="year" min="1998" max="2025" required placeholder="Ex: 2024">
                    </div>

                    <div class="form-group">
                        <label for="statement">Enunciado da Questão</label>
                        <textarea id="statement" name="statement" rows="4" required placeholder="Digite o enunciado da questão..."></textarea>
                    </div>

                    <div class="form-group">
                        <label for="supportText">Texto de Apoio (opcional)</label>
                        <textarea id="supportText" name="supportText" rows="3" placeholder="Digite o texto de apoio (se houver)..."></textarea>
                    </div>
                </div>

                <div class="form-section">
                    <h2 class="alternatives-title">Alternativas</h2>

                    <div class="alternatives-section">
                        <div class="alternative-input">
                            <label>Alternativa A</label>
                            <textarea name="alternative_a" rows="2" required placeholder="Digite a alternativa A..."></textarea>
                        </div>

                        <div class="alternative-input">
                            <label>Alternativa B</label>
                            <textarea name="alternative_b" rows="2" required placeholder="Digite a alternativa B..."></textarea>
                        </div>

                        <div class="alternative-input">
                            <label>Alternativa C</label>
                            <textarea name="alternative_c" rows="2" required placeholder="Digite a alternativa C..."></textarea>
                        </div>

                        <div class="alternative-input">
                            <label>Alternativa D</label>
                            <textarea name="alternative_d" rows="2" required placeholder="Digite a alternativa D..."></textarea>
                        </div>

                        <div class="alternative-input">
                            <label>Alternativa E</label>
                            <textarea name="alternative_e" rows="2" required placeholder="Digite a alternativa E..."></textarea>
                        </div>
                    </div>

                    <div class="correct-answer-section">
                        <label>Alternativa Correta</label>
                        <div class="correct-answer-options">
                            <label class="correct-alternative-label">
                                <input type="radio" name="correct_answer" value="A" required>
                                <div class="correct-alternative-option">
                                    <span>A</span>
                                </div>
                            </label>
                            <label class="correct-alternative-label">
                                <input type="radio" name="correct_answer" value="B" required>
                                <div class="correct-alternative-option">
                                    <span>B</span>
                                </div>
                            </label>
                            <label class="correct-alternative-label">
                                <input type="radio" name="correct_answer" value="C" required>
                                <div class="correct-alternative-option">
                                    <span>C</span>
                                </div>
                            </label>
                            <label class="correct-alternative-label">
                                <input type="radio" name="correct_answer" value="D" required>
                                <div class="correct-alternative-option">
                                    <span>D</span>
                                </div>
                            </label>
                            <label class="correct-alternative-label">
                                <input type="radio" name="correct_answer" value="E" required>
                                <div class="correct-alternative-option">
                                    <span>E</span>
                                </div>
                            </label>
                        </div>
                    </div>
                

                <div class="form-actions">
                    <button type="button" id="clearForm" class="clear-button">
                        Limpar Formulário
                    </button>
                    <button type="submit" class="submit-button">
                        Salvar e Adicionar Nova
                    </button>
                </div>
                    </div>
            </form>
        </div>
        <!-- Botão Flutuante -->
        <button class="menu-button" id="menuBtn"><i class="fas fa-bars"></i></button>

        <!-- Menu Flutuante em Tela Cheia -->
        <jsp:include page="/WEB-INF/jsp/menu/menu.jsp" />
        
        <script src="painelAdmin.js" defer></script>
    </body>
</html>