<script>
    import { onMount } from 'svelte';  // Import de onMount pour l'appel après montage du composant
    import ApiRequest from './../ApiRequest.svelte';
    import axios from 'axios';

    let page = 1;
    let limit = 10;
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    const lobbyUser = 1
    let allMessages = [];
    let filteredMessages
    
    let apiRequestComponent;

    if (!tokens || !tokens.accessToken) {
        console.error('Le token n\'a pas été trouvé dans le localStorage.');
    } else {
        console.log('Token trouvé:', tokens.accessToken);
    }

    let handleSuccess = (data) => {
        console.log("Réponse de l'API :", data.messages);
        console.log(data.message);
        allMessages = data.messages
    }
    let handleError = (data) => {
        console.log("Réponse de l'API :", data.response.data.message);
        if (data.response.data.message === "Token expiré, fais une requète pour refresh le token.") {
            refreshToken(
                (data) => {
                    console.log('Token rafraîchi avec succès:', data);
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
    const data = { refreshToken: tokens.refreshToken }; // Assure-toi que `tokens` est défini

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
    
</script>

<h1>Accueil</h1>
<p>Bienvenue sur la page d'accueil !</p>
{#each allMessages as message}
{ filteredMessages = allMessages.filter(message => message.lobby_id === lobbyUser)}
{#if filteredMessages.length === 0}
    <p>Aucun message trouvé pour ce lobby.</p>
{:else}
    {#each filteredMessages as message}
        <article class="message">
            <div class="message-header">
                <p>{message.author} - {getMostRecentDate(message.createdAt, message.updatedAt)}</p>
                <h3>{message.sujet}</h3>
                <blockquote>{message.message}</blockquote>
            </div>
        </article>
    {/each}
{/if}
{/each}

<!-- Utilisation correcte du composant ApiRequest avec passage de props -->
<ApiRequest
    bind:this={apiRequestComponent}  
    method="GET"
    endpoint={`/get-lobby-messages?page=${page}&limit=${limit}`}
    headers={{ 
        Authorization: `Bearer ${tokens.accessToken}`  // Ajout du token Bearer
    }}
    onSuccess={handleSuccess}
    onError={handleError}
/>
