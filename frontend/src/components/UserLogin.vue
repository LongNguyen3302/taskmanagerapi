<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:8080/api/users/login', {
          username: this.username,
          password: this.password
        });

        console.log('Login Response:', response.data); // Log the full response

        if (response.data.token) {
          // Save token to localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.userId);

          // Log the accessLevel to check if it's correct
          console.log('User Access Level:', response.data.accessLevel); // Check the accessLevel returned

          // Check the accessLevel (role) to determine where to redirect
          if (response.data.accessLevel === 'admin') {
            this.$router.push('/admin-dashboard');
          } else if (response.data.accessLevel === 'read') {
            this.$router.push('/user-dashboard');
          } else {
            alert('Invalid role');
          }
        } else {
          alert('Login failed');
        }
      } catch (error) {
        console.error('Error in login:', error.response);
        alert('Login failed');
      }
    }

  }
};
</script>
