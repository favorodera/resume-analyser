import useAnalyserStore from '~/stores/analyserStore'

export default async function activateAnalyser(selectedResume?: File | null | undefined, prompt?: string) {
  if (!selectedResume && !prompt) return

  const analyserStore = useAnalyserStore()
  const isNewAnalysis = useRoute().path === '/'
  const chatContainer = document.querySelector('.chat-container')
  let temporaryPromptHolder = ''

  const resumeFormData = new FormData()

  if (selectedResume) {
    try {
      const parsedResume = await parseResume(selectedResume, selectedResume.type)
      resumeFormData.append('parsedResume', parsedResume)
    }
    catch (error) {
      passNotification('Failed to parse resume')
      throw new Error(`Failed to parse resume: ${error}`)
    }
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

    analyserStore.chatHistory.push({
      role: 'model',
      parts: [{ text: '' }],
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

    if (analyserStore.chatHistory.length >= 2) {
      analyserStore.chatHistory[analyserStore.chatHistory.length - 1].parts[0].text = analysis
    }

    setTimeout(() => {
      const lastMessage = chatContainer?.lastElementChild
      if (lastMessage) {
        lastMessage.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
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
      analyserStore.chatHistory.splice(-2, 2)
      analyserStore.prompt = temporaryPromptHolder
    }

    passNotification('Failed to activate analyser')

    throw new Error(`Failed to activate analyser: ${error}`)
  }
  finally {
    analyserStore.analyserState.analysing = false
  }
}
