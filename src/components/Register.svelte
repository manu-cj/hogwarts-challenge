<script>
    import { apiRequest } from './../api/ApiRequest';
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
    let errorRegister = "";
    let animationName = ""

    export let changeDisplay;

    let register = async () => {
        event.preventDefault();
        if (validate(username, email, password, repeatPassword)) {
            isLoading = true;
            let random =  Math.floor(Math.random() * 4) + 1;
            lobbyId = random;

            const formData = {
                username,   
                email,
                password,
                repeatPassword,
                role,
                lobbyId
            };

            try {
                const data = await apiRequest({
                    token: null,
                    endpoint: `/register`,
                    method: 'POST',
                    data: formData
                })

                console.log(data.message);  
                isLoading = false;
                username = '';
                email = '';
                password = '';
                repeatPassword = '';
                
            } catch (err) {
                errorRegister = err.message
                console.log(errorRegister);               
            }
        }

    }

    function validate(username, email, password, repeatPassword) {
        errors = {username:'', email: '', password: '', repeatPassword: '' };
        let isValid = true;


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
       
        return isValid;
    }

    let closeRegister = () => {
        if (typeof changeDisplay === 'function') {
            changeDisplay(); 
        }
    }
</script>
    <h2>Register</h2>
    <section>
        <form on:submit={register}>
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
            <p class="change-display">You have a account ? <span role="button" tabindex="0" aria-label="Login" on:click={closeRegister} on:keydown="{(e) => e.key === 'Enter' && closeRegister()}">Login !</span></p>
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
    


<style lang="scss">
    main {
     width: 100%;
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     gap: 30px;
     min-height: 100vh;
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