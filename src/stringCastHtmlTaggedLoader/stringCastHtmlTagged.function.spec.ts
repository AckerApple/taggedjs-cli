import { stringCastHtmlTagged, ParsedResults, stringCastHtml } from './stringCastHtmlTagged.function'
import { parseHtmlTemplates, removeInterpolatedValues } from './parseHtmlTemplates.function'
// import fs from 'fs'
// import path from 'path'
import { reconstructCode } from './reconstructCode.function'

// import { exchangeParsedForValues } from 'taggedjs/js/interpolations/optimizers/exchangeParsedForValues.function'
// import { htmlInterpolationToDomMeta } from 'taggedjs/js/interpolations/optimizers/htmlInterpolationToDomMeta.function'

// not testable - getDomMeta cannot use import?
// import { reconstructedToOutput } from './reconstructedToOutput.function'

describe('stringCastHtmlTagged.function.spec.ts', () => {
  it('basic', () => {
    const result = stringCastHtmlTagged('something fun html\`html variable\`', '')
    // console.debug(JSON.stringify(result))
    expect(result).toBe("something fun html(allStrings[0])\nconst allStrings: (string[])[] = [{\"strings\":[\"html variable\"],\"valueCount\":0}]")
  })

  it('basic2', () => {
    const result = stringCastHtmlTagged('something fun html\`html variable one\` - html\`html variable two\`', '')
    // console.debug(JSON.stringify(result))
    expect(result).toBe("something fun html(allStrings[0]) - html(allStrings[1])\nconst allStrings: (string[])[] = [{\"strings\":[\"html variable one\"],\"valueCount\":0},{\"strings\":[\"html variable two\"],\"valueCount\":0}]")
  })

  it('basic3', () => {
    const string = 'something fun html\`html variable one\` - html\`html variable two - ${2} - ${3} - end\`'
    const result0 = parseHtmlTemplates(string)
    const result = stringCastHtmlTagged(string, '')
    // console.debug(JSON.stringify(result))
    expect(result).toBe("something fun html(allStrings[0]) - html(allStrings[1], 2, 3)\nconst allStrings: (string[])[] = [{\"strings\":[\"html variable one\"],\"valueCount\":0},{\"strings\":[\"html variable two - \",\" - \",\" - end\"],\"valueCount\":2}]")
    expect(result0).toEqual([
      'something fun ',
      {
        html: 'html variable one',
        strings: [ 'html variable one' ],
        values: []
      },
      ' - ',
      {
        html: 'html variable two - ${2} - ${3} - end',
        strings: [ 'html variable two - ', ' - ', ' - end' ],
        values: [ '2', '3' ]
      }
    ])
  })

  it('something', () => {
    const innerHtml = '<div>${3}</div>'
    const htmlString = 'html`' + innerHtml + '`'
    const parsed = parseHtmlTemplates(htmlString);
    expect(parsed).toEqual([
      {
        html: '<div>${3}</div>',
        strings: [ '<div>', '</div>' ],
        values: [ '3' ]
      }
    ])
  })

  it('html with function', () => {
    const innerHtml = '<div ondragstart="const {e,dt,t} = {t:this,e:event,dt:event.dataTransfer};const d=t.drag=t.drag||{x:0,y:0};d.initX=d.x;d.startX=event.clientX-t.offsetLeft;d.startY=event.clientY-t.offsetTop;t.ondragover=e.target.ondragover=(e)=>e.preventDefault();dt.effectAllowed=\'move\';dt.dropEffect=\'move\'" onclick=${onclickFun}>${3}</div>'
    const htmlString = 'html`' + innerHtml + '`'
    const parsed = parseHtmlTemplates(htmlString);
    expect(parsed).toEqual([
      {
        html: '<div ondragstart="const {e,dt,t} = {t:this,e:event,dt:event.dataTransfer};const d=t.drag=t.drag||{x:0,y:0};d.initX=d.x;d.startX=event.clientX-t.offsetLeft;d.startY=event.clientY-t.offsetTop;t.ondragover=e.target.ondragover=(e)=>e.preventDefault();dt.effectAllowed=\'move\';dt.dropEffect=\'move\'" onclick=${onclickFun}>${3}</div>',
        strings: [ '<div ondragstart="const {e,dt,t} = {t:this,e:event,dt:event.dataTransfer};const d=t.drag=t.drag||{x:0,y:0};d.initX=d.x;d.startX=event.clientX-t.offsetLeft;d.startY=event.clientY-t.offsetTop;t.ondragover=e.target.ondragover=(e)=>e.preventDefault();dt.effectAllowed=\'move\';dt.dropEffect=\'move\'" onclick=', '>', '</div>' ],
        values: [ 'onclickFun', '3' ]
      }
    ])
  })

  it('spacing test', () => {
    const innerHtml = 'hello \n \t <b>${3}</b> \n\t world'
    const htmlString = 'html`' + innerHtml + '`'
    const stringCast = stringCastHtml(htmlString)
    const reconstructed = reconstructCode(stringCast as ParsedResults, 'allStrings')
    expect(reconstructed.allStrings[0].strings[0]).toBe('hello <b>')
    expect(reconstructed.allStrings[0].strings[1]).toBe('</b> world')

    const result = stringCastHtmlTagged(htmlString, '')
    // console.debug(JSON.stringify(result))
    expect(result).toBe("html(allStrings[0], 3)\nconst allStrings: (string[])[] = [{\"strings\":[\"hello <b>\",\"</b> world\"],\"valueCount\":1}]")
  })

  it('basic4', () => {
    const string1 = 'something fun html\`html variable one\` - html\`html variable two - ${2} - ${html`<div>${3}</div>`} - end\`'
    const result1 = parseHtmlTemplates(string1)
    expect(result1).toEqual([
      'something fun ',
      {
        html: 'html variable one',
        strings: [ 'html variable one' ],
        values: []
      },
      ' - ',
      {
        html: 'html variable two - ${2} - ${html`<div>${3}</div>`} - end',
        strings: [ 'html variable two - ', ' - ', ' - end' ],
        values: [ '2', 'html`<div>${3}</div>`' ]
      }
    ])

    const result = stringCastHtmlTagged(string1, '')
    // console.debug(JSON.stringify(result))
    expect(result).toBe("something fun html(allStrings[0]) - html(allStrings[1], 2, html(allStrings[2], 3))\nconst allStrings: (string[])[] = [{\"strings\":[\"html variable one\"],\"valueCount\":0},{\"strings\":[\"html variable two - \",\" - \",\" - end\"],\"valueCount\":2},{\"strings\":[\"<div>\",\"</div>\"],\"valueCount\":1}]")
  })

  it('basic5', () => {
    const string = 'something fun html\`<div>${ 1 == 1 ? "a" : html`<fieldset>hello ${2} world<fieldset>` }</div>\`'
    const result0 = parseHtmlTemplates(string)
    expect(result0).toEqual([
      'something fun ',
      {
        html: '<div>${ 1 == 1 ? "a" : html`<fieldset>hello ${2} world<fieldset>` }</div>',
        strings: [ '<div>', '</div>' ],
        values: [ '1 == 1 ? "a" : html`<fieldset>hello ${2} world<fieldset>`' ]
      }
    ])
    
    const result = stringCastHtmlTagged(string, '')
    // console.debug(JSON.stringify(result, null, 2))
    expect(result).toBe("something fun html(allStrings[0], 1 == 1 ? \"a\" : html(allStrings[1], 2))\nconst allStrings: (string[])[] = [{\"strings\":[\"<div>\",\"</div>\"],\"valueCount\":1},{\"strings\":[\"<fieldset>hello \",\" world<fieldset>\"],\"valueCount\":1}]")
  })

  it('complex', () => {
    const string = 'startHTML--html`start-string**"${\'{\'}22${\'}\'}"**end-string`--endHTML'
    const result = stringCastHtmlTagged(string, '')
    // console.debug('result',JSON.stringify(result))
    expect(result).toBe("startHTML--html(allStrings[0], '{', '}')--endHTML\nconst allStrings: (string[])[] = [{\"strings\":[\"start-string**\\\"\",\"22\",\"\\\"**end-string\"],\"valueCount\":2}]");
  })

  it('removeInterpolatedValues', () => {
    const string = "startHTML--html`start-string**\"${'{'}22${'}'}\"**end-string`--endHTML";
    const result = removeInterpolatedValues(string)
    expect(result.strings).toEqual([
      'startHTML--html`start-string**"',
      '22',
      '"**end-string`--endHTML'
    ])
    expect(result.strings.length).toBe(3)
    expect(result.values.length).toBe(2)
    expect(result.values[0]).toBe("'{'")
    expect(result.values[1]).toBe("'}'")
  })

  it('removeInterpolatedValues - 2', () => {
    const string = "startHTML--html`start-string**\"${ 1==0 ? 'true' : false }\"**end-string`--endHTML";
    const result = removeInterpolatedValues(string)
    expect(result.strings).toEqual([
      'startHTML--html`start-string**"',
      '"**end-string`--endHTML'
    ])
    expect(result.strings.length).toBe(2)
    expect(result.values.length).toBe(1)
    expect(result.values[0]).toBe("1==0 ? 'true' : false")
  })

  it('arrayTests.ts - limited', () => {
    const string = 'return html`<div>${players.length > 0 && html`<button oninit=${fadeInDown} ondestroy=${fadeOutUp} style="--animate-duration: .1s;" onclick=${() => players.length = 0}>remove all</button>`}</div>`'
    const result = stringCastHtmlTagged(string, '')
    // console.debug('result', JSON.stringify(result))
    expect(result).toBe("return html(allStrings[0], players.length > 0 && html(allStrings[1], fadeInDown, fadeOutUp, () => players.length = 0))\nconst allStrings: (string[])[] = [{\"strings\":[\"<div>\",\"</div>\"],\"valueCount\":1},{\"strings\":[\"<button oninit=\",\" ondestroy=\",\" style=\\\"--animate-duration: .1s;\\\" onclick=\",\">remove all</button>\"],\"valueCount\":3}]")
  })

  it('item.js', () => {
    const string = 'return html`<div class="view">${isWritable ? html`${1} - ${2}` : html`${3}`}</div>`'
    const parsed = parseHtmlTemplates(string);
    expect(parsed.length).toBe(2)
    expect(parsed[0]).toBe('return ')
    expect((parsed[1] as any).html).toBe('<div class="view">${isWritable ? html`${1} - ${2}` : html`${3}`}</div>')
    expect((parsed[1] as any).strings.length).toBe(2)
    expect((parsed[1] as any).strings[0]).toBe('<div class="view">')
    expect((parsed[1] as any).strings[1]).toBe('</div>')
    expect((parsed[1] as any).values.length).toBe(1)
    expect((parsed[1] as any).values[0]).toBe('isWritable ? html`${1} - ${2}` : html`${3}`')
  })
})
