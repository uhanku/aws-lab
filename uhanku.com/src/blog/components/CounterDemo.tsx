import { useState } from 'react';

export function CounterDemo() {
  const [count, setCount] = useState(0);

  return (
    <div className="blog-demo">
      <p>Interactive React component embedded inside MDX.</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Clicked {count} {count === 1 ? 'time' : 'times'}
      </button>
    </div>
  );
}
