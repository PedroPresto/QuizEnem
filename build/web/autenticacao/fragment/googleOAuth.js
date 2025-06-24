import { getUserState, toggleLoginState } from '/Quiz-Enem/menu/userState.js';
// Substitua pelo seu Client ID do Google Cloud
const CLIENT_ID = '38814715322-327dbngal89ptbne74bqmfnc8e2e2qtc.apps.googleusercontent.com';


// Função chamada pelo Google quando o usuário faz login
async function handleCredentialResponse(response) {
    const idToken = response.credential;

    await fetch(contextPath + '/loginGoogleJs', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({idToken})
    })
            .then(res => res.json())
            .then(json => {
                if (json.status === 'ok' || json.success) {
                    // 1) Armazenar no mesmo formato do login tradicional
                    // seu servlet pode retornar { status: 'ok', nome, isadmin, ispremium }
                    localStorage.setItem("nome", json.nome);
                    localStorage.setItem("isadmin", json.isadmin);
                    localStorage.setItem("ispremium", json.ispremium);
                    console.log("json ojk");

                    // 2) Mostrar feedback usando a mesma função
                    mostrarToast('success', 'Login realizado com sucesso!');


                } else {
                    // em vez de alert, use a mesma UI de erro
                    mostrarMensagem('error', json.error || 'Falha ao logar com Google.');
                }
            })
            .catch(err => {


            });

    const usuario = await getUserState();
    updateMenuContent(usuario);

}

function mostrarToast(tipo, texto) {
    const Toast = Swal.mixin({
                            toast: true,
                            //theme: 'dark',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                            backdrop: false,
                            showClass: {
                                popup: 'animate__animated animate__fadeInRight animate__faster'
                            },
                            hideClass: {
                                popup: 'animate__animated animate__fadeOutRight animate__faster'
                            },
                            didOpen: (toast) => {
                                toast.onmouseenter = Swal.stopTimer;
                                toast.onmouseleave = Swal.resumeTimer;
                            }
                        });

                        Toast.fire({
                            icon: tipo,
                            title: texto
                        });

    
}

function mostrarMensagem(tipo, texto) {
    const mensagem = document.getElementById('feedback');
    const formLogin = document.getElementById('botaoSubmit');

    mensagem.className = `feedback ${tipo}`;
    mensagem.innerText = texto;
    mensagem.style.display = 'block';
    setTimeout(() => {
        mensagem.style.opacity = 1;
    }, 10);
    if (tipo === "error") {
        // Faz o formulário tremer
        formLogin.classList.add('shake');
        setTimeout(() => {
            formLogin.classList.remove('shake');
        }, 500);

        // Some após alguns segundos
        setTimeout(() => {
            mensagem.style.opacity = 0;
            setTimeout(() => {
                mensagem.style.display = 'none';
            }, 500);
        }, 4000);
    }
}

window.handleCredentialResponse = handleCredentialResponse;