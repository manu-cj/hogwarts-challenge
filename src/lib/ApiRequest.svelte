<script>
    import axios from 'axios';

    export let method = 'POST';
    export let endpoint = '';
    export let data = {}; // Données à envoyer avec la requête (principalement pour POST et PUT)
    export let params = {}; // Paramètres de requête à ajouter à l'URL pour les requêtes GET
    export let headers = {}; // En-têtes HTTP à inclure dans la requête (ex: Content-Type, Auth Token, etc.)
    export let onSuccess; // Fonction de rappel appelée en cas de succès de la requête API
    export let onError; // Fonction de rappel appelée en cas d'échec de la requête API

    async function makeRequest() {
        const url = `http://localhost:5000/api${endpoint}`;
        console.log(data);
        

        try {
            const response = await axios({
                method,
                url,
                data,
                params,
                headers
            });

            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (error) {
            if (onError) {
                onError(error);
            }
        }
    }

    export { makeRequest };
</script>
