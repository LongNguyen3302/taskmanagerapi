import { createRouter, createWebHistory } from 'vue-router'
import UserDashboard from '../views/UserDashboard.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

import UserLogin from "@/components/UserLogin.vue"
import ManageProjects from "@/components/ManageProjects.vue" // Import component cho quản lý dự án
import ManageUsers from "@/components/ManageUsers.vue" // Import component cho quản lý người dùng
import ManageTasks from "@/components/ManageTasks.vue"; // Import component cho quản lý nhiệm vụ


// Định nghĩa các route
const routes = [
    { path: '/', component: UserLogin },
    { path: '/user-dashboard', component: UserDashboard, children: [
            {path: 'manage-tasks', component: ManageTasks },
            {path: 'manage-projects', component: ManageProjects },
        ] },
    { path: '/admin-dashboard', component: AdminDashboard, children: [
            { path: 'manage-projects', component: ManageProjects }, // Định nghĩa route con cho quản lý dự án
            { path: 'manage-users', component: ManageUsers }, // Định nghĩa route con cho quản lý người dùng
        ] },
]

// Khởi tạo router với history mode
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router