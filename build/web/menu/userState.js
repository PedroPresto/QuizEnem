// This file manages the user state for the menu

// Default user state
let userState = {
    isLoggedIn: true,
    username: 'Visitante',
    avatar: null, // Could be an image URL
    isPremium: false,
    isAdmin: false
};

// Get the current user state
export async function getUserState() {
    console.log("getUserState ativado");
    try {
        const response = await fetch(`${contextPath}/usuario-info`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
        if (data.status === 'ok' && data.usuarioLogado) {
            const usuario = data.usuarioLogado;

            // 🧠 Gera as iniciais
            const iniciais = gerarIniciais(usuario.nome);

            updateUserState({
                isLoggedIn: true,
                username: usuario.nome,
                avatar: usuario.foto || null,
                isPremium: usuario.ispremium,
                isAdmin: usuario.isadmin,
                email: usuario.email,
                id: usuario.id,
                datacadastro: usuario.datacadastro,
                iniciais // ✅ salvando aqui
            });

            return {
                ...usuario,
                iniciais,
                isLoggedIn: true
            };
        } else {
            updateUserState({
                isLoggedIn: false,
                username: 'Visitante',
                isPremium: false,
                iniciais: 'V'
            });
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar estado do usuário:', error);
        return null;
    }
}



// Update the user state
export function updateUserState(newState) {
    userState = {...userState, ...newState};

    // Dispatch an event to notify about the state change
    const event = new CustomEvent('userStateChanged', {
        detail: {
            previousState: userState,
            currentState: {...userState}
        }
    });
    window.dispatchEvent(event);

    return userState;
}

// Toggle login state
export function toggleLoginState() {
    const newState = {
        isLoggedIn: !userState.isLoggedIn
    };

    // If logging out, reset user data
    if (!newState.isLoggedIn) {
        newState.username = 'Visitante';
        newState.isPremium = false;
    } else {
        // If logging in, set default user data
        newState.username = 'Pedro Presto';
    }

    return updateUserState(newState);
}

// Toggle premium status
export function togglePremiumStatus() {
    if (!userState.isLoggedIn) {
        console.warn('Cannot toggle premium status for logged out user');
        return userState;
    }

    return updateUserState({
        isPremium: !userState.isPremium
    });
}

// Initialize user state from localStorage (if needed)
export function initUserState() {
    const savedState = localStorage.getItem('userState');
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            userState = {...userState, ...parsedState};
        } catch (e) {
            console.error('Failed to parse saved user state', e);
        }
    }
    return userState;
}

// Save user state to localStorage (if needed)
export function saveUserState() {
    localStorage.setItem('userState', JSON.stringify(userState));
    return userState;
}

function gerarIniciais(nome) {
    return nome
        .split(' ')
        .filter(Boolean)
        .map(p => p[0])
        .join('')
        .toUpperCase();
}
