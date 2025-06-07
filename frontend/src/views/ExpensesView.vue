<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const expenses = ref([]);
const newExpense = ref({
  item_name: '',
  amount: '',
  date: ''
});
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const filterName = ref('');
const filterDateStart = ref('');
const filterDateEnd = ref('');

const fetchExpenses = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const response = await api.get('/expenses');
    expenses.value = response.data.data;
  } catch (error) {
    setTemporaryMessage('errorMessage', 'Failed to fetch expenses data');
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchExpenses);

const addExpense = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await api.post('/expenses', newExpense.value);
    setTemporaryMessage('successMessage', 'Expense added successfully');
    newExpense.value = { item_name: '', amount: '', date: '' };
    await fetchExpenses();
  } catch (error) {
    if (error.response && error.response.status === 422) {
      setTemporaryMessage('errorMessage', Object.values(error.response.data.errors).flat().join(' '));
    } else {
      setTemporaryMessage('errorMessage', 'Failed to add expense');
    }
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const deleteExpense = async (id) => {
  if (!confirm('Are you sure you want to delete this expense?')) return;
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await api.delete(`/expenses/${id}`);
    setTemporaryMessage('successMessage', 'Expense deleted successfully');
    await fetchExpenses();
  } catch (error) {
    setTemporaryMessage('errorMessage', 'Failed to delete expense');
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

const setTemporaryMessage = (refName, message) => {
  if (refName === 'successMessage') successMessage.value = message;
  else if (refName === 'errorMessage') errorMessage.value = message;
  setTimeout(() => {
    if (refName === 'successMessage') successMessage.value = '';
    else if (refName === 'errorMessage') errorMessage.value = '';
  }, 2000);
};

const filteredExpenses = computed(() => {
  let filtered = expenses.value;
  
  if (filterName.value) {
    filtered = filtered.filter(expense =>
      expense.item_name.toLowerCase().includes(filterName.value.toLowerCase())
    );
  }
  
  if (filterDateStart.value) {
    filtered = filtered.filter(expense => 
      new Date(expense.date) >= new Date(filterDateStart.value)
    );
  }
  
  if (filterDateEnd.value) {
    filtered = filtered.filter(expense => 
      new Date(expense.date) <= new Date(filterDateEnd.value)
    );
  }
  
  return filtered;
});

const paginatedExpenses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredExpenses.value.slice(start, end);
});

const totalPages = computed(() => 
  Math.ceil(filteredExpenses.value.length / itemsPerPage)
);

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
</script>

<template>
  <div class="page-container">
    <header>
      <div class="header-content">
        <h1>Expense Management</h1>
        <button @click="logout" class="logout-btn">Sign Out</button>
      </div>
    </header>

    <div class="content-wrapper">
      <div class="form-card">
        <h3>Add New Expense</h3>
        <form @submit.prevent="addExpense">
          <div class="input-group">
            <label for="item_name">Item Name</label>
            <input 
              type="text" 
              id="item_name"
              v-model="newExpense.item_name" 
              placeholder="e.g., Train Ticket" 
              required
              autocomplete="off"
            >
          </div>
          <div class="input-group">
            <label for="amount">Amount (Rp)</label>
            <input 
              type="number" 
              id="amount"
              step="0.01" 
              v-model="newExpense.amount" 
              placeholder="e.g., 150000" 
              required
              autocomplete="off"
            >
          </div>
          <div class="input-group">
            <label for="date">Date</label>
            <input 
              type="date" 
              id="date"
              v-model="newExpense.date" 
              required
            >
          </div>
          <button 
            type="submit" 
            :disabled="isLoading || !newExpense.item_name || !newExpense.amount || !newExpense.date"
            :class="{ 'loading': isLoading }"
          >
            <span v-if="isLoading" class="spinner"></span>
            {{ isLoading ? 'Adding...' : 'Add Expense' }}
          </button>
        </form>
      </div>

      <div class="list-card">
        <h3>Expense History</h3>
        <div class="filter-group">
          <div class="input-group">
            <label for="filter-name">Filter by Name</label>
            <input 
              type="text" 
              id="filter-name" 
              v-model="filterName" 
              placeholder="Search by item name"
            >
          </div>
          <div class="input-group">
            <label for="filter-date-start">Date From</label>
            <input 
              type="date" 
              id="filter-date-start" 
              v-model="filterDateStart"
            >
          </div>
          <div class="input-group">
            <label for="filter-date-end">Date To</label>
            <input 
              type="date" 
              id="filter-date-end" 
              v-model="filterDateEnd"
            >
          </div>
        </div>
        <div v-if="successMessage" class="message success">{{ successMessage }}</div>
        <div v-if="errorMessage" class="message error">{{ errorMessage }}</div>
        <div v-if="isLoading" class="loading">
          <span class="spinner"></span>
          Loading expenses...
        </div>
        <ul v-else-if="paginatedExpenses.length > 0" class="expense-list">
          <li v-for="expense in paginatedExpenses" :key="expense.id" class="expense-item">
            <div class="expense-info">
              <span class="item-name">{{ expense.item_name }}</span>
              <span class="item-details">
                {{ new Date(expense.date).toLocaleDateString('id-ID') }} • Rp {{ parseFloat(expense.amount).toLocaleString('id-ID') }}
              </span>
            </div>
            <button 
              @click="deleteExpense(expense.id)" 
              class="delete-btn" 
              :disabled="isLoading"
              :aria-label="`Delete ${expense.item_name} expense`"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="icon">
                <path d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </li>
        </ul>
        <div v-else class="message">No expenses found</div>
        <div v-if="totalPages > 1" class="pagination">
          <button 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            Previous
          </button>
          <span class="pagination-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <footer class="footer">
      <p>© {{ new Date().getFullYear() }} Developed by Rizqika Mulia Pratama</p>
    </footer>
  </div>
</template>

<style scoped>
.page-container {
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  width: 100%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.logout-btn {
  padding: 0.5rem 1.5rem;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.logout-btn:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

.content-wrapper {
  display: grid;
  gap: 1.5rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  flex: 1;
}

@media (min-width: 992px) {
  .content-wrapper {
    grid-template-columns: 400px 1fr;
  }
}

.form-card, .list-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.form-card:hover, .list-card:hover {
  transform: translateY(-2px);
}

.form-card h3, .list-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.filter-group {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .filter-group {
    grid-template-columns: repeat(3, 1fr);
  }
}

button[type="submit"] {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  background: #4f46e5;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button[type="submit"]:hover:not(:disabled) {
  background: #4338ca;
  transform: translateY(-1px);
}

button[type="submit"]:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}

.spinner {
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.expense-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.expense-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.expense-item:hover {
  background-color: #f9fafb;
}

.expense-item:last-child {
  border-bottom: none;
}

.expense-info {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-weight: 500;
  color: #1a1a1a;
}

.item-details {
  font-size: 0.85rem;
  color: #6b7280;
}

.delete-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.delete-btn:hover:not(:disabled) {
  background: #fee2e2;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
  color: #dc2626;
}

.message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.9rem;
  animation: fadeIn 0.3s ease, fadeOut 0.3s ease 1.7s forwards;
}

.success {
  background: #dcfce7;
  color: #166534;
}

.error {
  background: #fee2e2;
  color: #dc2626;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: #4f46e5;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #4338ca;
  transform: translateY(-1px);
}

.pagination-btn:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.9rem;
  color: #6b7280;
}

.footer {
  text-align: center;
  padding: 1rem 0;
  margin-top: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  color: #6b7280;
  font-size: 0.85rem;
}

.footer p {
  margin: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@media (max-width: 768px) {
  .page-container {
    padding: 1.5rem;
  }

  .form-card, .list-card {
    padding: 1.5rem;
  }

  header h1 {
    font-size: 1.5rem;
  }

  .filter-group {
    grid-template-columns: 1fr;
  }

  .footer {
    padding: 1rem 0;
  }
}
</style>