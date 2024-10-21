<template>
  <div class="todo-container">
    <h1>Todo Application</h1>
    <h2>Todo List</h2>
    <div class="input-container">
      <input v-model="newTodo" @keyup.enter="addTodo" placeholder="Enter new todo">
      <button @click="addTodo">Add</button>
    </div>
    <button @click="fetchTodos">Refresh List</button>
    <ul class="todo-list">
      <li v-for="todo in todos" :key="todo.id" class="todo-item">
        <input type="checkbox" v-model="todo.completed" @change="updateTodo(todo)">
        <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
        <button @click="deleteTodo(todo.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TodoList',
  data() {
    return {
      todos: [],
      newTodo: ''
    }
  },
  mounted() {
    this.fetchTodos()
  },
  methods: {
    async fetchTodos() {
      try {
        const response = await axios.get('/api/todos/')
        this.todos = response.data
      } catch (error) {
        console.error('Error fetching todos:', error)
      }
    },
    async addTodo() {
      if (this.newTodo.trim()) {
        try {
          const response = await axios.post('/api/todos/', { title: this.newTodo, completed: false })
          this.todos.push(response.data)
          this.newTodo = ''
        } catch (error) {
          console.error('Error adding todo:', error)
        }
      }
    },
    async updateTodo(todo) {
      try {
        await axios.put(`/api/todos/${todo.id}`, todo)
      } catch (error) {
        console.error('Error updating todo:', error)
      }
    },
    async deleteTodo(id) {
      try {
        await axios.delete(`/api/todos/${id}`)
        this.todos = this.todos.filter(todo => todo.id !== id)
      } catch (error) {
        console.error('Error deleting todo:', error)
      }
    }
  }
}
</script>

<style scoped>
.todo-container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.input-container {
  margin-bottom: 20px;
}

input[type="text"] {
  width: 70%;
  padding: 10px;
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.todo-list {
  list-style-type: none;
  padding: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.completed {
  text-decoration: line-through;
  color: #888;
}
</style>