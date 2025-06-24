import { getUserState } from '../../menu/userState.js';

function renderizarAvatar() {
    getUserState().then(usuario => {
        if (!usuario) return;

        const avatarEl = document.getElementById("userAvatar");
        if (!avatarEl) return;

        avatarEl.innerHTML = ""; // Limpa qualquer conteúdo anterior

        if (usuario.foto) {
            const img = document.createElement("img");
            img.src = usuario.foto;
            img.alt = "Avatar";
            avatarEl.appendChild(img);
        } else {
            const span = document.createElement("span");
            span.classList.add("initials-avatar");
            span.textContent = usuario.iniciais || "V";
            avatarEl.appendChild(span);
        }

        // Badge Premium
        if (usuario.isPremium) {
            const badge = document.createElement("span");
            badge.classList.add("status-badge");
            badge.textContent = "Premium";
            avatarEl.appendChild(badge);
        }
    });
}

document.addEventListener("DOMContentLoaded", renderizarAvatar);
