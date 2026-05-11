// auth.js - Sistema de Autenticação da Teia

// Verificar se o usuário está logado
function isAuthenticated() {
    const userData = localStorage.getItem('teiaUser');
    return userData !== null;
}

// Obter dados do usuário logado
function getCurrentUser() {
    const userData = localStorage.getItem('teiaUser');
    return userData ? JSON.parse(userData) : null;
}

// Fazer logout
function logout() {
    localStorage.removeItem('teiaUser');
    window.location.href = 'index.html';
}

// Proteger página (redirecionar para login se não estiver logado)
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Redirecionar usuário logado para dashboard (para páginas como login/cadastro)
function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return true;
    }
    return false;
}

// Atualizar navegação baseada no status de login
function updateNavigation() {
    const nav = document.querySelector('nav ul');
    if (!nav) return;

    if (isAuthenticated()) {
        // Usuário logado - substituir Login por Dashboard
        const loginLink = nav.querySelector('a[href="login.html"]');
        if (loginLink) {
            const li = loginLink.parentElement;
            // Preservar classe active se existir
            const isActive = loginLink.classList.contains('active');
            li.innerHTML = `<a href="dashboard.html"${isActive ? ' class="active"' : ''}>Dashboard</a>`;
        }
        
        // Adicionar botão de logout se não existir
        if (!nav.querySelector('.logout-btn')) {
            const logoutLi = document.createElement('li');
            logoutLi.innerHTML = '<a href="#" class="logout-btn" onclick="confirmLogout()">Sair</a>';
            nav.appendChild(logoutLi);
        }
    } else {
        // Usuário não logado - substituir Dashboard por Login
        const dashboardLink = nav.querySelector('a[href="dashboard.html"]');
        if (dashboardLink) {
            const li = dashboardLink.parentElement;
            // Preservar classe active se existir
            const isActive = dashboardLink.classList.contains('active');
            li.innerHTML = `<a href="login.html"${isActive ? ' class="active"' : ''}>Login</a>`;
        }
        
        // Remover botão de logout se existir
        const logoutBtn = nav.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.parentElement.remove();
        }
    }
}

// Confirmar logout
function confirmLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        logout();
    }
}

// Inicializar autenticação quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
});

export {
    isAuthenticated,
    getCurrentUser,
    logout,
    requireAuth,
    redirectIfAuthenticated,
    updateNavigation,
    confirmLogout
}