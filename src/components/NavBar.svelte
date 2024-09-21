<script>
    import Granim from 'granim';
    import { isConnected } from './../store/isConnected';
    import { link } from 'svelte-spa-router';
    import { onMount } from 'svelte';

    $: isConnected;

    onMount(() => {
        const granimInstance = new Granim({
            element: '#granim-canvas',
            name: 'granim',
            direction: 'top-bottom',
            opacity: [1, 1],
            isPausedWhenNotInView: true,
            states: {
                "default-state": {
                    gradients: [
                ['#c5c6c7', '#556270'],
                ['#c5c6c7', '#556270'],
                ['#556270', '#c5c6c7'],
                ['#556270', '#c5c6c7']
            ],
                    transitionSpeed: 1500
                }
                
            }
        });
    });
</script>

<header>
    <canvas id="granim-canvas"></canvas>
    <a href="/" use:link>Hogward-House</a>
    <nav>
        <a href="/" use:link>Accueil</a>
        {#if !$isConnected}
        <a href="/auth" use:link>Authentification</a>
        {/if}
        {#if $isConnected}
        <a href="/logout" use:link>Logout</a>
        {/if}
    </nav>
</header>
<div>
    <img src={"./../upload/{image.name}"} alt="">
</div>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css2?family=Vollkorn+SC:wght@400;600;700;900&display=swap');
    header {
        position: relative;
        width: 100%;
        height: 70px;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        background-color: rgba(121, 121, 121, 0.178);
        color: #ECF0F1;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
       

        #granim-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            
        }

        a {
            color: #ECF0F1; 
            text-decoration: none;
            font-family: "Vollkorn SC", serif;
            font-weight: 600;
            font-style: normal;
            font-size: 18px;
            transition: all 0.3s ease;

            &:hover {
                scale: 1.1;
                color: #cd8005; 
            }
        }

        nav {
            display: flex;
            gap: 20px;
            
        }
    }
</style>
