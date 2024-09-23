<script>
	import DeletePost from './DeletePost.svelte';
	import AddPost from './AddPost.svelte';
	import { apiRequest } from './../api/ApiRequest';
    import { onMount, afterUpdate } from 'svelte';
    import axios from 'axios';
    import pencil from './../assets/icons/pencil-alt-solid.svg';
    import trash from './../assets/icons/trash-alt-solid.svg';
    import Gryffindor from './../assets/house/Gryffindor-removebg-preview.png'
    import Hufflepuff from './../assets/house/hufflepuff-removebg-preview.png'
    import Ravenclaw from './../assets/house/ravenclaw-removebg-preview.png'
    import Slytherin from './../assets/house/slytherin-removebg-preview.png'
    import FaTrashAlt from 'svelte-icons/fa/FaTrashAlt.svelte'
    import loader from './../assets/loader/bouncing-circles.svg'

    import io from 'socket.io-client';
    let socket;


    export let user = {};
    export let myTheme = {};
    export let housePicture;
    const { _id, email, username, lobbyId } = user;
    export let messageData = {
        author_id: "",
        message_id: "",
        accessToken: ""
    }
    let userWrite = "";

    let page = 1;
    let limit = 10;
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    const lobbyUser = user.lobbyId

    let allMessages = [];
    let filteredMessages = [];
    let messagesContainer;
    let acceuil = "acceuil";

    let order = "ASC";
    let posts = [];
    let error = "";
    let modalIsOpen = false;
    let deletedModalIsOpen = false;
    let inWrite = false;

    $: allMessages; 
    $: filteredMessages;
    // PROPS
 
    
    


    function getMostRecentDate(created_at, updated_at) {
        const createdAtDate = new Date(created_at);
        const updatedAtDate = new Date(updated_at);

        if (createdAtDate >= updatedAtDate) {
            return `<p>${createdAtDate.toLocaleString()}</p>`;
        }
    }

    const getAllMessages = async () => {
        try {
      const data = await apiRequest({
        token: tokens.accessToken,
        endpoint: `/get-lobby-messages?page=${page}&limit=${limit}`,
        method: 'GET'
        });
        allMessages = data.messages; 
        filteredMessages = allMessages.filter(message => message.lobby_id === lobbyUser).reverse()
        } catch (err) {
            error = err.message; 
            console.log(error);
            if (error === "Token expiré, fais une requète pour refresh le token.") {
                refreshToken(
                    (data) => {
                        console.log('Token rafraîchi avec succès:', data);
                        window.location.href = '#/';
                    },
                    (error) => {
                        console.error('Erreur lors du rafraîchissement du token:', error.response ? error.response.data : error.message);
                    }
                );
            }
        }
    }
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
            }
     
        console.log(allMessages);
        } catch (err) {
        error = err.message; 
        console.log(error);   
        }
    }

    onMount(async () => {
        await getDataUser();
        await getAllMessages();   
        scrollToBottom();

        socket = io('http://localhost:5000');

        socket.on('in write', (data) => {
            inWrite = data.inWrite; 
            userWrite = data.author_id     
        });

        socket.on('newMessage', (message) => {
            allMessages = [message, ...allMessages];
            filteredMessages = allMessages.filter(msg => msg.lobby_id === lobbyUser).reverse();

            setTimeout(() => {
                filteredMessages = [...filteredMessages];
            }, 0);
        });

        socket.on('messageDeleted', (data) => {
            allMessages = allMessages.filter(msg => msg._id !== data.id);
            filteredMessages = allMessages.filter(msg => msg.lobby_id === lobbyUser).reverse();
        });

        return () => {
            socket.disconnect();
        };
        
    });

    afterUpdate(() => {
        scrollToBottom();
    });

    function scrollToBottom() {
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }


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

    let openModal = async () => {
        modalIsOpen === false ? modalIsOpen = true : modalIsOpen = false;
         
    }

    let openDeletedModal = async (post_id_value, author_id_value) => {
        messageData.author_id = author_id_value;
        messageData.message_id = post_id_value;
        messageData.accessToken = tokens.accessToken;
        deletedModalIsOpen === false ? deletedModalIsOpen = true : deletedModalIsOpen = false;
        
        console.log(deletedModalIsOpen);
        
    }
    
</script>

    <section class="lobby">
        <div class="control-section">
            <img src={housePicture} alt={acceuil} width="50px"> 
        </div>
        <section class="messages" bind:this={messagesContainer}> 
            {#if filteredMessages.length === 0}
                <p>Aucun message trouvé pour ce lobby.</p>
            {:else}
                {#each filteredMessages as message (message._id)}
                    <article class="message" style=" border-color: {myTheme.colors.secondary};">
                        <div class="message-header" style="background-color: {myTheme.colors.primary};">
                            <p class="author"><strong>{message.author}</strong></p>
                            <p>{@html getMostRecentDate(message.createdAt, message.updatedAt)}</p>   
                        </div>
                        <div class="message-content">
                            <div class="control">
                                {#if user._id === message.author_id}
                                    <button on:click={openDeletedModal(message._id, message.author_id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="trash-icon">
                                            <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                    
                                            
                                {/if}
                            </div>
                            <blockquote>{@html message.message}</blockquote>
                        </div>
                    </article>
                {/each}
            {/if}
            {#if userWrite !== user._id}
                {#if inWrite}
                    <div class="inWrite">
                        <img src={loader} alt="loading" width="30px">
                    </div>
                {/if}
            {/if}
           
        </section>
        
            <AddPost {openModal} {user} {myTheme}/>
    
        {#if deletedModalIsOpen === true}
            <DeletePost {openDeletedModal} {user} {myTheme} {messageData}/>
        {/if}

    </section>
    
   
<style lang="scss">
   
main {
     width: 100%;
     display: flex;
     flex-direction: column;
     justify-content: start;
     align-items: center;
     gap: 30px;
     min-height: 100vh;
}

.lobby {
    width: 75%;
    padding: 15px 30px;
    min-height: 70vh;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: flex-end;
    gap: 40px;
    background: rgba(36, 36, 36, 0.966);
    overflow-y: scroll;
    overflow-x: hidden;
    backdrop-filter: blur( 6px );
    -webkit-backdrop-filter: blur( 6px );
    border-radius: 10px;

    .control-section {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 30px;  
    }
}

.messages {
    width: 100%;
    padding: 15px 30px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: flex-end;
    gap: 40px;
    
    overflow-y: scroll;
    overflow-x: hidden;
    border-radius: 10px;
}
.message {
    min-width: 30%;
    max-width: 80%;
    
    background-color: rgba(255, 255, 255, 0.112);
    color: rgb(249, 249, 249);
    border-radius: 5px;
    box-shadow: 0 8px 32px 0 rgba(77, 75, 9, 0.37);
    backdrop-filter: blur( 6px );
    -webkit-backdrop-filter: blur( 6px );
    transition: all ease-out 0.5s;
    &:hover {
        scale: 1.03;
        box-shadow: rgba(50, 50, 93, 0.25) 2px 8px 15px -4px, rgba(0, 0, 0, 0.3) 3px 6px 10px -5px;

        .message-header {
            filter: brightness(1.1);   
        }

        .message-content {

            .control {
                opacity: 1;
                
            }
            
        }


    }

    .message-header {
        width: 100%;
        height: 30px;
        padding-left: 5px;
        padding-right: 5px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        display: flex;
        justify-content: space-between;
        transition: all ease-out 0.5s;

        p {
            span {
                font-weight: bold;
            } 
        }
    }

    .message-content {
        word-break: break-all;
        color: rgb(242, 242, 242);
        transition: all 0.5s ease-in;
        
        .control {
            width: 100%;  
            opacity: 0;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: start;
            gap: 5px;
            text-align: left; 
            padding-right: 10px;
            transition: all 0.5s ease-in;
            

            button {
                width: 10px;
                height: 10px;
                background: none;
                border: none;
                cursor: default;
                outline: none;
                width: 5px;
                
                

                .pencil-icon {
                    width: 20px;
                    color: rgb(53, 53, 53);
                    cursor: pointer;
                    &:hover {
                        color: lightseagreen;
                    }
                }
                .trash-icon {
                    width: 20px;
                    cursor: pointer;
                    color: rgb(217, 214, 214);
                    
                    &:hover {
                        color: tomato;
                    }
                }

            }
        }
        h3 {
            text-align: left;
        }
        h4 {
            text-align: left;
        }
        p {
            text-align: left;
        }
        blockquote {
                width: 100%;
                text-align: left;
              
                padding: 10px 50px;
            }
            
    }
}  

.inWrite {
    padding: 10px 20px;
    background-color: rgba(255, 255, 255, 0.188);
    border-radius: 10px;
}
</style>