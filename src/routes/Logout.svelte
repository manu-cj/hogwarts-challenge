<script>
    import { isConnected } from './../store/isConnected';
    const isLogin = JSON.parse(localStorage.getItem('isLogin'));
if (isLogin) {
    localStorage.setItem("isLogin", false);
    localStorage.removeItem("tokens");
    isConnected.update();
    window.location.href = '/#/auth';
} else {
    window.location.href = '/#/auth';
}
    
</script>
