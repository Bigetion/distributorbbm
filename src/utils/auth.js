export default {
  user: {
    idRole: '',
    idUser: '',
    username: '',
    rolename: '',
    authenticated: false
  },
  getUserInfo(context) {
    context.$http.post('app/getUserInfo', {}).then(response => {
      this.user.idRole= response.data.idRole
      this.user.idUser= response.data.idUser
      this.user.username= response.data.username
      this.user.rolename= response.data.roleName
    }).catch(function (error) {
      console.log(error);
      context.error = error.body.error;
    });
  },
  logout(context) {
    localStorage.removeItem('token')
    this.user.authenticated = false;
    window.location.reload();
    context.$router.push('/');
  },
  checkAuth() {
    var jwt = localStorage.getItem('token');
    if (jwt) {
      this.user.authenticated = true;
    } else {
      this.user.authenticated = false;
    }
  }
}
