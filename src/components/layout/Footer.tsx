export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Smart Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 