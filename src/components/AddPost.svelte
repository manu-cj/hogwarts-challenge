<script>
	  import { apiRequest } from './../api/ApiRequest';
    import { onMount } from "svelte";
    import Quill from "quill";
    import "quill/dist/quill.snow.css";
    

    export let user = {};
    export let myTheme = {};
    export let openModal;

    const tokens = JSON.parse(localStorage.getItem('tokens'));
    let sujet = "";
    let message = "";
    let author = user.username
    let author_id = user._id
    let lobby_id = user.lobbyId
    let quill;
    let errors = { sujet: '', post: ''};
    

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
        const editor = document.getElementById("editor");
        quill = new Quill(editor, {
            theme: "snow",
            placeholder: "Ecrivez votre post ici...",
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],     
                    
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],
                    
                   
                    [{ 'align': [] }],
                    ['clean']  
                ]
            }
        });


        quill.on("text-change", function () {
            message = quill.root.innerHTML; 
        });
    });

    function validate(sujet, post) {
        errors = {sujet:'', post: ''};
        let isValid = true;
        if (sujet !== null) {
            if (!sujet) {
            errors.sujet = 'Le sujet est requis';
            isValid = false;
            }else if (sujet.length < 5) {
                errors.sujet = `il manque ${5-sujet.length} charactères à votre sujet.`
                isValid = false;
            }
            else if (sujet.length > 55){
                errors.sujet = `il y a ${sujet.length-55} charactères en trop à votre sujet.`
                isValid = false;
            }
        }
        

        if (post !== null) {
            if (!post) {
            errors.post = 'Le post est requis.';
            isValid = false;
            }else if (post.length < 10) {
                errors.post = `il manque ${10-post.length} charactères à votre post.`
                isValid = false;
            }
            else if (post.length > 255){
                errors.post = `il y a ${post.length-255} charactères en trop à votre post.`
                isValid = false;
            }
        }
        
           
        
        return isValid;
    }

    let handleSubmit = async (event) => {
        event.preventDefault();
        if (validate(sujet, message)) {
            
            const formData = {
                sujet,
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
                console.log(data.message);
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

<div class="modal-section" role="button" tabindex="0"  on:click|self={closeModal} on:keydown={handleKeydown}>
    <div class="modal" >
        <div class="control">
            <button on:click={closeModal}>❌</button>
        </div>
        <h3 style="color: {myTheme.colors.primary};">Add post</h3>
        <div class="content">
            <form on:submit={handleSubmit}>
                <div class="input-div">
                    <label for="sujet" style="color: {myTheme.colors.primary};">Sujet :</label>
                    <input type="text" id="sujet" bind:value={sujet} placeholder="Sujet" on:keyup={validate(sujet, null)} required />
                </div>
                {#if errors.sujet}
                    <p class="error">{errors.sujet}</p>
                {/if}
                <div class="input-div">
                    <label for="post" style="color: {myTheme.colors.primary};">Post :</label>
                    <div id="editor" class="quill-editor" ></div>
                </div>
                {#if errors.post}
                    <p class="error">{errors.post}</p> 
                {/if}

                <input type="submit" value="Envoyer"  style="background-color: {myTheme.colors.primary};"/>
            </form>
        </div>
    </div>
</div>

<style lang="scss">
.modal-section {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.247);
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-content: center;
    margin: 0;
    padding: 0;  

    .modal {
        position: relative; 
        width: 50%;
        min-height: 600px;
        background-color: rgb(217, 217, 217);
        color: black;
        border-radius: 15px;
        box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
        padding: 15px;

        .control {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            button {
                background: none;
                border: none;
                outline: none;
                &:focus {
                    border: none;
                }
            }
        }

        .input-div {
            margin: 20px 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 30px;
            
        }

        input[type="submit"] {
            padding: 10px 20px;
           
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    }

    input {
        background-color: white;
        width: 250px;
        height: 50px;
        border-radius: 10px;
        padding-left: 10px;
        color: black;
    }
    
    .quill-editor {
        width: 95%;
        height: 150px;
        background-color: rgb(255, 255, 255);
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 10px;
        
    }
    
    
}
</style>
