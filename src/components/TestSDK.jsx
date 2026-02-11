import React from "react";
import { useFrappeGetDocList } from "frappe-react-sdk";
export default function TestSDK() {
  const { data, error } = useFrappeGetDocList("Reporting Form");

  if (error) return <div>Error: {JSON.stringify(error)}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>Reporting Forms (via SDK)</h2>
      <ul>
        {data.map(f => (
          <li key={f.name}>{f.title} ({f.reporting_period} {f.year})</li>
        ))}
      </ul>
    </div>
  );
}
