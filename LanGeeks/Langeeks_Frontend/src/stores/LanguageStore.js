import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import { useUsersStore} from './UserStore.js'

export const uselanguagesStore = defineStore('languagesStore', () => {
  const languagesAllGetList = ref([])
  const toast = useToast()
  const newLanguage = ref([])
  const users = useUsersStore()

  const getAllLanguages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/languages')
      languagesAllGetList.value = response.data
    } catch (error) {
      console.error('Getting all the Languages failed:')
    }
  }

  const userChangeLanguagePut = async (language_id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/usersLanguage`,
        { language_id },
        { withCredentials: true },
      )

      if (response.status === 200) {
        toast.success('Succesfully updated your language preferences!')
        console.log(response.data.languagename)
        newLanguage.value = response.data.languagename
        users.LoggedInUser.languagename = response.data.languagename
      }
    } catch (error) {
      if (error.status === 400) {
        toast.warning('Please choose a different language!')
      }
      console.error('Failed changing the langauge.')
    }
  }

  return { languagesAllGetList, getAllLanguages, userChangeLanguagePut, newLanguage }
})
