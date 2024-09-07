<script>
    import ApiRequest from '../ApiRequest.svelte';
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

    let animationName = ""

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

    function validate() {
        errors = {username:'', email: '', password: '', repeatPassword: '' };
        let isValid = true;
        if (IsLoginForm) {
            if (!password) {
            errors.password = 'Le mot de passe est requis';
            isValid = false;
            }
            if (!email) {
                errors.email = 'L\'email est requis';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                errors.email = 'L\'email est invalide';
                isValid = false;
            }
        }
        

        return isValid;
    }

    function handleSuccess(data) {
        console.log("Réponse de l'API :", data);
        setTimeout(() => {
            isLoading = false;
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
                if (validate()) {
                    isLoading = true;
                    console.log('Form data:', { email, password });
                    apiRequestComponent.makeRequest();
                }
            }
        }
        else {
            if (apiRequestComponent) {
                if (validate()) {
                    isLoading = true;
                    console.log('Form data:', { username, email, password, repeatPassword });
                    apiRequestComponent.makeRequest();
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
                <p class="error">{errors.password}</p>
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

    .loader-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.853);
        z-index: 9999;
    }

    .loader {
        position: relative;
        width: 50px;
        height: 50px;
        animation: rotate 2s linear infinite;
    }

    .wand {
        position: absolute;
        top: 0;
        left: 0;
        width: 5px;
        height: 50px;
        background-color: #8B4513;
        border-radius: 5px;
        animation: wave 1s infinite ease-in-out;
    }

    .sparkles {
        position: absolute;
        top: -20px;
        left: -20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,223,0,1) 0%, rgba(255,0,0,0) 70%);
        animation: sparkle 1s infinite ease-in-out, moveSparkles 2s infinite ease-in-out;
    }

    .loading-text {
        color: #FFD700;
        font-family: 'Lumos', sans-serif;
        margin-top: 20px;
        font-size: 1.5em;
        animation: fadeInOut 3s infinite ease-in-out;
    }

    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes wave {
        0%, 100% {
            transform: rotate(-15deg);
        }
        50% {
            transform: rotate(15deg);
        }
    }

    @keyframes sparkle {
        0% {
            opacity: 0.7;
            transform: scale(0.8);
        }
        50% {
            opacity: 1;
            transform: scale(1.2);
        }
        100% {
            opacity: 0.7;
            transform: scale(0.8);
        }
    }

    @keyframes moveSparkles {
        0% {
            top: -20px;
            left: -20px;
        }
        50% {
            top: -30px;
            left: -30px;
        }
        100% {
            top: -20px;
            left: -20px;
        }
    }

    @keyframes fadeInOut {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
</style>
