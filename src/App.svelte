<script>
import Router from 'svelte-spa-router'
import {link} from 'svelte-spa-router'

  import Home from "./lib/Home/Home.svelte"
  import Auth from "./lib/authentification/auth.svelte";


  const routes = {
    '/': Home,
    '/auth': Auth,
  };


</script>

<nav>
  <a href="/" use:link>Accueil</a>
  <a href="/auth" use:link>Authentification</a>
</nav>

<!-- Routeur -->
<Router {routes} />



<style>
 

</style>
