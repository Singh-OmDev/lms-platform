import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Shield } from 'lucide-react';

export default function AuthPages({ isRegisterInitial = false }) {
  return (
    <div className="min-h-screen bg-[#f0f4f8] text-[#1a202c] flex flex-col font-sans">
      {/* Official Government Banner */}
      <div className="bg-[#e2e8f0] border-b border-[#cbd5e0] px-6 py-1.5 text-[11px] text-[#4a5568] flex items-center space-x-2 select-none">
        <span className="inline-block w-4 h-2.5 bg-sky-600 border border-white"></span>
        <span>An official portal of the Government of Rajasthan • Department of Information Technology & Communication (DoIT&C)</span>
      </div>

      {/* Main Container */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded bg-[#f0f4f8] border border-[#d2d6dc] flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-[#002c6c]" />
          </div>
          <h2 className="text-xl font-serif font-bold text-[#002c6c] tracking-tight">
            Rajasthan Portal for Artificial Intelligence and Cybersecurity Training
          </h2>
          <p className="text-xs text-[#718096] mt-1.5 font-medium">
            Secure Sign-In & Registration Registry
          </p>
        </div>

        {/* Clerk Components */}
        <div className="shadow-lg rounded-md overflow-hidden bg-white border border-[#cbd5e0]">
          {isRegisterInitial ? (
            <SignUp 
              routing="path" 
              path="/register" 
              signInUrl="/login" 
              forceRedirectUrl="/dashboard"
            />
          ) : (
            <SignIn 
              routing="path" 
              path="/login" 
              signUpUrl="/register" 
              forceRedirectUrl="/dashboard"
            />
          )}
        </div>
      </div>

      {/* Basic Footer */}
      <footer className="border-t border-[#cbd5e0] bg-[#e2e8f0] py-6 text-center text-[#718096] text-[11px] font-sans">
        <div className="max-w-md mx-auto space-y-2">
          <p>© 2026 Department of Information Technology & Communication, Government of Rajasthan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
