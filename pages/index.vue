<template>
  <main class="flex-1 w-full flex flex-col items-center justify-center gap-y-20">
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
const featuresCardContent = ref([
  {
    title: 'ATS Compatibility Check',
    description: 'Analyze how well your resume performs against common ATS systems and receive a detailed compatibility score.',
  },
  {
    title: 'Keyword Optimization',
    description: 'Identify missing keywords and phrases that are commonly sought after by employers in your industry.',
  },
  {
    title: 'Smart Recommendations',
    description: 'Get personalized suggestions to enhance your resume format, content, and structure for better visibility.',
  },
])

const selectedResumeNameHolder = ref('')

async function callAnalyserActivator(event: Event) {
  const fileInput = event.target as HTMLInputElement

  const selectedResume = fileInput.files?.item(0)

  selectedResumeNameHolder.value = selectedResume?.name ?? ''

  activateAnalyser(selectedResume)

  return
}
</script>
