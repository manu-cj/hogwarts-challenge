<script>
    import Messages from './../components/Messages.svelte';
    import { onMount } from 'svelte';
    import { apiRequest } from './../api/ApiRequest';
    import axios from 'axios';
    import Gryffindor from './../assets/house/Gryffindor-removebg-preview.png'
    import Hufflepuff from './../assets/house/hufflepuff-removebg-preview.png'
    import Ravenclaw from './../assets/house/ravenclaw-removebg-preview.png'
    import Slytherin from './../assets/house/slytherin-removebg-preview.png'

  
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    let user = null;
    let error = null;
    let acceuil = "acceuil";
    let housePicture = "";
    let lobbyUser = '';
    let myTheme = { colors: { primary: "#666666", secondary: "#777777", background: "#1e1e1e", text: "#cccccc" } };


    const theme = (lobbyUser) => {
    let baseTheme;

    switch (lobbyUser) {
        case 1: 
        acceuil = "Gryffindor";
        housePicture = Gryffindor;
        baseTheme = {
            colors: {
            primary: "#6e1414",   
            secondary: "#8B5B29", 
            background: "#1e1e1e",
            text: "#cccccc",
            },
        };
        break;
        case 2: 
        acceuil = "Ravenclaw";
        housePicture = Ravenclaw;
        baseTheme = {
            colors: {
            primary: "#545bdbd1",  
            secondary: "#3b4a6b", 
            background: "#1e1e1e",
            text: "#cccccc",
            },
        };
        break;
        case 3: 
        acceuil = "Hufflepuff";
        housePicture = Hufflepuff;
        baseTheme = {
            colors: {
            primary: "#a6981b",   
            secondary: "#6d6d6d", 
            background: "#1e1e1e",
            text: "#cccccc",
            },
        };
        break;
        case 4: 
        acceuil = "Slytherin";
        housePicture = Slytherin;
        baseTheme = {
            colors: {
            primary: "#17642b",  
            secondary: "#2c3e50", 
            background: "#1e1e1e",
            text: "#cccccc",
            },
        };
        break;
        default:
        baseTheme = {
            colors: {
            primary: "#666666",   
            secondary: "#777777",
            background: "#1e1e1e",
            text: "#cccccc",
            },
        };
        break;
    }

    return baseTheme;
    }; 
  
    const getDataUser = async () => {
      try {
        const data = await apiRequest({
          token: tokens.accessToken,
          endpoint: `/get-user`,
          method: 'GET'
        });
        user = {
          _id: data._id,
          email: data.email,
          username: data.username,
          lobbyId: data.lobbyId
        };
        loading = false;
        lobbyUser = user.lobbyId;
        myTheme = theme(lobbyUser);
      } catch (err) {
        error = err.message;
        loading = false;
        if (error === "Token expiré, fais une requète pour refresh le token.") {
            refreshToken(
                (data) => {
                    console.log('Token rafraîchi avec succès:', data);
                    error = null
                    window.location.href = '#/';
                },
                (error) => {
                    console.error('Erreur lors du rafraîchissement du token:', error.response ? error.response.data : error.message);
                }
            );
        }
      }
    };

    let refreshToken = async (onSuccess, onError) => {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const endpoint = '/refresh-token';
        const url = `${baseURL}${endpoint}`;
        const method = 'POST';
        const data = { refreshToken: tokens.refreshToken };

        try {
            const response = await axios({
                method,
                url,
                data,
            });

            const newAccessToken = response.data.accessToken;
            if (newAccessToken) {
                const existingTokens = JSON.parse(localStorage.getItem('tokens')) || {};
                localStorage.setItem('tokens', JSON.stringify({
                    ...existingTokens,
                    accessToken: newAccessToken
                }));
            }

                if (onSuccess) {
                    onSuccess(response.data);
                }
        }   catch (error) {
                if (onError) {
                    onError(error);
                } else {
                    console.error('Erreur lors du rafraîchissement du token:', error.response ? error.response.data : error.message);
                }
        }
    }
  
    onMount(() => {
      getDataUser();
    });

    let loading = true
  </script>
  
<main style="background-color: {myTheme.colors.primary};">
    <h1>{acceuil}</h1>
    <img src={housePicture} alt={acceuil} width="120px">
{#if user}
    <Messages {user} {myTheme} />
{:else if error}
    <p>Erreur : {error}</p>
{/if}
{#if loading}
    <div class="loader-container">
        <div class="loader">
            <div class="wand"></div>
            <div class="sparkles"></div>
        </div>
        <p class="loading-text">Chargement... ⚡</p>
    </div>
{/if}
</main>

<style lang="scss">
    main {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        gap: 30px;
    }
</style>