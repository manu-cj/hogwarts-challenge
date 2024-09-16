<script>
import Router from 'svelte-spa-router'
import {link} from 'svelte-spa-router'

import Home from "./routes/Home.svelte";
import Auth from "./routes/auth.svelte";
import Logout from "./routes/Logout.svelte";
import Messages from './components/Messages.svelte';



const isLogin = JSON.parse(localStorage.getItem('isLogin'));


const routes = {
  '/': Home,
  '/auth': Auth,
  '/logout': Logout,
};

</script>

<nav>
  <a href="/" use:link>Accueil</a>
  {#if !isLogin}
  <a href="/auth" use:link>Authentification</a>
  {/if}
  {#if isLogin}
  <a href="/logout" use:link>Logout</a>
  {/if}
  
</nav>

<!-- Routeur -->
<Router {routes} />



<style>
 

</style>
