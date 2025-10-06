"use client";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export function Appbar() {
  return (
    <div className="fixed top-0 left-0 w-full h-16 backdrop-blur-md bg-white/30 border-b border-white/20 flex justify-between items-center px-6 sm:px-10 z-50">
      {/* Left Section - Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
          AI
        </div>
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
          Photo<span className="text-indigo-600">AI</span>
        </h1>
      </Link>

      {/* Right Section - Auth */}
      <div className="flex items-center gap-3 sm:gap-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-4 sm:px-5 py-2 rounded-full text-gray-700 hover:text-indigo-600 font-medium transition-all">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium text-sm sm:text-base px-5 py-2 sm:py-2.5 shadow-md transition-all cursor-pointer">
              Get Started
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
              },
            }}
          />
        </SignedIn>
      </div>
    </div>
  );
}
