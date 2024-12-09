<template>
  <div>
    <h2>Manage Tasks</h2>

    <!-- Button to refresh task list -->
    <button @click="fetchTasks">Refresh Task List</button>

    <!-- Display list of tasks -->
    <ul>
      <li v-for="task in tasks" :key="task._id">
        <strong>{{ task.title }}</strong><br>
        <span>{{ task.description }}</span><br>
        <span><strong>Status:</strong> {{ task.status }}</span><br>
        <span><strong>Due Date:</strong> {{ new Date(task.dueDate).toLocaleDateString() }}</span><br>
        <span><strong>Project ID:</strong>{{ task.projectId }}</span><br>
        <button @click="editTask(task)">Edit</button>
        <button @click="deleteTask(task._id)">Delete</button>
      </li>
    </ul>

    <!-- Form to create a new task -->
    <div>
      <h3>Create New Task</h3>
      <form @submit.prevent="createTask">
        <input v-model="newTask.title" placeholder="Task Title" required />
        <textarea v-model="newTask.description" placeholder="Description" required></textarea>
        <input v-model="newTask.status" placeholder="Status (e.g., Pending, In Progress, Completed)" required />
        <input type="date" v-model="newTask.dueDate" placeholder="Due Date" required />
        <input v-model="newTask.projectID" placeholder="Project ID" required />
        <button type="submit">Create</button>
      </form>
    </div>

    <!-- Form to edit an existing task -->
    <div v-if="selectedTask">
      <h3>Edit Task</h3>
      <form @submit.prevent="updateTask">
        <input v-model="selectedTask.title" placeholder="Task Title" />
        <textarea v-model="selectedTask.description" placeholder="Description"></textarea>
        <input v-model="selectedTask.priority" placeholder="Priority" />
        <input v-model="selectedTask.status" placeholder="Status" />
        <input type="date" v-model="selectedTask.dueDate" placeholder="Due Date" />
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
      tasks: [], // Store the list of tasks
      selectedTask: null, // Track the task being edited
      newTask: { // Form data for creating a new task
        title: '',
        description: '',
        dueDate: '',
        projectId: '',
        status: ''

      }
    };
  },
  methods: {
    // Fetch all tasks
    async fetchTasks() {
      try {
        const response = await axios.get('http://localhost:8080/api/tasks/gettask', {
          headers: { Authorization: localStorage.getItem('token') }
        });
        this.tasks = response.data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('Failed to fetch tasks');
      }
    },

    // Create a new task
    async createTask() {
      try {
        const response = await axios.post(
            'http://localhost:8080/api/tasks/create',
            {
              title: this.newTask.title,
              description: this.newTask.description,
              status: this.newTask.status,
              dueDate: this.newTask.dueDate,
              projectID: this.newTask.projectId
            },
            {
              headers: { Authorization: localStorage.getItem('token') }
            }
        );

        alert(response.data.message || 'Task created successfully');
        await this.fetchTasks();
        this.newTask = { title: '', description: '', status: '', dueDate: '' };
      } catch (error) {
        console.error('Error creating task:', error);
        alert('Failed to create task');
      }
    },

    // Delete a task
    async deleteTask(taskId) {
      try {
        await axios.delete(`http://localhost:8080/api/tasks/${taskId}`, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        await this.fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    },

    // Set selected task for editing
    editTask(task) {
      this.selectedTask = { ...task };
    },

    // Update an existing task
    async updateTask() {
      try {
        const response = await axios.put(
            `http://localhost:8080/api/tasks/${this.selectedTask._id}`,
            {
              title: this.selectedTask.title,
              description: this.selectedTask.description,
              dueDate: this.selectedTask.dueDate,
              status: this.selectedTask.status
            },
            {
              headers: { Authorization: localStorage.getItem('token') }
            }
        );

        alert(response.data.message || 'Task updated successfully');
        await this.fetchTasks();
        this.selectedTask = null;
      } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task');
      }
    }
  },
  mounted() {
    this.fetchTasks(); // Fetch all tasks when the component is mounted
  }
};
</script>

<style scoped>
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
