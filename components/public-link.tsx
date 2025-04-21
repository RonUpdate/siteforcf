import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PublicLinkProps {
  href: string
  label?: string
  className?: string
}

export default function PublicLink({ href, label = "Открыть на сайте", className = "" }: PublicLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      <Button variant="outline" size="sm">
        <ExternalLink className="h-4 w-4 mr-2" />
        {label}
      </Button>
    </a>
  )
}
