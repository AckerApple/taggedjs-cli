import { tagElement } from 'taggedjs'
import { app } from './app.tag.js'

export const run = () => {
  document.querySelectorAll('app').forEach(element => {
    tagElement(app, element, {})
  })
}

run()