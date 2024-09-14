<script>
    const isLogin = JSON.parse(localStorage.getItem('isLogin'));
if (isLogin) {
    localStorage.setItem("isLogin", false);
    localStorage.removeItem("tokens");
    window.location.href = '/auth';
} else {
    window.location.href = '/auth';
}
    
</script>
