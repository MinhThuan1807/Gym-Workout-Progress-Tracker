'use client'

import React from 'react'
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react'
import { Textarea } from '../ui/textarea'

interface CustomEditorProps {
  data: string
  onChange: (data: string) => void
}

const CustomEditor: React.FC<CustomEditorProps> = ({ data, onChange }) => {
  const cloud = useCKEditorCloud({
    version: '47.2.0',
    premium: true
  })

  if (cloud.status === 'error') {
    return (
      <div className="space-y-2">
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          Failed to load rich text editor. Using simple text editor instead.
        </div>
        <Textarea
          value={data}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your blog content here..."
          className="min-h-[400px] font-mono text-sm"
        />
      </div>
    )
  }

  if (cloud.status === 'loading') {
    return (
      <div className="border border-gray-300 rounded-lg p-4 min-h-[400px] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d8cf0] mx-auto mb-2"></div>
          <div>Loading editor...</div>
        </div>
      </div>
    )
  }

  const {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Subscript,
    Superscript,
    Heading,
    List,
    TodoList,
    Link,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Table,
    TableToolbar,
    BlockQuote,
    CodeBlock,
    Code,
    FontSize,
    FontFamily,
    FontColor,
    FontBackgroundColor,
    Highlight,
    Alignment,
    Indent,
    IndentBlock,
    HorizontalLine,
    SpecialCharacters,
    SpecialCharactersEssentials,
    RemoveFormat,
    FindAndReplace,
    SelectAll,
    Undo,
    Mention
  } = cloud.CKEditor

  const { FormatPainter, SlashCommand } = cloud.CKEditorPremiumFeatures

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#2d8cf0] focus-within:ring-1 focus-within:ring-[#2d8cf0] transition-colors">
      <CKEditor
        editor={ClassicEditor}
        data={data}
        onChange={(event, editor) => {
          const newData = editor.getData()
          onChange(newData)
        }}
        config={{
          licenseKey: process.env.NEXT_PUBLIC_CKEDITOR_LICENSE_KEY,

          plugins: [
            // Essential plugins
            Essentials,
            Paragraph,
            Undo,

            // Text formatting
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Subscript,
            Superscript,
            Code,
            RemoveFormat,

            // Font styling
            FontSize,
            FontFamily,
            FontColor,
            FontBackgroundColor,
            Highlight,

            // Structure
            Heading,
            List,
            TodoList,
            Indent,
            IndentBlock,
            Alignment,

            // Media & Content
            Link,
            Image,
            ImageCaption,
            ImageStyle,
            ImageToolbar,
            ImageUpload,
            Table,
            TableToolbar,
            BlockQuote,
            CodeBlock,
            HorizontalLine,

            // Advanced features
            SpecialCharacters,
            SpecialCharactersEssentials,
            FindAndReplace,
            SelectAll,

            // Mention plugin (required for SlashCommand)
            Mention,

            // Premium features
            FormatPainter,
            SlashCommand
          ],

          toolbar: {
            items: [
              'undo',
              'redo',
              '|',
              'selectAll',
              '|',
              'heading',
              '|',
              'fontSize',
              'fontFamily',
              '|',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              '|',
              'fontColor',
              'fontBackgroundColor',
              'highlight',
              '|',
              'code',
              'subscript',
              'superscript',
              '|',
              'alignment',
              '|',
              'numberedList',
              'bulletedList',
              'todoList',
              '|',
              'outdent',
              'indent',
              '|',
              'link',
              'imageUpload',
              '|',
              'insertTable',
              'blockQuote',
              'codeBlock',
              '|',
              'horizontalLine',
              'specialCharacters',
              '|',
              'formatPainter',
              'removeFormat',
              '|',
              'findAndReplace'
            ],
            shouldNotGroupWhenFull: true
          },

          // Mention configuration
          mention: {
            feeds: [
              {
                marker: '@',
                feed: [
                  '@apple',
                  '@bears',
                  '@brownie',
                  '@cake',
                  '@candy',
                  '@canes',
                  '@chocolate',
                  '@cookie',
                  '@cotton',
                  '@cream',
                  '@cupcake',
                  '@danish',
                  '@donut',
                  '@dragée',
                  '@fruitcake',
                  '@gingerbread',
                  '@gummi',
                  '@ice',
                  '@jelly-o',
                  '@liquorice',
                  '@macaroon',
                  '@marzipan',
                  '@oat',
                  '@pie',
                  '@plum',
                  '@pudding',
                  '@sesame',
                  '@snaps',
                  '@soufflé',
                  '@sugar',
                  '@sweet',
                  '@topping',
                  '@wafer'
                ],
                minimumCharacters: 1
              },
              {
                marker: '#',
                feed: [
                  '#american',
                  '#asian',
                  '#baking',
                  '#breakfast',
                  '#cake',
                  '#caribbean',
                  '#chocolate',
                  '#christmas',
                  '#dessert',
                  '#easy',
                  '#french',
                  '#fresh',
                  '#fusion',
                  '#gluten-free',
                  '#healthy',
                  '#holiday',
                  '#italian',
                  '#mediterranean',
                  '#mexican',
                  '#middle-eastern',
                  '#preferredtag',
                  '#quick',
                  '#raw',
                  '#snack',
                  '#soup',
                  '#summer',
                  '#tropical',
                  '#vegetarian',
                  '#winter'
                ]
              }
            ]
          },

          // Heading configuration
          heading: {
            options: [
              {
                model: 'paragraph',
                title: 'Paragraph',
                class: 'ck-heading_paragraph'
              },
              {
                model: 'heading1',
                view: 'h1',
                title: 'Heading 1',
                class: 'ck-heading_heading1'
              },
              {
                model: 'heading2',
                view: 'h2',
                title: 'Heading 2',
                class: 'ck-heading_heading2'
              },
              {
                model: 'heading3',
                view: 'h3',
                title: 'Heading 3',
                class: 'ck-heading_heading3'
              },
              {
                model: 'heading4',
                view: 'h4',
                title: 'Heading 4',
                class: 'ck-heading_heading4'
              },
              {
                model: 'heading5',
                view: 'h5',
                title: 'Heading 5',
                class: 'ck-heading_heading5'
              },
              {
                model: 'heading6',
                view: 'h6',
                title: 'Heading 6',
                class: 'ck-heading_heading6'
              }
            ]
          },

          // Font size options
          fontSize: {
            options: [
              9,
              10,
              11,
              12,
              13,
              14,
              'default',
              16,
              18,
              20,
              22,
              24,
              26,
              28,
              32,
              48
            ],
            supportAllValues: true
          },

          // Font family options
          fontFamily: {
            options: [
              'default',
              'Arial, Helvetica, sans-serif',
              'Courier New, Courier, monospace',
              'Georgia, serif',
              'Lucida Sans Unicode, Lucida Grande, sans-serif',
              'Tahoma, Geneva, sans-serif',
              'Times New Roman, Times, serif',
              'Trebuchet MS, Helvetica, sans-serif',
              'Verdana, Geneva, sans-serif',
              'JetBrains Mono, monospace'
            ],
            supportAllValues: true
          },

          // Font color configuration
          fontColor: {
            colors: [
              { color: 'hsl(0, 0%, 0%)', label: 'Black' },
              { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
              { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
              { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
              { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true },
              { color: 'hsl(0, 75%, 60%)', label: 'Red' },
              { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
              { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
              { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
              { color: 'hsl(120, 75%, 60%)', label: 'Green' },
              { color: 'hsl(150, 75%, 60%)', label: 'Aquamarine' },
              { color: 'hsl(180, 75%, 60%)', label: 'Turquoise' },
              { color: 'hsl(210, 75%, 60%)', label: 'Light blue' },
              { color: 'hsl(240, 75%, 60%)', label: 'Blue' },
              { color: 'hsl(270, 75%, 60%)', label: 'Purple' }
            ],
            columns: 5
          },

          // Font background color
          fontBackgroundColor: {
            colors: [
              { color: 'hsl(0, 0%, 0%)', label: 'Black' },
              { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
              { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
              { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
              { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true },
              { color: 'hsl(0, 75%, 60%)', label: 'Red' },
              { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
              { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
              { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
              { color: 'hsl(120, 75%, 60%)', label: 'Green' },
              { color: 'hsl(150, 75%, 60%)', label: 'Aquamarine' },
              { color: 'hsl(180, 75%, 60%)', label: 'Turquoise' },
              { color: 'hsl(210, 75%, 60%)', label: 'Light blue' },
              { color: 'hsl(240, 75%, 60%)', label: 'Blue' },
              { color: 'hsl(270, 75%, 60%)', label: 'Purple' }
            ],
            columns: 5
          },

          // Text alignment
          alignment: {
            options: ['left', 'center', 'right', 'justify']
          },

          // Table configuration
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells',
              'tableProperties',
              'tableCellProperties'
            ]
          },

          // Image configuration
          image: {
            toolbar: [
              'imageStyle:inline',
              'imageStyle:wrapText',
              'imageStyle:breakText',
              '|',
              'toggleImageCaption',
              'imageTextAlternative'
            ]
          },

          // Link configuration
          link: {
            decorators: {
              addTargetToExternalLinks: {
                mode: 'automatic',
                callback: (url: string | null) =>
                  url ? /^(https?:)?\/\//.test(url) : false,
                attributes: {
                  target: '_blank',
                  rel: 'noopener noreferrer'
                }
              }
            },
            defaultProtocol: 'https://'
          },

          // Code block languages
          codeBlock: {
            languages: [
              { language: 'plaintext', label: 'Plain text' },
              { language: 'c', label: 'C' },
              { language: 'cs', label: 'C#' },
              { language: 'cpp', label: 'C++' },
              { language: 'css', label: 'CSS' },
              { language: 'html', label: 'HTML' },
              { language: 'java', label: 'Java' },
              { language: 'javascript', label: 'JavaScript' },
              { language: 'php', label: 'PHP' },
              { language: 'python', label: 'Python' },
              { language: 'typescript', label: 'TypeScript' }
            ]
          },

          // Editor placeholder
          placeholder:
            'Start writing your amazing blog content here... (Type @ for mentions or / for slash commands)',

          // Language
          language: 'en'
        }}
        onReady={(editor) => {
          // Set minimum height
          const editable = editor.ui.getEditableElement()
          if (editable) {
            editable.style.minHeight = '600px'
            editable.style.maxHeight = '800px'
            editable.style.overflowY = 'auto'
          }

          //   console.log('CKEditor is ready!', editor)
        }}
        onError={(error) => {
          console.error('CKEditor error:', error)
        }}
      />
    </div>
  )
}

export default CustomEditor
