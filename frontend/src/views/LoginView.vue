<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const showPassword = ref(false);
const isLoading = ref(false);

const handleLogin = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    const response = await api.post('/login', {
      email: email.value,
      password: password.value
    });
    localStorage.setItem('token', response.data.token);
    router.push('/expenses');
  } catch (error) {
    errorMessage.value = 'Incorrect email or password';
    console.error('Login failed:', error);
  } finally {
    isLoading.value = false;
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">Welcome Back</h2>
      <p class="subtitle">Sign in to manage your expenses</p>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            placeholder="Enter your email"
            autocomplete="email"
          >
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <div class="password-wrapper">
            <input 
              :type="showPassword ? 'text' : 'password'"
              id="password" 
              v-model="password" 
              required
              placeholder="Enter your password"
              autocomplete="current-password"
            >
            <button 
              type="button" 
              class="toggle-password"
              @click="togglePasswordVisibility"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <svg v-if="showPassword" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>
        <button 
          type="submit" 
          :disabled="isLoading || !email || !password"
          :class="{ 'loading': isLoading }"
        >
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
    <footer class="footer">
      <p>© {{ new Date().getFullYear() }} Developed by Rizqika Mulia Pratama</p>
    </footer>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 1rem;
  box-sizing: border-box;
}

.login-box {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  transition: transform 0.3s ease;
}

.login-box:hover {
  transform: translateY(-2px);
}

.title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
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

.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
}

.icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
  color: #666;
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

button.loading {
  opacity: 0.9;
  pointer-events: none;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 1rem;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

.footer {
  text-align: center;
  padding: 1rem 0;
  margin-top: 2rem;
  max-width: 420px;
  width: 100%;
  color: #6b7280;
  font-size: 0.85rem;
}

.footer p {
  margin: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 480px) {
  .login-box {
    padding: 2rem;
  }
  
  .title {
    font-size: 1.5rem;
  }

  .footer {
    padding: 1rem 0;
  }
}
</style>