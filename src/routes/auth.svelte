<script>
    import ApiRequest from '../api/ApiRequest.svelte'
    import { onMount } from 'svelte';

    let username = '';
    let email = '';
    let password = '';
    let repeatPassword = '';
    let errors = { email: '', password: '', username: '', repeatPassword: '' };
    let isLoading = false;
    let IsLoginForm = true;  
    let role = 0;
    let lobbyId =  Math.floor(Math.random() * 4) + 1;
    const isLogin = JSON.parse(localStorage.getItem('isLogin'));
    
    let animationName = ""
    
    if (isLogin) {
        window.location.href = '/';
    }

    let changeDisplay = () => {
        if (IsLoginForm) {
            animationName = "hideForm";
            IsLoginForm = false;
            let random =  Math.floor(Math.random() * 4) + 1;
            lobbyId = random;
            console.log(lobbyId);
            
        }
        else {
            animationName = "showForm";
            IsLoginForm = true;
        }
    }

    function validate(username, email, password, repeatPassword) {
        errors = {username:'', email: '', password: '', repeatPassword: '' };
        let isValid = true;
        if (IsLoginForm) {
            if (!password) {
                errors.password = 'Le mot de passe est requis.';
                isValid = false;
            }
            if (!email) {
                errors.email = 'L\'email est requis.';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                errors.email = 'L\'email est invalide.';
                isValid = false;
            }
        }
        else {
            if (username !== null) {
                if (!username) {
                errors.username = 'Veuillez choisir un nom d\'utilisateur.'
                isValid = false;
                } else if (username.length < 3) {
                    errors.username = `il manque ${3-username.length} charactères à votre nom d'utilisateur.`
                    isValid = false;
                }
                else if (username.length > 20){
                    errors.username = `il y a ${username.length-20} charactères en trop à votre nom d'utilisateur.`
                    isValid = false;
                }
            }
            
           if (email !== null) {
            if (!email) {
                errors.email = 'L\'email est requis';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                errors.email = 'L\'email est invalide';
                isValid = false;
            }
           }
            if (password !== null) {
                if (!password) {
                    errors.password = 'Le mot de passe est requis.';
                    isValid = false;
                } else if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$/.test(password)) {
                    errors.password = 'Le mot de passe doit contenir au moins 5 caractères, dont une majuscule et un chiffre.';
                    isValid = false;
                }
            }
            
            if (repeatPassword !== null) {
                if (password !== repeatPassword) {
                    errors.repeatPassword = 'Le repeat-password doit être identique au password !'
                    isValid = false;
                }
            }
            
        }
        
        
        return isValid;
    }

    function handleSuccess(data) {
        console.log("Réponse de l'API :", data);
        console.log(data.message);
        if (data.message === "Connexion réussie.") {
            localStorage.setItem('tokens', JSON.stringify({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
            }));
            localStorage.setItem('isLogin', true);
        }
        const tokens = JSON.parse(localStorage.getItem('tokens'));

        
        

        setTimeout(() => {
            isLoading = false;
            window.location.href = '/';
        }, 500);
        
    }

    function handleError(error) {
        console.error("Erreur lors de la requête :", error);
        setTimeout(() => {
            isLoading = false;
        }, 500);
    }

    let apiRequestComponent;

    function handleSubmit(event) {
        event.preventDefault();
        if (IsLoginForm) {
            if (apiRequestComponent) {
                if (validate(null, email, password, null)) {
                    isLoading = true;
                    console.log('Form data:', { email, password });
                    apiRequestComponent.makeRequest();
                }
            }
        }
        else {
            if (apiRequestComponent) {
                if (validate(username, email, password, repeatPassword)) {
                    isLoading = true;
                    console.log('Form data:', { username, email, password, repeatPassword });
                    apiRequestComponent.makeRequest();
                    IsLoginForm = true;
                    username = '';
                    email = '';
                    password = '';
                    repeatPassword = '';
                }
            }
        }
        
    }


    // Fonction pour ajouter une particule
    function addParticle(e) {
        console.log(`Mouse moved at: ${e.pageX}px, ${e.pageY}px`); // Log position

        let cursor = document.getElementById('magic-cursor');
        let particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${e.pageX}px`;
        particle.style.top = `${e.pageY}px`;
        particle.style.width = "15px";
        particle.style.height = "15px";
        particle.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
        particle.style.position = "absolute";
        particle.style.borderRadius = "50%";
        particle.style.zIndex = "1000";

        cursor.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }

    
</script>
{#if !isLogin}
    

<main>
    {#if IsLoginForm}
    <section class="login" style={animationName !== "" ? "animationName: hideForm" : ""}>
        <div id="magic-cursor" on:mousemove={addParticle} role="button" tabindex="0"></div>
        <form on:submit={handleSubmit}>
            <div class="input-div">
                <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    bind:value={email} 
                    placeholder="Email" 
                    required
                >
                {#if errors.email}
                    <p class="error">{errors.email}</p>
                {/if}
            </div>

            <div class="input-div">
                <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    bind:value={password} 
                    placeholder="Mot de passe" 
                    required
                >
                {#if errors.password}
                    <p class="error">{errors.password}</p>
                {/if}
            </div>

            <input type="submit" value="Connecter">
        </form>
        <p class="change-display">yout not have a account ? <a href="#" on:click={changeDisplay}> Create account !</a></p>
    </section>
    {/if}

    {#if isLoading}
        <div class="loader-container">
            <div class="loader">
                <div class="wand"></div>
                <div class="sparkles"></div>
            </div>
            <p class="loading-text">Chargement... ⚡</p>
        </div>
    {/if}

    <ApiRequest
        bind:this={apiRequestComponent}
        method="POST"
        endpoint="/auth"
        data={{ email, password }}
        onSuccess={handleSuccess}
        onError={handleError}
    />
    

{#if !IsLoginForm}
<section>
    <form on:submit={handleSubmit}>
        <div class="input-div">
            <input 
                type="text" 
                name="username" 
                id="username" 
                bind:value={username} 
                on:keyup={validate(username, null, null, null)}
                placeholder="Username" 
                required
            >
            {#if errors.username}
                <p class="error">{errors.username}</p>
            {/if}
        </div>
        <div class="input-div">
            <input 
                type="email" 
                name="email" 
                id="email" 
                bind:value={email} 
                placeholder="Email" 
                required
            >
            {#if errors.email}
                <p class="error">{errors.email}</p>
            {/if}
        </div>
        <div class="input-div">
            <input 
                type="password" 
                name="password" 
                id="paswword" 
                bind:value={password} 
                placeholder="Password" 
                required
            >
            {#if errors.password}
                <p class="error">{errors.password}</p>
            {/if}
        </div>
        <div class="input-div">
            <input 
                type="password" 
                name="repeat-password" 
                id="repeat-password" 
                bind:value={repeatPassword} 
                placeholder="Reapeat-password" 
                required
            >
            {#if errors.password}
                <p class="error">{errors.repeatPassword}</p>
            {/if}
        </div>
        <input type="submit" value="Register">
        <p class="change-display">You have a account ? <a href="#" on:click={changeDisplay}> Login !</a></p>
    </form>
</section>
{#if isLoading}
<div class="loader-container">
    <div class="loader">
        <div class="wand"></div>
        <div class="sparkles"></div>
    </div>
    <p class="loading-text">Chargement... ⚡</p>
</div>
{/if}

<ApiRequest
bind:this={apiRequestComponent}
method="POST"
endpoint="/registre"
data={{ username, email, password, repeatPassword, role, lobbyId }}
onSuccess={handleSuccess}
onError={handleError}
/>
{/if}
</main>
{/if}
<style lang="scss">
    #magic-cursor {
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        width: 100vw;
        height: 100vh;
        overflow: hidden; /* Assurez-vous que les particules ne débordent pas */
        border: 1px solid red; /* Bordure temporaire pour débogage */
    }

    .particle {
        position: absolute;
        width: 15px;  /* Taille augmentée */
        height: 15px; /* Taille augmentée */
        border-radius: 50%;
        background-color: rgba(255, 0, 0, 0.8); /* Couleur plus visible */
        pointer-events: none;
        animation: fadeOut 1s forwards;
        z-index: 1000; /* Assurez-vous que les particules sont visibles */
    }

    @keyframes fadeOut {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(2);
        }
    }

    .input-div {
        height: 80px;
        margin-bottom: 1.5rem;
        input {
            width: 250px;
            padding: 10px;
            border-radius: 5px;
        }
    }

    .error {
        color: red;
        font-size: 0.9em;
        margin-top: 0.5rem;
    }

    form {
        width: 300px;
        display: flex;
        flex-direction: column;

        input[type="submit"] {
            background-color: #6f00ff;
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
            border-radius: 5px;
            transition: ease-out 0.3s;

            &:hover {
                background-color: #6e3eb6;
            }
        }
    }

    .change-display {
        color: white;
        a {
            color: #6f00ff;
            cursor: pointer;
            &:hover {
                color: #6e3eb6;
            }
        }
    }

    
</style>
