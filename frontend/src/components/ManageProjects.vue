<template>
  <div>
    <h2>Manage Projects</h2>

    <!-- Button to refresh project list -->
    <button @click="fetchProjects">Refresh Project List</button>

    <!-- Display list of projects -->
    <ul>
      <li v-for="project in projects" :key="project._id">
        <strong>{{ project.name }}</strong><br>
        <span>{{ project.description }}</span><br>
        <span><strong>Collaborators:</strong>
          <ul>
            <li v-for="collaborator in project.collaborators" :key="collaborator._id">
              {{ collaborator.username }} (ID: {{ collaborator._id }})
            </li>
          </ul>
        </span><br>
        <button @click="editProject(project)">Edit</button>
        <button @click="deleteProject(project._id)">Delete</button>
      </li>
    </ul>

    <!-- Form to create a new project -->
    <div>
      <h3>Create New Project</h3>
      <form @submit.prevent="createProject">
        <input v-model="newProject.name" placeholder="Project Title" required />
        <textarea v-model="newProject.description" placeholder="Description" required></textarea>
        <input v-model="newProject.collaborators" placeholder="Collaborators (comma-separated usernames)" />
        <button type="submit">Create</button>
      </form>
    </div>

    <!-- Form to edit an existing project -->
    <div v-if="selectedProject">
      <h3>Edit Project</h3>
      <form @submit.prevent="updateProject">
        <input v-model="selectedProject.name" placeholder="Project Title" />
        <textarea v-model="selectedProject.description" placeholder="Description"></textarea>
        <input v-model="selectedProject.collaborators" placeholder="Collaborators (comma-separated usernames)" />
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
      projects: [], // Store the list of projects
      selectedProject: null, // Track the project being edited
      newProject: { // Form data for creating a new project
        name: '',
        description: '',
        collaborators: ''
      },
      allUsers: [] // To store all users for looking up collaborator IDs
    };
  },
  methods: {
    // Fetch all users for collaborator lookup
    // Fetch all users for collaborator lookup
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:8080/api/users/getall', { // Updated URL
          headers: { Authorization: localStorage.getItem('token') }
        });
        this.allUsers = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },


    // Fetch the projects for the logged-in user
    async fetchProjects() {
      try {
        const response = await axios.get('http://localhost:8080/api/projects/get', {
          headers: { Authorization: localStorage.getItem('token') }
        });
        this.projects = response.data;
      } catch (error) {
        console.error('Error fetching projects:', error);
        alert('Failed to fetch projects');
      }
    },

    // Convert collaborator usernames to IDs
    getCollaboratorIds(usernames) {
      return usernames.map(username => {
        const user = this.allUsers.find(user => user.username === username.trim());
        return user ? user._id : null; // Return the user ID if found
      }).filter(id => id !== null); // Filter out any null values
    },

    // Create a new project
    async createProject() {
      try {
        // Split the inputted collaborators' usernames and trim any spaces
        const collaboratorUsernames = this.newProject.collaborators.split(',').map(username => username.trim());

        // Map usernames to user IDs
        const collaboratorIds = collaboratorUsernames.map(username => {
          const user = this.allUsers.find(user => user.username === username); // Find user by username
          return user ? user._id : null; // Return the user ID if found, or null if not
        }).filter(id => id !== null); // Filter out any null values

        if (collaboratorIds.length === 0) {
          alert('No valid collaborators found.');
          return;
        }

        // Send the project data with user IDs in the collaborators array
        const response = await axios.post(
            'http://localhost:8080/api/projects/create',
            {
              name: this.newProject.name,
              description: this.newProject.description,
              collaborators: collaboratorIds  // Send the IDs instead of usernames
            },
            {
              headers: { Authorization: localStorage.getItem('token') }
            }
        );

        alert(response.data.message || 'Project created successfully');
        await this.fetchProjects();  // Refresh the list
        this.newProject = { name: '', description: '', collaborators: '' }; // Clear form
      } catch (error) {
        console.error('Error creating project:', error);
        alert('Failed to create project');
      }
    },


    // Delete a project
    async deleteProject(projectId) {
      try {
        await axios.delete(`http://localhost:8080/api/projects/${projectId}`, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        await this.fetchProjects(); // Refresh the list
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    },

    // Set selected project for editing
    editProject(project) {
      this.selectedProject = { ...project }; // Create a copy of the project for editing
    },

    // Update an existing project
    async updateProject() {
      try {
        const collaboratorIds = this.getCollaboratorIds(this.selectedProject.collaborators.split(','));

        const response = await axios.put(
            `http://localhost:8080/api/projects/${this.selectedProject._id}`,
            {
              name: this.selectedProject.name,
              description: this.selectedProject.description,
              collaborators: collaboratorIds // Send collaborator IDs
            },
            {
              headers: { Authorization: localStorage.getItem('token') }
            }
        );
        alert(response.data.message || 'Project updated successfully');
        await this.fetchProjects(); // Refresh the list
        this.selectedProject = null; // Clear the edit form
      } catch (error) {
        console.error('Error updating project:', error);
        alert('Failed to update project');
      }
    }
  },
  mounted() {
    this.fetchUsers(); // Fetch all users when the component is mounted
    this.fetchProjects(); // Fetch the projects when the component is mounted
  }
};

</script>

<style scoped>
/* Add some basic styling for the form and project list */
button {
  margin: 5px;
}
form {
  margin-top: 20px;
}
input, textarea {
  display: block;
  margin-bottom: 10px;
}
</style>
