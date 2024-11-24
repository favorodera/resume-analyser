<!-- eslint-disable vue/no-v-html -->
<template>
  <main class="flex-[1_1_auto] w-full flex flex-col items-center justify-between gap-y-20">
    <TransitionGroup
      ref="chatContainer"
      name="chat-bubbles"
      tag="section"
      class="w-full flex flex-col items-center gap-8 flex-[1_1_0] pt-4 overflow-auto chat-container relative"
    >
      <div
        v-for="(chatFragment, index) in chatHistory"
        :key="index"
        :class="{
          'items-end': index % 2 === 0,
          'items-start flex-col-reverse': index % 2 !== 0,
        }"
        class="flex flex-col gap-2 max-w-3xl w-full break-all"
      >
        <div
          v-if="index % 2 === 0 && chatFragment.parts[0].text !== ''"
          class="flex gap-1 flex-row-reverse self-end sticky -top-5 bg-#121212 w-full"
        >
          <i class="i-heroicons-user text-blue-5 size-6 flex-shrink-0" />
          <p class="font-semibold">
            ME
          </p>
        </div>

        <template
          v-for="part in chatFragment.parts"
          :key="part.text"
        >
          <div
            v-if="index % 2 === 0"
            class="bg-#1e1f20 rounded-2xl p-4 max-h-40 overflow-x-auto"
            :class="{
              hidden: part.text === '',
            }"
          >
            <span>{{ part.text }}</span>
          </div>

          <div
            v-else
            class="w-full flex flex-col gap-2 bg-#1e1f20 rounded-2xl p-4"
          >
            <template v-if="analyserStore.analyserState.analysing && (!part.text || part.text === '')">
              <div class=" w-full flex flex-col gap-4 animate-pulse">
                <div class="h-4 bg-gray-700 rounded w-3/4" />
                <div class="h-4 bg-gray-700 rounded w-1/2" />
                <div class="h-4 bg-gray-700 rounded w-5/6" />
              </div>
            </template>
            <div
              v-else
              v-html="markdown.render(part.text)"
            />
          </div>
        </template>

        <div
          v-if="index % 2 !== 0"
          class="flex gap-1 self-start sticky -top-5 bg-#121212 w-full"
        >
          <i
            class="i-heroicons:document-text-20-solid size-5 text-blue-5 flex-shrink-0"
          />
          <p class="font-semibold">
            RESUME
          </p>
        </div>
      </div>
    </TransitionGroup>

    <section class="w-full max-w-3xl flex flex-col gap-4">
      <div class="w-full flex items-center justify-start gap-4">
        <button
          class="bg-#1e1f20 disabled:opacity-50 hover:bg-#1e1f20/50 text-white rounded-md property-all flex items-center gap-1 duration-500 delay-50 ease p-2 text-xs self-end"
          :disabled="analyserStore.analyserState.analysing"
          @click="startNewChat()"
        >
          New Chat
          <i class="i-heroicons:chat-bubble-oval-left size-4" />
        </button>
        <button
          class="bg-#1e1f20 disabled:opacity-50 hover:bg-#1e1f20/50 text-white rounded-md flex items-center gap-1 property-all duration-500 delay-50 ease p-2 text-xs self-end"
          :disabled="analyserStore.analyserState.analysing"
          @click="navigateTo('/')"
        >
          New Resume Analysis
          <i class="i-heroicons:book-open size-4" />
        </button>
      </div>

      <form class="flex gap-4 rounded-xl w-full items-end justify-between bg-#1e1f20 p-2">
        <textarea
          id="chat-textarea"
          ref="textarea"
          v-model="analyserStore.prompt"
          name="chat-textarea"
          placeholder="Type your prompt here..."
          class="w-full outline-none bg-transparent resize-none"
          maxlength="1000"
          @input="textareaAutoGrow"
          @keydown.enter.exact="enterKeyModification"
        />
        <button
          type="submit"
          class=" group disabled:opacity-50"
          :disabled="analyserStore.analyserState.analysing || !analyserStore.prompt"
          @click.prevent="activateAnalyser(undefined, analyserStore.prompt)"
        >
          <i
            :class="{
              'opacity-50  text-rose size-8 i-heroicons-stop': analyserStore.analyserState.analysing,
              'i-heroicons-paper-airplane size-6 group-hover:text-blue': !analyserStore.analyserState.analysing,
            }"
          />
        </button>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import markdownIt from 'markdown-it'
import useAnalyserStore from '~/stores/analyserStore'

const analyserStore = useAnalyserStore()
const textarea = ref<HTMLTextAreaElement>()
const chatContainer = ref()

const markdown = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

onBeforeMount(() => {
  const localStorageChatHistory = localStorage.getItem('chatHistory')
  if (localStorageChatHistory) {
    analyserStore.chatHistory = JSON.parse(localStorageChatHistory)
  }
})

onMounted(() => {
  chatContainer.value = document.querySelector('.chat-container')
  if (analyserStore.chatHistory.length > 0) {
    setTimeout(() => {
      const lastMessage = chatContainer.value?.lastElementChild
      if (lastMessage) {
        lastMessage.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }, 100)
  }
  textarea.value?.focus()
})

const { data: chatHistory, refresh } = await useLazyAsyncData('analysis',
  async () => analyserStore.chatHistory,
  { server: false },
)

function textareaAutoGrow() {
  if (!textarea.value) return

  textarea.value.style.height = 'auto'
  textarea.value.style.height = `${textarea.value.scrollHeight}px`
}

function startNewChat() {
  analyserStore.chatHistory = []
  localStorage.removeItem('chatHistory')
  refresh()
  passNotification('New Chat Started')
  textarea.value?.focus()
}

function enterKeyModification(event: KeyboardEvent) {
  const isMobileOrTablet = window.matchMedia('(max-width: 768px)').matches

  if (event.key === 'Enter') {
    if (isMobileOrTablet) {
      return true
    }
    else if (!event.shiftKey && !analyserStore.analyserState.analysing) {
      event.preventDefault()
      activateAnalyser(undefined, analyserStore.prompt)
    }
  }
}
</script>

<style scoped lang="scss">
.chat-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.chat-container::-webkit-scrollbar {
  display: none;
}

.chat-bubbles-move,
.chat-bubbles-enter-active,
.chat-bubbles-leave-active {
  transition: all 1s ease;
}

.chat-bubbles-enter-from,
.chat-bubbles-leave-to {
  opacity: 0;
}
</style>
