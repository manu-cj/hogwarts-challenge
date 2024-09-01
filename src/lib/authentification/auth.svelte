<script>
    import ApiRequest from '../ApiRequest.svelte';

    let email = '';
    let password = '';


    function handleSuccess(data) {
        console.log("Réponse de l'API :", data);
    }


    function handleError(error) {
        console.error("Erreur lors de la requête :", error);
    }

    // Créez une référence au composant ApiRequest pour appeler la fonction makeRequest
    let apiRequestComponent;

    function handleSubmit(event) {
        event.preventDefault();

        if (apiRequestComponent) {
            apiRequestComponent.makeRequest(); 
        }
    }
</script>

<main>
    <section class="login">
        <form on:submit={handleSubmit}>
            <input type="text" name="email" id="email" bind:value={email} placeholder="Email" required>
            <input type="password" name="password" id="password" bind:value={password} placeholder="Mot de passe" required>
            <input type="submit" value="Connecter">
        </form>
    </section>

    <ApiRequest
        bind:this={apiRequestComponent}
        method="POST"
        endpoint="/auth"
        data={{ email, password }}
        onSuccess={handleSuccess}
        onError={handleError}
    />
</main>
