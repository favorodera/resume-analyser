import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'
import type { TextItem } from 'pdfjs-dist/types/src/display/api'
import 'pdfjs-dist/build/pdf.worker.min.mjs'
import passNotification from '~/utils/passNotification'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.min.mjs'

export default async function parseResume(resume: File, mimeType: string): Promise<string> {
  try {
    const resumeArrayBuffer = await resume.arrayBuffer()

    switch (mimeType) {
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword': {
        const parsedDoc = await mammoth.extractRawText({ arrayBuffer: resumeArrayBuffer })
        return parsedDoc.value
      }

      case 'application/pdf': {
        const pdf = await pdfjsLib.getDocument({ data: resumeArrayBuffer }).promise
        let parsedPdf = ''
        for (let numberOfPages = 1; numberOfPages <= pdf.numPages; numberOfPages++) {
          const page = await pdf.getPage(numberOfPages)
          const content = await page.getTextContent()
          parsedPdf += content.items.map(item => (item as TextItem).str).join(' ')
        }
        return parsedPdf
      }

      default:
        return resume.toString()
    }
  }
  catch (error) {
    passNotification('Failed to parse resume')
    throw new Error(`Failed to parse resume: ${error}`)
  }
}
