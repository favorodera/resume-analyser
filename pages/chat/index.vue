<!-- eslint-disable vue/no-v-html -->
<template>
  <main class="flex-1 w-full flex flex-col items-center justify-between gap-y-20">
    <TransitionGroup
      ref="chatContainer"
      name="chat-bubbles"
      tag="section"
      class="w-full flex flex-col items-center gap-8 flex-[1_1_0] overflow-auto py-4 chat-container"
    >
      <div
        v-for="(chatFragment, index) in chatHistory"
        :key="index"
        :class="{
          'items-end': index % 2 === 0,
          'items-start flex-col-reverse': index % 2 !== 0,
        }"
        class="flex flex-col gap-2 max-w-3xl w-full break-all "
      >
        <div
          v-if="index % 2 === 0 && chatFragment.parts[0].text !== ''"
          class="flex gap-1 flex-row-reverse self-end sticky top-[-1.25rem] bg-#121212  w-full"
        >
          <i class="i-heroicons-user text-blue-5 size-6 flex-shrink-0 " />
          <p class="font-semibold">
            ME
          </p>
        </div>

        <div
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

          <span
            v-else
            class="flex flex-col gap-2 bg-#1e1f20 rounded-2xl p-4"
            v-html="markdown.render(part.text)"
          />
        </div>

        <div
          v-if="index % 2 !== 0"
          class="flex gap-1 self-start sticky top-[-1.25rem] bg-#121212  w-full"
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

    <form class="flex gap-4 rounded-xl w-full items-end justify-between max-w-3xl bg-#1e1f20 p-2">
      <textarea
        id="chat-textarea"
        ref="textarea"
        v-model="analyserStore.prompt"
        name="chat-textarea"
        placeholder="Type your prompt here..."
        class="w-full outline-none bg-transparent resize-none"
        maxlength="1000"
        @input="textareaAutoGrow"
        @keydown.enter.self.exact="activateAnalyser(undefined, analyserStore.prompt)"
      />
      <button
        type="submit"
        class="bg-#217BFE hover:bg-#1e1f20 text-white rounded-2xl"
        @click.prevent="activateAnalyser(undefined, analyserStore.prompt)"
      >
        <i class="i-heroicons-paper-airplane size-6" />
      </button>
    </form>
  </main>
</template>

<script setup lang="ts">
import markdownIt from 'markdown-it'
import useAnalyserStore from '~/stores/analyserStore'

const analyserStore = useAnalyserStore()
const textarea = ref<HTMLTextAreaElement>()
const chatContainer = ref<HTMLElement>()

const markdown = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

const { data: chatHistory } = await useLazyAsyncData('analysis',
  async () => analyserStore.chatHistory,
  { server: false },
)

function textareaAutoGrow() {
  if (!textarea.value) return

  textarea.value.style.height = 'auto'
  textarea.value.style.height = `${textarea.value.scrollHeight}px`
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
  transition: all 0.5s ease;
}

.chat-bubbles-enter-from,
.chat-bubbles-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.chat-bubbles-leave-active {
  position: absolute;
}
</style>
