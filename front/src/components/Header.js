import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <h1>Database aggregator</h1>
      <div>
        <Link to="/">Task list</Link>
      </div>
    </header>
  );
}
