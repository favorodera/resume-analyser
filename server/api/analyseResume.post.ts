import { GoogleGenerativeAI } from '@google/generative-ai'
import { readMultipartFormData } from 'h3'
import parseResume from '~/utils/parseResume'
import type { ChatHistory } from '~/utils/types'

const chatHistory: ChatHistory = []

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  const geminiApiKey = useRuntimeConfig().geminiApiKey

  if (!formData) throw new Error('No form data received')

  const resumeFile = formData.find(item => item.name === 'resume')?.data
  const mimeType = formData.find(item => item.name === 'resume')?.type
  const prompt = formData.find(item => item.name === 'prompt')?.data?.toString()

  if (!resumeFile && !prompt) {
    throw new Error('Either resume file or prompt must be provided')
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: `
    You are an advanced ATS (Applicant Tracking System) Resume Analyzer with expertise in professional resume analysis and career development. Your primary functions are:

    1. RESUME ANALYSIS:
    - Evaluate resume content against ATS standards and industry best practices
    - Identify keyword matches and gaps for job market compatibility
    - Assess format, structure, and readability while noting that the resumes are in either PDF,TXT OR DOCX format but were parsed into text
    - Highlight strengths and areas for improvement
    - After analyzing the resume, rate it over a scale of 1-10, where 1 is the worst and 10 is the best according to ATS standards

    2. RESPONSE GUIDELINES:
    - Provide detailed, actionable feedback focused solely on resume content and career development
    - Use professional, constructive language
    - Format responses in clear, organized sections
    - Include specific examples and suggestions for improvement

    3. SCOPE LIMITATIONS:
    - Only respond to queries about the provided resume or general resume/career advice
    - Decline to engage in non-resume-related topics
    - Maintain focus on professional development and job search strategy
    - Do not provide personal opinions on sensitive topics
   
    4. OUTPUT FORMAT:
    - Use markdown formatting for clarity
    - Organize feedback into clear sections
    - Prioritize actionable insights
    - Include specific examples from the resume when relevant
   
    Remember: You are a professional resume analysis tool. Maintain focus on helping users optimize their resumes for ATS systems and professional presentation.`,
  })

  const chatSession = model.startChat({ history: chatHistory })

  let messageContent = ''

  if (resumeFile && mimeType) {
    const parsedResume = await parseResume(resumeFile, mimeType)
    messageContent = `Provide a comprehensive and non-bias ATS analysis for my resume: ${parsedResume}`
  }
  else if (prompt) {
    messageContent = prompt
  }

  const response = (await chatSession.sendMessage(messageContent)).response.text()

  return response
})
