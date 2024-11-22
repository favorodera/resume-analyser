import useAnalyserStore from '~/stores/analyserStore'

export default function passNotification(message: string) {
  const analyserStore = useAnalyserStore()

  analyserStore.analyserNotification = message

  setTimeout(() => {
    analyserStore.analyserNotification = undefined
  }, 3000)
}
