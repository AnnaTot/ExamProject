<template>
  <div class="container col-xl-5 col-lg-6 col-md-6 col-sm-12">
    <form @submit.prevent="register">
      <div>
        <h1 class="text-center mb-4">Register</h1>

        <div class="mb-4">
          <input type="text" placeholder="Username" v-model="accountName" id="username" />
          <div v-show="!correctAccountName" class="notValid">
            Username can't be longer then 16 or less then 4 letters!
          </div>
        </div>

        <div class="mb-4">
          <input type="password" placeholder="Password" v-model="password" id="password" />
          <div class="notValid" v-show="!correctPassword">
            Password has to contain atleast one upperletter and a number.
          </div>
        </div>

        <div class="mb-4">
          <input v-model="email" placeholder="Email" id="email" />
          <div class="notValid" v-show="!correctEmail">This is not correct!</div>
        </div>

        <div class="mb-4">
          <label for="language">Preferred Languages:</label>
          <select v-model="selectedLanguage" id="language">
            <option v-for="i in language.languagesAllGetList" :value="i.language_id">
              {{ i.languagename }}
            </option>
          </select>

          <div v-show="submittingLanguage && !selectedLanguage" class="notValid">
            Choose a language!
          </div>
        </div>

        <div>
          <button type="submit">Register</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style src="../assets/css/registerPage_css.css" scoped></style>

<script setup>
import router from '@/router'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { uselanguagesStore } from '@/stores/LanguageStore.js'
import { useUsersStore } from '@/stores/UserStore.js'

const language = uselanguagesStore()
language.getAllLanguages()
const log = useUsersStore()

const accountName = ref('')
const password = ref('')
const email = ref('')
const correctAccountName = ref(true)
const correctPassword = ref(true)
const selectedLanguage = ref(null)
const submittingLanguage = ref(false)
const correctEmail = ref(true)

const register = () => {
  const usernameById = document.getElementById('username')
  const passwordById = document.getElementById('password')
  const languageById = document.getElementById('language')
  const emailById = document.getElementById('email')

  const upperLetters = ['A','Á','B','C','Cs', 'D', 'Dz','Dzs','E','É', 'F', 'G','Gy','H','I','Í','J','K','L','Ly','M','N','Ny','O','Ó','Ö','Ő','P','R','S','Sz','T','Ty','U','Ú','Ü','Ű', 'V', 'Z', 'Zs', 'Q','W','X','Y',]

  let containsUpperLetter = false

  correctAccountName.value = accountName.value.length >= 4 && accountName.value.length < 16

  if (!correctAccountName.value) {
    usernameById.style.borderColor = 'red'
  } else {
    usernameById.style.borderColor = 'black'
  }

  let correctEmailBoolean = false

  if (email.value.includes('@') && email.value.includes('.')) {
    correctEmailBoolean = true
  }

  correctEmail.value = correctEmailBoolean

  if (!correctEmail.value) {
    emailById.style.borderColor = 'red'
  } else {
    emailById.style.borderColor = 'black'
  }

  const nummbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  let hasNumbers = false

  upperLetters.forEach((element, index) => {
    if (password.value.includes(element)) {
      containsUpperLetter = true
    }
  })

  nummbers.forEach((element, index) => {
    if (password.value.includes(element)) {
      hasNumbers = true
    }
  })

  correctPassword.value =
    hasNumbers && containsUpperLetter && password.value.length > 5 && password.value.length < 16

  if (!correctPassword.value) {
    passwordById.style.borderColor = 'red'
  } else {
    passwordById.style.borderColor = 'black'
  }

  submittingLanguage.value = true

  if (selectedLanguage.value === '') {
    languageById.style.borderColor = 'red'
  } else {
    languageById.style.borderColor = 'black'
  }

  if (submittingLanguage.value && correctPassword.value && correctAccountName.value) {
    log.registertUser(accountName.value, password.value, email.value, selectedLanguage.value)
  }
}
</script>
