import useAnalyserStore from '~/stores/analyserStore'

export default async function activateAnalyser(selectedResume?: File | null | undefined, prompt?: string) {
  if (!selectedResume && !prompt) return

  const analyserStore = useAnalyserStore()
  const isNewAnalysis = useRoute().path === '/'
  const chatContainer = document.querySelector('.chat-container')
  const textarea = document.getElementById('chat-textarea')
  let temporaryPromptHolder = ''

  const resumeFormData = new FormData()

  if (selectedResume) {
    resumeFormData.append('resume', selectedResume)
  }

  if (prompt) {
    resumeFormData.append('prompt', prompt)
  }

  try {
    temporaryPromptHolder = analyserStore.prompt

    analyserStore.prompt = ''

    if (isNewAnalysis) {
      analyserStore.chatHistory = []
      localStorage.removeItem('chatHistory')
      await navigateTo('/chat')
    }

    analyserStore.chatHistory.push({
      role: 'user',
      parts: [{ text: prompt ?? '' }],
    })

    analyserStore.analyserState.analysing = true

    setTimeout(() => {
      const lastMessage = chatContainer?.lastElementChild
      if (lastMessage) {
        lastMessage.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }, 100)

    const analysis = await $fetch('/api/analyseResume', {
      method: 'POST',
      body: resumeFormData,
    })

    analyserStore.chatHistory.push({
      role: 'model',
      parts: [{ text: analysis }],
    })

    setTimeout(() => {
      const lastMessage = chatContainer?.lastElementChild
      if (lastMessage) {
        lastMessage.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
      textarea?.focus()
    }, 100)

    localStorage.setItem('chatHistory', JSON.stringify(analyserStore.chatHistory))

    return
  }
  catch (error) {
    if (isNewAnalysis) {
      await navigateTo('/')
      analyserStore.chatHistory = []
    }
    else {
      analyserStore.chatHistory.pop()
      analyserStore.prompt = temporaryPromptHolder
    }

    passNotification('Failed to activate analyser')

    throw new Error(`Failed to activate analyser: ${error}`)
  }
  finally {
    analyserStore.analyserState.analysing = false
  }
}
