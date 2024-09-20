<script>
import NavBar from './components/NavBar.svelte';
import Router from 'svelte-spa-router'



import Home from "./routes/Home.svelte";
import Auth from "./routes/auth.svelte";
import Logout from "./routes/Logout.svelte";



const routes = {
  '/': Home,
  '/auth': Auth,
  '/logout': Logout,
};

</script>



<Router {routes} />

