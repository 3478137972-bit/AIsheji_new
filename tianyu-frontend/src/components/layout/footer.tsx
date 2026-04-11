import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-cool-200 bg-cream-50">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-cool-900">Product</h3>
            <ul className="space-y-2 text-sm text-cool-600">
              <li><Link href="/features" className="hover:text-primary-600">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-primary-600">Pricing</Link></li>
              <li><Link href="/api" className="hover:text-primary-600">API</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-cool-900">Company</h3>
            <ul className="space-y-2 text-sm text-cool-600">
              <li><Link href="/about" className="hover:text-primary-600">About</Link></li>
              <li><Link href="/blog" className="hover:text-primary-600">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-primary-600">Careers</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-cool-900">Resources</h3>
            <ul className="space-y-2 text-sm text-cool-600">
              <li><Link href="/docs" className="hover:text-primary-600">Documentation</Link></li>
              <li><Link href="/help" className="hover:text-primary-600">Help Center</Link></li>
              <li><Link href="/guides" className="hover:text-primary-600">Guides</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-cool-900">Legal</h3>
            <ul className="space-y-2 text-sm text-cool-600">
              <li><Link href="/privacy" className="hover:text-primary-600">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-primary-600">Terms</Link></li>
              <li><Link href="/security" className="hover:text-primary-600">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-cool-200 pt-8 text-center">
          <p className="text-sm text-cool-500">
            © 2026 TIANyu Project. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
