import useAnalyserStore from '~/stores/analyserStore'

export default async function activateAnalyser(selectedResume?: File | null | undefined, prompt?: string) {
  if (!selectedResume && !prompt) return

  const analyserStore = useAnalyserStore()
  const isNewAnalysis = useRoute().path === '/'

  const resumeFormData = new FormData()

  if (selectedResume) {
    resumeFormData.append('resume', selectedResume)
  }

  if (prompt) {
    resumeFormData.append('prompt', prompt)
  }

  try {
    analyserStore.prompt = ''

    if (isNewAnalysis) {
      analyserStore.chatHistory = []
      await navigateTo('/chat')
    }

    analyserStore.chatHistory.push({
      role: 'user',
      parts: [{ text: prompt ?? '' }],
    })

    const analysis = await $fetch('/api/analyseResume', {
      method: 'POST',
      body: resumeFormData,
    })

    analyserStore.chatHistory.push({
      role: 'model',
      parts: [{ text: analysis }],
    })

    return
  }
  catch (error) {
    throw new Error(`Failed to activate analyser: ${error}`)
  }
}
