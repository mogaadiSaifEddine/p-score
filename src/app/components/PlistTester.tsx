// components/PlistTester.tsx
// Test component to verify plist parsing works correctly

'use client';

import React, { useState } from 'react';
import * as plist from 'plist';

export function PlistTester() {
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const samplePlistData = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>status_code</key>
	<string>ONGOING</string>
	<key>team_id</key>
	<integer>1</integer>
	<key>teams_info</key>
	<array>
		<dict>
			<key>challenge_penalty</key>
			<array/>
			<key>found_treasures</key>
			<array>
				<dict>
					<key>id</key>
					<integer>332225</integer>
				</dict>
				<dict>
					<key>id</key>
					<integer>332565</integer>
				</dict>
				<dict>
					<key>id</key>
					<integer>332564</integer>
				</dict>
			</array>
			<key>game_duration</key>
			<integer>6</integer>
			<key>has_finished</key>
			<string>True</string>
			<key>id</key>
			<string>1</string>
			<key>is_in_game</key>
			<true/>
			<key>latitude</key>
			<string>None</string>
			<key>longitude</key>
			<string>None</string>
			<key>name</key>
			<string>cc</string>
			<key>score</key>
			<string>3</string>
			<key>score_adjustment</key>
			<string>0</string>
			<key>start_time</key>
			<string>1761639609000</string>
			<key>time_penalty</key>
			<integer>0</integer>
		</dict>
	</array>
</dict>
</plist>`;

  const testPlistParsing = () => {
    try {
      setError(null);
      const parsed = plist.parse(samplePlistData);
      setTestResult(parsed);
      console.log('Plist parsing successful:', parsed);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('Plist parsing failed:', err);
    }
  };

  return (
    <div className="plist-tester p-4 border rounded-lg bg-yellow-50">
      <h3 className="text-lg font-semibold mb-4">Plist Parser Test</h3>
      
      <div className="mb-4">
        <button 
          onClick={testPlistParsing}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Plist Parsing
        </button>
      </div>

      {error && (
        <div className="error mb-4 p-3 bg-red-100 border border-red-400 rounded">
          <h4 className="font-medium text-red-800">Parsing Error:</h4>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {testResult && (
        <div className="result mb-4 p-3 bg-green-100 border border-green-400 rounded">
          <h4 className="font-medium text-green-800 mb-2">Parsing Successful:</h4>
          <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-64">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}

      <details className="sample-data">
        <summary className="cursor-pointer font-medium">Sample Plist Data</summary>
        <pre className="text-xs bg-white p-2 rounded border mt-2 overflow-auto max-h-32">
          {samplePlistData}
        </pre>
      </details>
    </div>
  );
}