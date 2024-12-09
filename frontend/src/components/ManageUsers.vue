<template>
  <div>
    <h2>Manage Users</h2>
    <button @click="fetchUsers">Refresh User List</button>
    <ul>
      <li v-for="user in users" :key="user._id">
        {{ user.username }} - {{ user.accessLevel }}
        <button @click="editUser(user)">Edit</button>
        <button @click="deleteUser(user._id)">Delete</button>
      </li>
    </ul>

    <!-- Edit Form -->
    <div v-if="selectedUser">
      <h3>Edit User</h3>
      <form @submit.prevent="updateUser">
        <input v-model="selectedUser.username" placeholder="Username" />
        <select v-model="selectedUser.accessLevel">
          <option value="admin">Admin</option>
          <option value="read">Read</option>
        </select>
        <button type="submit">Update</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: [],
      selectedUser: null
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:8080/api/users/getall', {
          headers: { Authorization: localStorage.getItem('token') }
        });
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async deleteUser(userId) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${userId}`, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        this.fetchUsers(); // Refresh user list
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    },
    editUser(user) {
      this.selectedUser = { ...user }; // Create a copy to edit
    },
    async updateUser() {
      try {
        await axios.put(`http://localhost:8080/api/users/${this.selectedUser._id}`, this.selectedUser, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        this.fetchUsers();
        this.selectedUser = null; // Clear the edit form
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>
