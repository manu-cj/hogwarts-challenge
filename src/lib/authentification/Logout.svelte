<script>
    const isLogin = JSON.parse(localStorage.getItem('isLogin'));
if (isLogin) {
    localStorage.setItem("isLogin", false);
    window.location.href = '/';
} else {
    window.location.href = '/';
}
    
</script>
