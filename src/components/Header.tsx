import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@components/SearchBar";

function Header() {
  return (
    <div className="border-b">
      <div className="flex flex-col items-center gap-4 p-4 lg:flex-row">
        <div className="flex w-full items-center justify-between lg:w-auto">
          <Link href="/" className="font-blod shrink-0">
            <Image
              src="/logo.svg"
              alt="Show"
              width={100}
              height={100}
              className="w-24 lg:w-28"
            />
          </Link>

          {/* user sign in */}
          <div className="lg:hidden">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm text-gray-800 transition hover:bg-gray-300">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        {/* search bar */}
        <div className="w-full lg:max-w-2xl">
          <SearchBar />
        </div>

        {/* desktop action buttons */}
        <div className="ml-auto hidden lg:block">
          <SignedIn>
            <div className="flex items-center gap-3">
              <Link href="/seller">
                <button className="rounded-lg bg-yellow-400 px-3 py-1.5 text-sm transition duration-200 ease-in hover:bg-yellow-500">
                  Sell Tickets
                </button>
              </Link>
              <Link href="/tickets">
                <button className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm transition duration-200 ease-in hover:bg-gray-200">
                  My Tickets
                </button>
              </Link>
              <UserButton />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <button className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm transition duration-200 ease-in hover:bg-gray-200">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* mobile action buttons */}
        <div className="flex w-full justify-center gap-3 lg:hidden">
          <SignedIn>
            <Link href="/seller" className="flex-1">
              <button className="w-full rounded-lg bg-yellow-400 px-3 py-1.5 text-sm transition duration-200 ease-in hover:bg-yellow-500">
                Sell Tickets
              </button>
            </Link>
            <Link href="/tickets" className="flex-1">
              <button className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm transition duration-200 ease-in hover:bg-gray-200">
                My Tickets
              </button>
            </Link>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}

export default Header;
