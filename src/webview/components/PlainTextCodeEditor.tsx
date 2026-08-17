/* eslint-disable react/prop-types */
import { useCodeBlockEditorContext, CodeBlockEditorDescriptor } from '@mdxeditor/editor'
import { useRef, useEffect } from 'react'

export const plainTextDescriptor: CodeBlockEditorDescriptor = {
  match: () => true,
  priority: 0,
  Editor: (props) => {
    const { setCode } = useCodeBlockEditorContext()
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const adjustHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = '0px'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
    }

    useEffect(() => {
      adjustHeight()
    }, [props.code])

    // Auto-focus when a new empty code block is inserted
    useEffect(() => {
      if (props.code === '' && textareaRef.current) {
        textareaRef.current.focus()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <div className="relative group rounded border m-0 my-0 bg-[var(--vscode-editor-background)]" style={{ borderColor: 'var(--vscode-panel-border)' }}>
        <div 
          className="absolute top-0 right-0 text-xs px-2 py-1 rounded-bl pointer-events-none"
          style={{ 
            backgroundColor: 'var(--vscode-editor-inactiveSelectionBackground)',
            color: 'var(--vscode-descriptionForeground)'
          }}
        >
          {props.language || 'text'}
        </div>
        <textarea
          ref={textareaRef}
          className="w-full bg-transparent p-3 pb-1 font-mono focus:outline-none m-0 block overflow-hidden"
          style={{ 
            color: 'var(--vscode-editor-foreground)', 
            fontSize: 'var(--vscode-editor-font-size, 14px)',
            minHeight: '3rem'
          }}
          value={props.code}
          onChange={(e) => {
            setCode(e.target.value)
            adjustHeight()
          }}
          spellCheck={false}
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              e.preventDefault()
              const start = e.currentTarget.selectionStart
              const end = e.currentTarget.selectionEnd
              const newCode = props.code.substring(0, start) + '  ' + props.code.substring(end)
              setCode(newCode)
              setTimeout(() => {
                if (textareaRef.current) {
                  textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
                }
              }, 0)
            }
            e.stopPropagation()
          }}
        />
      </div>
    )
  }
}
