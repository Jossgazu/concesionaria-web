import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#2E3133] text-white mt-auto border-t border-[#8E9196]/20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Car className="w-8 h-8 text-[#007AFF]" />
              <span className="text-xl font-bold font-['Manrope']">Andina Motor Studio</span>
            </Link>
            <p className="text-[#8E9196] text-sm font-['Inter']">
              Tu marketplace de confianza para comprar y vender vehículos. Encuentra el auto perfecto o vende el tuyo fácilmente.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white text-sm font-bold uppercase tracking-widest mb-4">Explorar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/vehiculos" className="text-[#8E9196] hover:text-[#F9F9FC] transition-colors text-sm">
                  Todos los Vehículos
                </Link>
              </li>
              <li>
                <Link to="/vehiculos?featured=true" className="text-[#8E9196] hover:text-[#F9F9FC] transition-colors text-sm">
                  Vehículos Destacados
                </Link>
              </li>
              <li>
                <Link to="/vender" className="text-[#8E9196] hover:text-[#F9F9FC] transition-colors text-sm">
                  Vender mi Vehículo
                </Link>
              </li>
              <li>
                <Link to="/valuacion" className="text-[#8E9196] hover:text-[#F9F9FC] transition-colors text-sm">
                  Tasación Gratuita
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white text-sm font-bold uppercase tracking-widest mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ayuda" className="text-[#8E9196] hover:text-[#F9F9FC] transition-colors text-sm">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-[#8E9196] hover:text-[#F9F9FC] transition-colors text-sm">
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="text-[#8E9196] hover:text-[#F9F9FC] transition-colors text-sm">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="text-[#8E9196] hover:text-[#F9F9FC] transition-colors text-sm">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white text-sm font-bold uppercase tracking-widest mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-[#8E9196] text-sm">
                <Phone className="w-4 h-4" />
                +54 11 1234-5678
              </li>
              <li className="flex items-center gap-2 text-[#8E9196] text-sm">
                <Mail className="w-4 h-4" />
                info@concesionariaweb.com
              </li>
            </ul>
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="text-[#8E9196] hover:text-[#F9F9FC] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#8E9196] hover:text-[#F9F9FC] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#8E9196] hover:text-[#F9F9FC] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-8 border-[#8E9196]/20" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#8E9196] text-sm font-['Inter']">
            © 2026 Andina Motor Studio. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <img src="/payment-visa.png" alt="Visa" className="h-6 opacity-70" />
            <img src="/payment-mastercard.png" alt="Mastercard" className="h-6 opacity-70" />
            <img src="/payment-mercadopago.png" alt="MercadoPago" className="h-6 opacity-70" />
          </div>
        </div>
      </div>
    </footer>
  );
}
