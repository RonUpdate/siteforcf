"use client"
import ReactMarkdown from "react-markdown"

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold my-4" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold my-3" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-bold my-2" {...props} />,
        h4: ({ node, ...props }) => <h4 className="text-lg font-bold my-2" {...props} />,
        p: ({ node, ...props }) => <p className="my-2" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-2" {...props} />,
        li: ({ node, ...props }) => <li className="my-1" {...props} />,
        a: ({ node, ...props }) => (
          <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
        ),
        code: ({ node, inline, ...props }) =>
          inline ? (
            <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props} />
          ) : (
            <code className="block bg-gray-100 p-2 rounded text-sm overflow-x-auto my-2" {...props} />
          ),
        img: ({ node, ...props }) => <img className="max-w-full h-auto my-4 rounded" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
