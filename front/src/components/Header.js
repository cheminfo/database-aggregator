import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className="w-full bg-grey-light">
      <nav className="w-full max-w-4xl m-auto px-4 flex items-center py-6">
        <span className="font-semibold text-xl">Database aggregator</span>
        <ul className="flex list-reset">
          <li className="ml-6">
            <Link to="/" className="text-blue-darker">
              Task list
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
