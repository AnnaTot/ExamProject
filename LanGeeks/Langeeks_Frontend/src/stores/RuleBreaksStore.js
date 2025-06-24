import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'

export const useRuleBreaksStore = defineStore('rulebreaksStore', () => {
  const toast = useToast()

  const ruleBreaksPost = async (rulebreak_descripson) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/RuleBreaks',
        { rulebreak_descripson },
        { withCredentials: true },
      )

      if (response.status === 201) {
        toast.success('Successfully sent to the Admin!!!!')
      }
    } catch (error) {
      console.error('Posting a notification failed.')
    }
  }

  return { ruleBreaksPost }
})
