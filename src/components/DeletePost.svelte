<script>
import { apiRequest } from './../api/ApiRequest.js';
import { onMount } from "svelte";

  

  export let user = {};
  export let myTheme = {};
  export let messageData; 

  console.log(messageData);
  

  export let openDeletedModal;

  const tokens = JSON.parse(localStorage.getItem('tokens'));
  
  let author = user.username
  let messageId = messageData.message_id
  let authorId = messageData.author_id;
  let userId = user._id;
  let accessToken = messageData.accessToken;
  
  let errors = { author_id: ''};
  

  console.log(myTheme);
  

  let closeModal = () => {
      if (typeof openDeletedModal === 'function') {
        openDeletedModal(); 
      }
  }

  function handleKeydown(event) {
      if (event.key === 'Escape') {
          closeModal();
      }
  }

  onMount(() => {
     
  });

  function validate(author_id) {
      errors = {author_id:''};
      let isValid = true;
      if (author_id !== null) {
          if (!author_id) {
          errors.author_id = 'Le sujet est requis';
          isValid = false;
          }else if (author_id !== user._id) {
            errors.author_id = 'Vous n\'avez pas le droit de supprimer ce post !';
            console.log(author_id);
            console.log(user._id);
            
            
            isValid = false;
          }
      }
      
      return isValid;
  }

  let handleSubmit = async (event) => {
      event.preventDefault();
      if (validate(authorId)) {
        const formData = {
            authorId,
            userId
        }

        try {
            const data = await apiRequest({
                token: accessToken,
                endpoint: `/delete-message/${messageId}`,
                method: 'DELETE',
                data: formData
            })

            console.log(data.message);
            closeModal();
            
            
        } catch (err) {
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
      <h3>Do you want to delete this post ?</h3>
      <div class="content">
          <button class="no-button" on:click={closeModal}>No</button>
          <button class="yes-button" on:click={handleSubmit}>Yes</button>
      </div>
      {#if errors.author_id}
        <p class="error">{errors.author_id}</p>
      {/if}
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
      width: 33%;
      min-height: 200px;
      background-color: rgb(217, 217, 217);
      color: black;
      border-radius: 15px;
      box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
      padding: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: baseline;

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

      h3 {
        color: rgb(207, 2, 2);
      }

      .content {
        width: 50%;
        height: 50%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;

        .yes-button {
            &:hover {
                background-color: rgb(207, 2, 2);
            }
        }
        .no-button {
            &:hover {
                background-color: green;
            }
        }

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

  
  
}
</style>
