<script>
    import { apiRequest } from './../api/ApiRequest';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { isConnected } from './../store/isConnected';
   

    let username = '';
    let email = '';
    let password = '';
    let repeatPassword = '';
    let errors = { email: '', password: '', username: '', repeatPassword: '' };
    let isLoading = false;
    let IsLoginForm = true;  
    let role = 0;
    let lobbyId =  Math.floor(Math.random() * 4) + 1;
    const isLogin = false;
    let animationName = "";
    let errorLogin = "";

    export let changeDisplay;

    let closeLogin = () => {
        if (typeof changeDisplay === 'function') {
            changeDisplay(); 
        }
    }

    function validate(username, email, password, repeatPassword) {
        errors = {username:'', email: '', password: '', repeatPassword: '' };
        let isValid = true;

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
           
        
        return isValid;
    }


    const login = async () => {
        event.preventDefault();
        if (validate(null, email, password, null)) {
            isLoading = true;

            const formData = {
            email,
            password
            };

            try {
                const data = await apiRequest({
                    token: null,
                    endpoint: `/auth`,
                    method: 'POST',
                    data: formData
                })
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
                email = '';
                password = '';
                isConnected.update();
                window.location.href = '#/';
            }, 1000);
                
            } catch (err) {
                errorLogin = err.message
                console.log(errorLogin);
                setTimeout(() => {
                    isLoading = false;
                    email = '';
                    password = '';
                }, 1000);
                
            }
        }
        
    }
</script>

<h2>Login</h2>
    <section class="login" style={animationName !== "" ? "animationName: hideForm" : ""}> 
        <form on:submit={login}>
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
        <p class="change-display">yout not have a account ? <span role="button" tabindex="0" aria-label="Login" on:click={closeLogin} on:keydown="{(e) => e.key === 'Enter' && closeLogin()}"> Create account !</span></p>
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

<style lang="scss">

    .input-div {
        height: 80px;
        margin-bottom: 1.5rem;
        input {
            width: 250px;
            padding: 10px;
            border-radius: 5px;
        }
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
            margin-bottom: 5px;

            &:hover {
                background-color: #6e3eb6;
            }
        }
    }

    .change-display {
        color: white;
        span {
            color: #e19238;
            cursor: pointer;
            &:hover {
                color: #ffc400;
            }
        }
    }
</style>