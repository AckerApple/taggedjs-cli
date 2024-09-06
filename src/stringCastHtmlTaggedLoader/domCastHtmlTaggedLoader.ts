import domCastTagged from "./domCastTagged.function.js"

export default function domCastHtmlTaggedLoader(this: any, source: string) {
    const resourcePath = this.resourcePath
    return domCastTagged(source, resourcePath)
}
