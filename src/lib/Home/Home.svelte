<script>
    import { onMount } from 'svelte';  // Import de onMount pour l'appel après montage du composant
    import ApiRequest from './../ApiRequest.svelte';
    import axios from 'axios';
    import Gryffindor from './../../assets/house/Gryffindor-removebg-preview.png'
    import Hufflepuff from './../../assets/house/hufflepuff-removebg-preview.png'
    import Ravenclaw from './../../assets/house/ravenclaw-removebg-preview.png'
    import Slytherin from './../../assets/house/slytherin-removebg-preview.png'
    import pencil from './../../assets/icons/pencil-alt-solid.svg';
    import trash from './../../assets/icons/trash-alt-solid.svg';


    let page = 1;
    let limit = 10;
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    const user = JSON.parse(localStorage.getItem('user'));
    const lobbyUser = user.lobbyId
    let allMessages = [];
    let filteredMessages;
    let acceuil = "acceuil";
    let housePicture = "";
    let order = "ASC";
    
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

    const myTheme = theme(3); 
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
            return `Create : ${createdAtDate.toLocaleString()}`;
        } else {
            return `Update : ${updatedAtDate.toLocaleString()}`;
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
   let pencilColor = "white";
</script>
<main style="background-color: {myTheme.colors.primary};">
    <h1>{acceuil}</h1>
    <img src={housePicture} alt={acceuil} width="120px">
    <p>Bienvenue {user.username} !</p>
    <section class="messages">
        <div class="control-section">
            <input type="search" name="search" id="search"  placeholder="Search">
            <div class="control-group">
                {#if order === "ASC"}
                <button on:click={() => {order = "DESC"}}>
                    Order 🔺
                </button>
                {:else}
                    <button on:click={() => { order = "ASC"}}>
                        Order 🔻
                    </button>
                {/if}
                
                <button>New topic</button>
            </div>
            
        </div>
        {#each allMessages as message}

        {#if filteredMessages.length === 0}
            <p>Aucun message trouvé pour ce lobby.</p>
        {:else}
            {#each filteredMessages as message}
                <article class="message" style="background-color: {myTheme.colors.background}; border-color: {myTheme.colors.secondary};">
                    <div class="message-header" style="background-color: {myTheme.colors.primary};">
                        <p class="author">Author : <span>{message.author}</span></p>
                        <p>{getMostRecentDate(message.createdAt, message.updatedAt)}</p>   
                    </div>
                    <div class="message-content">
                        <div class="control">
                            {#if user._id !== message.author_id}
                                <img class="pencil" src={pencil} alt="pencil" width="15px">
                                <img class="trash" src={trash} alt="trash" width="15px">
                            {/if}
                        </div>
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

    .control-section {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        gap: 30px;

        input[type=search] {
            width: 300px;
            height: 40px;
            padding: 5px;
            border-radius: 5px;
            background-color: rgba(255, 255, 255, 0.315);
            border: 1px #FFD700 solid;
            transition: all 0.3s ease-out;
            
            &:hover, &:focus {
                scale: 1.05;
                box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
            }
        }
        .control-group {
            width: 75%;
            display: flex;
            flex-direction: row;
            justify-content: end;
            gap: 15px;

            button {
                position: relative;
                color: black;
                background-color: rgba(255, 255, 255, 0.612);
                border: 1px #FFD700 solid;
                transition: all 0.3s ease-in;
                border-radius: 5px;

                &:hover {
                    transform: scale(1.05); 
                    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
                }

                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle, #ffa200, #ffbb00);
                    transition: opacity 0.5s ease-in; 
                    opacity: 0;
                    z-index: -1; 
                    border-radius: 5px;
                }

                &:hover::before {
                    opacity: 1; 
                }
            }
        }

        
    }
}
.message {
    width: 80%;
    height: 200px;
    border: 3px solid;
    border-radius: 5px;
    box-shadow: 0 8px 32px 0 rgba(151, 147, 19, 0.37);
    backdrop-filter: blur( 6px );
    -webkit-backdrop-filter: blur( 6px );
    border-radius: 10px;
    transition: all ease-out 0.3s;
    &:hover {
        scale: 1.03;
        box-shadow: rgba(50, 50, 93, 0.25) 2px 8px 15px -4px, rgba(0, 0, 0, 0.3) 3px 6px 10px -5px;
    }

    .message-header {
        width: 100%;
        height: 30px;
        padding-left: 5px;
        padding-right: 5px;
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
        display: flex;
        justify-content: space-between;

        p {
            span {
                font-weight: bold;
            } 
        }
    }

    .message-content {
        .control {
            width: 100%;
            padding: 15px;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            gap: 15px;
            
            .pencil {
                &:hover {
                    color: blue;

                }
            }
        }
    }
}  
</style>