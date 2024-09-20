<script>
	import NavBar from './../components/NavBar.svelte';
	import Register from './../components/Register.svelte';
	import Login from './../components/Login.svelte';

    import { onMount } from 'svelte';

    let IsLoginForm = true;  
    const isLogin = JSON.parse(localStorage.getItem('isLogin'));
    
    let animationName = ""
    
    if (isLogin) {
        const tokens = JSON.parse(localStorage.getItem('tokens'));
        if (tokens) {
            window.location.href = '/';
        }
    }

    let changeDisplay = () => {
        IsLoginForm === true ? IsLoginForm = false : IsLoginForm = true;
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
    
<NavBar/>
<main>
    {#if IsLoginForm}
    <Login {changeDisplay}/>
    {:else}
    <Register {changeDisplay}/>
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

    main {
     width: 100%;
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     gap: 30px;
     min-height: 100vh;
    }

    
</style>
