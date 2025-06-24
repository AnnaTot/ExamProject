import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'

export const useNotificationsStore = defineStore('NotificationsStore', () => {
  const notificationsByIdList = ref([])
  const toast = useToast()

  const notificationsGetById = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/notificationsByuserId`, {
        withCredentials: true,
      })
      notificationsByIdList.value = response.data
    } catch (error) {
      console.error('Getting the notification failed.')
    }
  }

  const notificationsPost = async (sent_to_group, groupadmin_id, message) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/notifications',
        { sent_to_group, groupadmin_id, message },
        { withCredentials: true },
      )

      if (response.status === 201) {
        toast.success('Request succesfully sent!')
      }
    } catch (error) {
      if (error.status === 400) {
        toast.warning('You have already sent a request to this group!')
      }

      console.error('no notifications')
    }
  }

  const notificationsDelete = async (notification_id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/notifications/${notification_id}`)

      if (response.status === 200) {
        toast.success('Succesfully canceled!')
      }

      notificationsByIdList.value = notificationsByIdList.value.filter(
        (notification) => notification.notification_id !== notification_id,
      )
    } catch (error) {
      console.error('Deleting the notification failed.')
    }
  }

  return { notificationsByIdList, notificationsGetById, notificationsPost, notificationsDelete }
})
