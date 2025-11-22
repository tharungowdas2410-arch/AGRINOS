import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, LogOut, Menu, X } from 'lucide-react';
import { authService } from '@/lib/auth';
import { useState } from 'react';

export const Navigation = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Leaf className="h-6 w-6" />
            Agrinos
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/upload" className="text-sm font-medium hover:text-primary transition-colors">
                  Upload Image
                </Link>
                <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                  Contact
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {user.name} ({user.role})
                  </span>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                  Contact
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            {user ? (
              <>
                <Link to="/dashboard" className="block py-2 text-sm font-medium hover:text-primary">
                  Dashboard
                </Link>
                <Link to="/upload" className="block py-2 text-sm font-medium hover:text-primary">
                  Upload Image
                </Link>
                <Link to="/about" className="block py-2 text-sm font-medium hover:text-primary">
                  About
                </Link>
                <Link to="/contact" className="block py-2 text-sm font-medium hover:text-primary">
                  Contact
                </Link>
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    {user.name} ({user.role})
                  </p>
                  <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/about" className="block py-2 text-sm font-medium hover:text-primary">
                  About
                </Link>
                <Link to="/contact" className="block py-2 text-sm font-medium hover:text-primary">
                  Contact
                </Link>
                <Link to="/login" className="block">
                  <Button variant="outline" size="sm" className="w-full mb-2">Login</Button>
                </Link>
                <Link to="/register" className="block">
                  <Button size="sm" className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
