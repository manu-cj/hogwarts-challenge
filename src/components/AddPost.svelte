<script>
	  import { apiRequest } from './../api/ApiRequest';
    import { onMount, onDestroy } from "svelte";
    import Quill from "quill";
    import "quill/dist/quill.snow.css";
    import { io } from "socket.io-client";
    

    export let user = {};
    export let myTheme = {};
    export let openModal;


    const tokens = JSON.parse(localStorage.getItem('tokens'));
    let message = "";
    let author = user.username
    let author_id = user._id
    let lobby_id = user.lobbyId
    let quill;
    let errors = { sujet: '', post: ''};
    let socket;
    let animationName = "";
    let inWrite = false;
    let typingTimeout;
    
    

    console.log(myTheme);
    

    let closeModal = () => {
        if (typeof openModal === 'function') {
            openModal(); 
        }
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }

    onMount(() => {
        socket = io("http://localhost:5000");
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        

        socket.on('newMessage', (msg) => {
            console.log('New message received:', msg);
        });

        
    });

    onDestroy(() => {
    if (socket) {
        socket.disconnect();
    }
});

let animationClass = '';

function validate(post) {
    errors = { post: '' };
    let isValid = true;

    if (post !== null) {
        if (!post) {
            errors.post = 'Le message est vide.';
            isValid = false;
            animationClass = "fadeOut"; 
            setTimeout(() => {
                errors.post = '';
                animationClass = ''; 
            }, 5000);
        } else if (post.length < 3) {
            errors.post = `Il manque ${3 - post.length} caractères à votre message.`;
            isValid = false;
            animationClass = "fadeOut"; 
            setTimeout(() => {
                animationClass = ''; 
            }, 5000);
        } else if (post.length > 255) {
            errors.post = `Il y a ${post.length - 255} caractères en trop à votre message.`;
            isValid = false;
            animationClass = "fadeOut"; 
            setTimeout(() => {
                animationClass = ''; 
            }, 5000);
        } else {
            animationClass = '';
        }
    }

    return isValid;
}

    function handleKeyup(post) {
        errors = { post: ''};
        let isValid = true;
        inWrite = true;
    
 
        
        socket.emit('in write', { inWrite, author_id });

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            inWrite = false;
  
            socket.emit('in write', { inWrite, author_id }); 
        }, 2500);

        if (post !== null) {
            if (!post) {
            errors.post = '';
            isValid = false;
            inWrite = false;
            userWrite = false;
            socket.emit('in write', { inWrite });
            
            }else if (post.length < 3) {
            errors.post = `Il manque ${3 - post.length} caractères à votre message.`;
            isValid = false;
            animationClass = "keyUpFadeOut"; 
            
        } else if (post.length > 255) {
            errors.post = `Il y a ${post.length - 255} caractères en trop à votre message.`;
            isValid = false;
            animationClass = "keyUpFadeOut"; 
            
        } else {
            animationClass = ''; 
        }
        }
        
           
        
        return isValid;
    }

    let handleSubmit = async (event) => {
        event.preventDefault();
        if (validate(message)) {
            
            let formData = {
                message,
                author,
                author_id,
                lobby_id
            }
            try {
                const data = await apiRequest({
                    token: tokens.accessToken,
                    endpoint: '/add-message',
                    method: 'POST',
                    data: formData
                })

                socket.emit('newMessage', {
                    message,
                    author,
                    author_id,
                    lobby_id
                });
                console.log(data.message);
                formData = {}
                message = "";
                closeModal();

                
            }
            catch (err) {
                console.log(err.message);
                
            }
        }
        
    }
</script>

<main>
</main>

<div class="modal-section">
    <div class="content">
        <form on:submit={handleSubmit}>
            <div class="input-div">
               <input type="text" name="message" id="message" bind:value={message} on:keyup={event => handleKeyup(message)}>
            </div>
            
            <div class="submit-div">
                <input type="submit" value="Envoyer"  style="background-color: {myTheme.colors.primary};"/>
            </div>
        </form>
        {#if errors.post}
            <p class="error {animationClass}">{errors.post}</p>
        {/if}
    </div>
</div>

<style lang="scss">
.modal-section {
    width: 100%;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-content: center;
    margin: 0;
    padding: 0;  

    .content {
        width: 100%;
        margin: 0;
        form {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            .input-div {
                width: 80%;
            
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 30px;

                input[type=text] {
                    width: 100%;
                    padding: 10px 20px;
                    background-color: rgba(255, 255, 255, 0.277);
                    border-top-left-radius: 5px;
                    border-bottom-left-radius: 5px;
                    padding-left: 10px;
                    color: rgb(255, 255, 255);
                    border-right: 0;
                    transition: all 0.3s ease-out;

                        &:focus {
                            background-color: rgba(255, 255, 255, 0.151);
                            outline: none; // Suppression de l'outline au focus
                        }
                    }

            
            }
            .submit-div {
                width: 20%;
                margin: 20px 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 30px;
            }

            input[type="submit"] {
                width: 100%;
                padding: 10px 20px;
                color: white;
                border: none;
                cursor: pointer;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
            }
        }
    }

.error.fadeOut {
    animation: fadeOut 5s forwards;
}

.error.keyUpFadeOut {
    animation: keyUpFadeOut 10s forwards;
}


@keyframes fadeOut {
    0% {
        opacity: 0;
    }
    10% {
        opacity: 1;
        height: 5px;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
    }

    80% {
        opacity: 1;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        height: 5px;
    }
    100% {
        opacity: 0;
        margin-top: 0;
        margin-bottom: 0.2rem;
        height: 0;
    }
}

@keyframes keyUpFadeOut {
    0% {
        opacity: 0;
    }
    10% {
        opacity: 1;
        height: 20px;
     
    }

    80% {
        opacity: 1;

       
    }
    100% {
        opacity: 1;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        height: 20px;

     
    }
}
    
   
    
    
}
</style>
