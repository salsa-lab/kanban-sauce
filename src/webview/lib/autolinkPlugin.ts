import {
  realmPlugin,
  addSyntaxExtension$,
  addMdastExtension$,
  addToMarkdownExtension$,
  type NodeRef,
  type ToMarkdownExtension
} from '@mdxeditor/editor'

type SyntaxExtension =
  typeof addSyntaxExtension$ extends NodeRef<infer T>
    ? T extends (infer U)[]
      ? U
      : T
    : never

type MdastExtension =
  typeof addMdastExtension$ extends NodeRef<infer T>
    ? T extends (infer U)[]
      ? U
      : T
    : never

const URI_AUTOLINK_RE = /^[a-zA-Z][a-zA-Z0-9+.-]{1,31}:[^\s<>]+$/
const EMAIL_AUTOLINK_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
const DOMAIN_AUTOLINK_RE =
  /^(?:www\.[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+|[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,})(?::\d+)?(?:[/?#][^\s<>]*)?$/i
const HOST_PORT_OR_IP_AUTOLINK_RE =
  /^(?:localhost:\d+|(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?)(?:[/?#][^\s<>]*)?$/i
const PROTOCOL_RELATIVE_AUTOLINK_RE =
  /^\/\/[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+(?:[/?#:][^\s<>]*)?$/i

export function isAngleBracketUrl(value: string): boolean {
  return (
    DOMAIN_AUTOLINK_RE.test(value) ||
    HOST_PORT_OR_IP_AUTOLINK_RE.test(value) ||
    PROTOCOL_RELATIVE_AUTOLINK_RE.test(value) ||
    URI_AUTOLINK_RE.test(value)
  )
}

export function normalizeAngleBracketUrl(value: string): string {
  if (value.startsWith('//')) {
    return `https:${value}`
  }
  if (
    DOMAIN_AUTOLINK_RE.test(value) ||
    HOST_PORT_OR_IP_AUTOLINK_RE.test(value) ||
    !URI_AUTOLINK_RE.test(value)
  ) {
    return `https://${value}`
  }
  return value
}

interface MdastLinkLike {
  url?: string
  title?: string | null
  children?: Array<{ type: string; value?: string }>
}

export function shouldFormatLinkAsAutolink(node: MdastLinkLike): boolean {
  if (
    !node.url ||
    node.title ||
    !node.children ||
    node.children.length !== 1 ||
    node.children[0].type !== 'text' ||
    typeof node.children[0].value !== 'string'
  ) {
    return false
  }
  const raw = node.children[0].value
  if (!raw || /[\0- <>\u007F]/.test(raw)) {
    return false
  }
  return (
    (raw === node.url && URI_AUTOLINK_RE.test(raw)) ||
    (`mailto:${raw}` === node.url && EMAIL_AUTOLINK_RE.test(raw)) ||
    (normalizeAngleBracketUrl(raw) === node.url && isAngleBracketUrl(raw))
  )
}

const autolinkSyntaxExtension: SyntaxExtension = {
  disable: { null: ['mdxJsxFlowTag'] },
  text: {
    60: {
      name: 'angleBracketAutolink',
      tokenize(effects, ok, nok) {
        let value = ''
        return start

        function start(code: number | null) {
          if (code !== 60) return nok(code)
          effects.enter('autolink')
          effects.enter('autolinkMarker')
          effects.consume(code)
          effects.exit('autolinkMarker')
          effects.enter('autolinkProtocol')
          return inside
        }

        function inside(code: number | null) {
          if (
            code === null ||
            code <= 32 ||
            code === 60 ||
            code === 127 ||
            value.length > 2000
          ) {
            return nok(code)
          }
          if (code === 62) {
            if (value.length === 0) {
              return nok(code)
            }
            if (EMAIL_AUTOLINK_RE.test(value)) {
              const token = effects.exit('autolinkProtocol')
              token.type = 'autolinkEmail'
            } else if (isAngleBracketUrl(value)) {
              effects.exit('autolinkProtocol')
            } else {
              return nok(code)
            }
            effects.enter('autolinkMarker')
            effects.consume(code)
            effects.exit('autolinkMarker')
            effects.exit('autolink')
            return ok
          }
          value += String.fromCodePoint(code)
          effects.consume(code)
          return inside
        }
      }
    }
  }
}

const autolinkMdastExtension: MdastExtension = {
  exit: {
    autolinkProtocol(token) {
      const textValue = this.sliceSerialize(token)
      const textNode = this.stack.pop()
      if (textNode && 'value' in textNode) {
        textNode.value += textValue
        if (textNode.position) {
          textNode.position.end = {
            line: token.end.line,
            column: token.end.column,
            offset: token.end.offset
          }
        }
      }
      const linkNode = this.stack[this.stack.length - 1]
      if (linkNode && 'url' in linkNode) {
        linkNode.url = normalizeAngleBracketUrl(textValue)
      }
    }
  }
}

type LinkHandler = NonNullable<NonNullable<ToMarkdownExtension['handlers']>['link']> & {
  peek?: (node: MdastLinkLike) => string
}

const linkToMarkdownHandler: LinkHandler = function link(node, _parent, state, info) {
  const quote = state.options.quote || '"'
  const suffix = quote === '"' ? 'Quote' : 'Apostrophe'
  const tracker = state.createTracker(info)

  if (shouldFormatLinkAsAutolink(node)) {
    const stack = state.stack
    state.stack = []
    const exit = state.enter('autolink')
    let value = tracker.move('<')
    value += tracker.move(
      state.containerPhrasing(node, {
        before: value,
        after: '>',
        ...tracker.current()
      })
    )
    value += tracker.move('>')
    exit()
    state.stack = stack
    return value
  }

  const exit = state.enter('link')
  let subexit = state.enter('label')
  let value = tracker.move('[')
  value += tracker.move(
    state.containerPhrasing(node, {
      before: value,
      after: '](',
      ...tracker.current()
    })
  )
  value += tracker.move('](')
  subexit()

  if ((!node.url && node.title) || /[\0- \u007F]/.test(node.url)) {
    subexit = state.enter('destinationLiteral')
    value += tracker.move('<')
    value += tracker.move(
      state.safe(node.url, { before: value, after: '>', ...tracker.current() })
    )
    value += tracker.move('>')
  } else {
    subexit = state.enter('destinationRaw')
    value += tracker.move(
      state.safe(node.url, {
        before: value,
        after: node.title ? ' ' : ')',
        ...tracker.current()
      })
    )
  }

  subexit()

  if (node.title) {
    subexit = state.enter(`title${suffix}`)
    value += tracker.move(' ' + quote)
    value += tracker.move(
      state.safe(node.title, {
        before: value,
        after: quote,
        ...tracker.current()
      })
    )
    value += tracker.move(quote)
    subexit()
  }

  value += tracker.move(')')
  exit()
  return value
}

linkToMarkdownHandler.peek = function linkPeek(node) {
  return shouldFormatLinkAsAutolink(node) ? '<' : '['
}

const autolinkToMarkdownExtension: ToMarkdownExtension = {
  resourceLink: false,
  handlers: {
    link: linkToMarkdownHandler
  }
}

/**
 * MDXEditor plugin that restores support for Markdown angle-bracket autolinks
 * such as `<https://www.google.com>`, `<www.google.com>`, and `<user@example.com>`,
 * preventing MDX JSX parser errors on URLs in `<...>` and preserving `<...>` on export.
 */
export const autolinkPlugin = realmPlugin({
  init(realm) {
    realm.pubIn({
      [addSyntaxExtension$]: autolinkSyntaxExtension,
      [addMdastExtension$]: autolinkMdastExtension,
      [addToMarkdownExtension$]: autolinkToMarkdownExtension
    })
  }
})
