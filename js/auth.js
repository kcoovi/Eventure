class Auth {
  constructor() {
    this.isAuthenticated = false;
    this.users = JSON.parse(localStorage.getItem("users")) || [];
    this.currentUser = null;
    this.checkAuthentication();
  }

  checkAuthentication() {
    const authKey = localStorage.getItem("authKey");
    if (authKey) {
      const [email, password] = atob(authKey).split(":");
      this.currentUser = this.users.find(
        (u) => u.email === email && u.password === password
      );
      this.isAuthenticated = !!this.currentUser;
    } else {
      this.isAuthenticated = false;
      this.currentUser = null;
    }
  }

  login(email, password) {
    const user = this.users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      const authKey = btoa(`${email}:${password}`);
      localStorage.setItem("authKey", authKey);
      this.isAuthenticated = true;
      this.currentUser = user;
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem("authKey");
    this.isAuthenticated = false;
    this.currentUser = null;
  }

  register(email, password) {
    if (this.users.some((u) => u.email === email)) {
      return false; // User already exists
    }
    const newUser = { email, password, id: Date.now().toString() };
    this.users.push(newUser);
    localStorage.setItem("users", JSON.stringify(this.users));
    return this.login(email, password);
  }

  getCurrentUserId() {
    return this.currentUser ? this.currentUser.id : null;
  }
}

const auth = new Auth();
