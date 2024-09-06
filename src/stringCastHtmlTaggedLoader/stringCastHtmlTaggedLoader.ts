import { stringCastHtmlTagged } from "./stringCastHtmlTagged.function.js"

export default function stringCastHtmlTaggedLoader(this: any, source: string) {
    const resourcePath = this.resourcePath;  
    return stringCastHtmlTagged(source, resourcePath);
}
