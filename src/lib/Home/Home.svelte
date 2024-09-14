<script>
    import { onMount } from 'svelte';  // Import de onMount pour l'appel après montage du composant
    import ApiRequest from './../ApiRequest.svelte';
    import axios from 'axios';
    import Gryffindor from './../../assets/house/Gryffindor-removebg-preview.png'
    import Hufflepuff from './../../assets/house/hufflepuff-removebg-preview.png'
    import Ravenclaw from './../../assets/house/ravenclaw-removebg-preview.png'
    import Slytherin from './../../assets/house/slytherin-removebg-preview.png'

    let page = 1;
    let limit = 10;
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    const user = JSON.parse(localStorage.getItem('user'));
    const lobbyUser = user.lobbyId
    let allMessages = [];
    let filteredMessages;
    let acceuil = "acceuil";
    let housePicture = "";
    
    let apiRequestComponent;
    let getUserData;

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

    const myTheme = theme(4); 
    console.log(myTheme);


    if (!tokens || !tokens.accessToken) {
        console.error('Le token n\'a pas été trouvé dans le localStorage.');
    } else {
        console.log('Token trouvé:', tokens.accessToken);
    }

    let handleSuccess = (data) => {
        console.log("Réponse de l'API :", data.messages);
        console.log(data);
        allMessages = data.messages
        filteredMessages = allMessages.filter(message => message.lobby_id === lobbyUser)
    }
    let handleError = (data) => {
        console.log("Réponse de l'API :", data.response.data.message);
        if (data.response.data.message === "Token expiré, fais une requète pour refresh le token.") {
            refreshToken(
                (data) => {
                    console.log('Token rafraîchi avec succès:', data);
                    window.location.href = '/';
                },
                (error) => {
                    console.error('Erreur lors du rafraîchissement du token:', error.response ? error.response.data : error.message);
                }
            );
        }
    }

    let refreshToken = async (onSuccess, onError) => {
    const url = 'http://localhost:5000/api/refresh-token';
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
    } catch (error) {
        if (onError) {
            onError(error);
        } else {
            console.error('Erreur lors du rafraîchissement du token:', error.response ? error.response.data : error.message);
        }
    }
}

    onMount(() => {
        if (apiRequestComponent && apiRequestComponent.makeRequest) {
            apiRequestComponent.makeRequest();
        } else {
            console.error('La méthode makeRequest n\'existe pas sur le composant.');
        }

        if (tokens) {
        if (getUserData) {
            // Appel après la mise à jour du localStorage
            getUserData.makeRequest();
        }
    }
    });
    

    function getMostRecentDate(created_at, updated_at) {

        const createdAtDate = new Date(created_at);
        const updatedAtDate = new Date(updated_at);

        if (createdAtDate >= updatedAtDate) {
            return `Créé le ${createdAtDate.toLocaleString()}`;
        } else {
            return `Mis à jour le ${updatedAtDate.toLocaleString()}`;
        }
    }

    let getUserSuccess = (data) => {
        console.log("Réponse de l'API :", data);
        localStorage.setItem("user", JSON.stringify({
            _id: data._id,
            email: data.email,
            username: data.username,
            lobbyId: data.lobbyId
        }));
    }

    let getUserError = (data) => {
        console.log(tokens);
        
        console.log(data.response.data.message);
        
    }
   
</script>
<main style="background-color: {myTheme.colors.primary};">
    <h1>{acceuil}</h1>
    <img src={housePicture} alt={acceuil}>
    <p>Bienvenue {user.username} !</p>
    <section class="messages">
        {#each allMessages as message}

        {#if filteredMessages.length === 0}
            <p>Aucun message trouvé pour ce lobby.</p>
        {:else}
            {#each filteredMessages as message}
                <article class="message" style="background-color: {myTheme.colors.background}; border-color: {myTheme.colors.secondary};">
                    <div class="message-header" style="background-color: {myTheme.colors.primary};">
                        <p class="author">Author : <span>{message.author}</span></p>
                        <p>  {getMostRecentDate(message.createdAt, message.updatedAt)}</p>   
                    </div>
                    <div class="message-content">
                        <h3>{message.sujet}</h3>
                        <blockquote>{message.message}</blockquote>
                    </div>
                </article>
            {/each}
        {/if}
        {/each}
    </section>
</main>



<ApiRequest
    bind:this={apiRequestComponent}  
    method="GET"
    endpoint={`/get-lobby-messages?page=${page}&limit=${limit}`}
    headers={{ 
        Authorization: `Bearer ${tokens.accessToken}`  
    }}
    onSuccess={handleSuccess}
    onError={handleError}
/>

<ApiRequest
    bind:this={getUserData}  
    method="GET"
    endpoint={`/get-user`}
    headers={{ 
        Authorization: `Bearer ${tokens.accessToken}`
    }}
    onSuccess={getUserSuccess}
    onError={getUserError}
/>

<style lang="scss">
main {
     width: 100%;
     display: flex;
     flex-direction: column;
     justify-content: start;
     align-items: center;
     gap: 30px;

}
.messages {
    width: 75%;
    padding: 15px 30px;
    min-height: 70vh;
    max-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    gap: 40px;
    background: rgba( 255, 255, 255, 0.25 );
    box-shadow: 0 8px 32px 0 rgba(149, 149, 149, 0.37);
    backdrop-filter: blur( 6px );
    -webkit-backdrop-filter: blur( 6px );
    border-radius: 10px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
}
.message {
    width: 80%;
    height: 150px;
    border: 3px solid;
    border-radius: 5px;
    box-shadow: 0 8px 32px 0 rgba(151, 147, 19, 0.37);
    backdrop-filter: blur( 6px );
    -webkit-backdrop-filter: blur( 6px );
    border-radius: 10px;

    .message-header {
        width: 100%;
        height: 30px;
        padding-left: 5px;
        padding-right: 5px;
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
        display: flex;
        justify-content: space-between;

        .author {
            span {
                font-weight: bold;
            } 
        }
    }
}    
</style>