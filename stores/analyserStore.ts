const useAnalyserStore = defineStore('analyser', () => {
  const prompt = ref('')

  const chatHistory = ref<ChatHistory>([])

  const analyserState = reactive({
    analysing: false,
    checkingForOldChat: false,
  })

  const analyserNotification = ref<string | undefined>()

  return {
    prompt,
    chatHistory,
    analyserState,
    analyserNotification,
  }
})

export default useAnalyserStore
