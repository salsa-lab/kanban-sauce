// @vitest-environment jsdom
import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  MDXEditor,
  type MDXEditorMethods,
  headingsPlugin,
  linkPlugin,
  diffSourcePlugin
} from '@mdxeditor/editor'
import {
  autolinkPlugin,
  isAngleBracketUrl,
  normalizeAngleBracketUrl,
  shouldFormatLinkAsAutolink
} from '../../src/webview/lib/autolinkPlugin'

describe('autolinkPlugin helpers', () => {
  it('recognizes angle-bracket URLs with and without schemes', () => {
    expect(isAngleBracketUrl('www.google.com')).toBe(true)
    expect(isAngleBracketUrl('www.google.com/search?q=test#top')).toBe(true)
    expect(isAngleBracketUrl('https://www.google.com')).toBe(true)
    expect(isAngleBracketUrl('http://example.com/path')).toBe(true)
    expect(isAngleBracketUrl('google.com/path')).toBe(true)
    expect(isAngleBracketUrl('localhost:3000/api')).toBe(true)
    expect(isAngleBracketUrl('//www.google.com')).toBe(true)

    expect(isAngleBracketUrl('u')).toBe(false)
    expect(isAngleBracketUrl('div')).toBe(false)
    expect(isAngleBracketUrl('span style="color:red"')).toBe(false)
  })

  it('normalizes angle-bracket URLs appropriately', () => {
    expect(normalizeAngleBracketUrl('www.google.com')).toBe('https://www.google.com')
    expect(normalizeAngleBracketUrl('www.google.com/test')).toBe('https://www.google.com/test')
    expect(normalizeAngleBracketUrl('google.com')).toBe('https://google.com')
    expect(normalizeAngleBracketUrl('https://www.google.com')).toBe('https://www.google.com')
    expect(normalizeAngleBracketUrl('http://www.google.com')).toBe('http://www.google.com')
    expect(normalizeAngleBracketUrl('//www.google.com')).toBe('https://www.google.com')
  })

  it('determines when a link node should serialize as <...>', () => {
    expect(
      shouldFormatLinkAsAutolink({
        url: 'https://www.google.com',
        title: null,
        children: [{ type: 'text', value: 'www.google.com' }]
      })
    ).toBe(true)

    expect(
      shouldFormatLinkAsAutolink({
        url: 'https://www.google.com',
        title: null,
        children: [{ type: 'text', value: 'https://www.google.com' }]
      })
    ).toBe(true)

    expect(
      shouldFormatLinkAsAutolink({
        url: 'mailto:user@example.com',
        title: null,
        children: [{ type: 'text', value: 'user@example.com' }]
      })
    ).toBe(true)

    expect(
      shouldFormatLinkAsAutolink({
        url: 'https://www.google.com',
        title: null,
        children: [{ type: 'text', value: 'Google' }]
      })
    ).toBe(false)
  })
})

describe('MDXEditor with autolinkPlugin', () => {
  it('parses <www.google.com> without errors and preserves <www.google.com> in markdown output', () => {
    const errors: unknown[] = []
    const editorRef = createRef<MDXEditorMethods>()
    const initialMd = '# Feature\n\n<www.google.com>'
    render(
      <MDXEditor
        ref={editorRef}
        markdown={initialMd}
        onError={(err) => errors.push(err)}
        plugins={[headingsPlugin(), linkPlugin(), autolinkPlugin(), diffSourcePlugin()]}
      />
    )
    expect(errors).toHaveLength(0)
    expect(screen.queryByText(/Error parsing markdown/i)).not.toBeInTheDocument()
    expect(editorRef.current?.getMarkdown().trim()).toBe(initialMd)
  })

  it('parses and preserves <https://www.google.com>, <user@example.com>, and [text](url)', () => {
    const errors: unknown[] = []
    const editorRef = createRef<MDXEditorMethods>()
    const initialMd =
      'Visit <https://www.google.com> or <www.google.com/search?q=1&b=2> or <user@example.com> or [Google](https://www.google.com)'
    render(
      <MDXEditor
        ref={editorRef}
        markdown={initialMd}
        onError={(err) => errors.push(err)}
        plugins={[headingsPlugin(), linkPlugin(), autolinkPlugin(), diffSourcePlugin()]}
      />
    )
    expect(errors).toHaveLength(0)
    expect(screen.queryByText(/Error parsing markdown/i)).not.toBeInTheDocument()
    expect(editorRef.current?.getMarkdown().trim()).toBe(initialMd)
  })

  it('preserves HTML formatting tags like <u>, <sup>, and <sub>', () => {
    const errors: unknown[] = []
    render(
      <MDXEditor
        markdown={'<u>underlined</u> and <sup>sup</sup> and <sub>sub</sub>'}
        onError={(err) => errors.push(err)}
        plugins={[headingsPlugin(), linkPlugin(), autolinkPlugin(), diffSourcePlugin()]}
      />
    )
    expect(errors).toHaveLength(0)
    expect(screen.queryByText(/Error parsing markdown/i)).not.toBeInTheDocument()
  })
})
