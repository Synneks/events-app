import { Search } from "lucide-react";
import Form from "next/form";
function SearchBar() {
  return (
    <Form action={"/search"} className="relative">
      <input
        type="text"
        placeholder="Search for a show..."
        name="q"
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-12 shadow-sm transition duration-200 ease-in focus:border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-yellow-400 px-4 py-1.5 text-sm font-medium transition duration-200 ease-in hover:bg-yellow-500"
      >
        Search
      </button>
    </Form>
  );
}

export default SearchBar;
