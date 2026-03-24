import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'

function CopyButton({ text, label = 'Copy value', size = 'sm' }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return undefined
    }

    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function handleCopy() {
    if (!text) {
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch (error) {
      console.error('Copy failed', error)
    }
  }

  return (
    <button
      type="button"
      className={`btn btn-ghost btn-${size} tooltip`}
      data-tip={copied ? 'Copied!' : label}
      onClick={handleCopy}
      aria-label={label}
    >
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
    </button>
  )
}

export default CopyButton
