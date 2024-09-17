<script>
import Router from 'svelte-spa-router'
import {link} from 'svelte-spa-router'
import { isConnected } from './store/isConnected.js';

import Home from "./routes/Home.svelte";
import Auth from "./routes/auth.svelte";
import Logout from "./routes/Logout.svelte";

$: isConnected;

const routes = {
  '/': Home,
  '/auth': Auth,
  '/logout': Logout,
};

</script>

<nav>
  <a href="/" use:link>Accueil</a>
  {#if !$isConnected}
  <a href="/auth" use:link>Authentification</a>
  {/if}
  {#if $isConnected}
  <a href="/logout" use:link>Logout</a>
  {/if}
</nav>

<Router {routes} />

