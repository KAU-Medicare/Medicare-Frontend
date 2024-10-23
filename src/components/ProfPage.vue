<template>
  <div class="todo-list">
    <h1>할 일 목록</h1>
    <div class="input-container">
      <input v-model="newTodo" @keyup.enter="addTodo" placeholder="새로운 할 일을 입력하세요">
      <button @click="addTodo">추가</button>
    </div>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        {{ todo.title }}
        <button @click="deleteTodo(todo.id)">삭제</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

export default {
  name: 'TodoList',
  setup() {
    const todos = ref([]);
    const newTodo = ref('');

    const fetchTodos = async () => {
      try {
        const response = await api.get('/todos');
        todos.value = response.data;
      } catch (error) {
        console.error('할 일 목록을 가져오는 데 실패했습니다:', error);
      }
    };

    const addTodo = async () => {
      if (newTodo.value.trim()) {
        try {
          const response = await api.get('/todos', { title: newTodo.value, completed: false });
          todos.value.push(response.data);
          newTodo.value = '';
        } catch (error) {
          console.error('할 일을 추가하는 데 실패했습니다:', error);
        }
      }
    };

    const deleteTodo = async (id) => {
      try {
        await api.delete(`/todos/${id}`);
        todos.value = todos.value.filter(todo => todo.id !== id);
      } catch (error) {
        console.error('할 일을 삭제하는 데 실패했습니다:', error);
      }
    };

    onMounted(fetchTodos);

    return {
      todos,
      newTodo,
      addTodo,
      deleteTodo
    };
  }
};
</script>

<style scoped>
.todo-list {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.input-container {
  display: flex;
  margin-bottom: 20px;
}

input {
  flex-grow: 1;
  padding: 5px;
  font-size: 16px;
}

button {
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
</style>