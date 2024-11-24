<template>
  <main class="flex-[1_1_auto] w-full flex flex-col items-center justify-start gap-y-20">
    <button
      class="bg-#1e1f20 hover:bg-#1e1f20/50 text-white rounded-xl text-xs property-all duration-500 delay-50 ease p-4 self-end"
      @click="navigateTo('/chat')"
    >
      I just want to chat
    </button>

    <header class="flex flex-col items-center justify-center gap-4">
      <h1 class="text-3xl font-bold">
        Resume Analyser
      </h1>

      <p class="text-center">
        Get instant, AI-powered feedback on your resume's compatibility with Applicant Tracking Systems (ATS).
      </p>
    </header>

    <section class="flex flex-col items-center justify-center gap-4">
      <h2 class="text-xl font-bold text-center">
        What can I do with this?
      </h2>

      <div class="w-full grid md:grid-cols-3 items-center justify-center gap-4">
        <div
          v-for="feature in featuresCardContent"
          :key="feature.title"
          class="flex flex-col items-center justify-center h-full shadow-neutral-8 hover:shadow-neutral-7 property-shadow duration-1000 delay-50 ease shadow-md gap-4 rounded-md bg-neutral-9 p-4 "
        >
          <h3 class="text-lg font-semibold">
            {{ feature.title }}
          </h3>

          <p class="text-md">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </section>

    <div class="flex flex-col items-center gap-4">
      <label
        for="resume-file"
        class="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 max-w-[12rem] "
      >
        <i
          :class="selectedResumeNameHolder ? 'i-svg-spinners-180-ring' : 'i-heroicons:arrow-up-tray-solid'"
          class="size-5 shrink-0"
        />
        <p class="truncate text-sm">{{ selectedResumeNameHolder ? selectedResumeNameHolder : 'Upload Resume' }}</p>
      </label>
      <input
        id="resume-file"
        type="file"
        name="resume-file"
        accept=".pdf,.txt,.docx"
        class="hidden"
        @change="async(event) => await callAnalyserActivator(event)"
      >
      <p class="text-sm text-gray-500">
        Supported formats: PDF, TXT, DOCX
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedResumeNameHolder = ref('')

const featuresCardContent = [
  {
    title: 'ATS Compatibility Check',
    description: 'Get instant feedback on how well your resume will perform with Applicant Tracking Systems used by employers.',
  },
  {
    title: 'Smart Resume Analysis',
    description: 'Receive detailed insights about your resume\'s content, format, and potential areas for improvement.',
  },
  {
    title: 'Interactive Chat Interface',
    description: 'Engage in a conversation about your resume, ask general career questions, and get personalized recommendations for enhancement.',
  },
]

async function callAnalyserActivator(event: Event) {
  const fileInput = event.target as HTMLInputElement

  const selectedResume = fileInput.files?.item(0)

  selectedResumeNameHolder.value = selectedResume?.name ?? ''

  activateAnalyser(selectedResume)

  return
}
</script>
