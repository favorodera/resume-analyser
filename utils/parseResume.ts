import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'
import type { TextItem } from 'pdfjs-dist/types/src/display/api'

export default async function parseResume(resume: Buffer, mimeType: string): Promise<string> {
  try {
    const arrayBuffer = resume.buffer.slice(resume.byteOffset, resume.byteOffset + resume.byteLength)

    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const parsedResume = await mammoth.extractRawText({ arrayBuffer })
      return parsedResume.value
    }

    if (mimeType === 'text/plain') {
      const parsedResume = resume.toString('utf-8')
      return parsedResume
    }

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let parsedResume = ''
    for (let numberOfPages = 1; numberOfPages <= pdf.numPages; numberOfPages++) {
      const page = await pdf.getPage(numberOfPages)
      const content = await page.getTextContent()
      parsedResume += content.items.map(item => (item as TextItem).str).join(' ')
    }
    return parsedResume
  }
  catch (error) {
    passNotification('Failed to parse resume')
    throw new Error(`Failed to parse resume: ${error}`)
  }
}
