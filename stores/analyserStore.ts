const useAnalyserStore = defineStore('analyser', () => {
  const prompt = ref('')
  const chatHistory = ref<ChatHistory>([])

  return {
    prompt,
    chatHistory,
  }
})

export default useAnalyserStore
