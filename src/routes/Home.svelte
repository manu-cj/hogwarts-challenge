<script>
	import AddPost from './../components/AddPost.svelte';
	import NavBar from './../components/NavBar.svelte';
    import Messages from './../components/Messages.svelte';
    import { onMount } from 'svelte';
    import { apiRequest } from './../api/ApiRequest';
    import axios from 'axios';
    import Gryffindor from './../assets/house/Gryffindor-removebg-preview.png'
    import Hufflepuff from './../assets/house/hufflepuff-removebg-preview.png'
    import Ravenclaw from './../assets/house/ravenclaw-removebg-preview.png'
    import Slytherin from './../assets/house/slytherin-removebg-preview.png'
    import { tokenStore, updateAccessToken } from './../store/tokenStore.js'
    import { io } from "socket.io-client";
  
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    let user = null;
    let error = null;
    let acceuil = "acceuil";
    let housePicture = "";
    let lobbyUser = '';
    let myTheme = { colors: { primary: "#666666", secondary: "#777777", background: "#1e1e1e", text: "#cccccc" } };
    let tokenIsRefresh = false
    let socket;

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
            background: "none",
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

        socket = io("http://localhost:5000");
        socket.emit('joinLobby', { lobby_id: lobbyUser });

        socket.on('joinLobby', (lobbyUser) => {
            console.log('joinLobby :', lobbyUser);
        });
      } catch (err) {
        error = err.message;
        loading = false;
        setTimeout(() => {
            window.location.href = '#/';
        }, 100); 


        if (error === "Token expiré, fais une requète pour refresh le token.") {
            refreshToken(
                (data) => {
                    console.log('Token rafraîchi avec succès:', data);
                    error = null;
                    tokenIsRefresh === false ? tokenIsRefresh = true: tokenIsRefresh = false;
                    setTimeout(() => {
                        window.location.href = '#/';
                    }, 100);  
                    
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
                updateAccessToken(newAccessToken, tokens.refreshToken);
            }
               console.log(response.data);
               
                window.location.reload();
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
    <NavBar/> 
{#if user}
   

    <Messages {user} {myTheme} {housePicture} />
{:else if error}
<div class="loader-container">
        <div class="loader">
            <div class="wand"></div>
            <div class="sparkles"></div>
        </div>
        <p class="loading-text">Chargement... ⚡</p>
    </div>
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
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        gap: 10px;
    }
</style>