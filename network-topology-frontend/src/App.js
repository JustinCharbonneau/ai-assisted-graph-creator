import React, { useState } from 'react';
import yaml from 'js-yaml';
import NetworkDiagram from './components/NetworkDiagram';

function App() {
  const [topologyConfig, setTopologyConfig] = useState({ nodes: [], edges: [] });
  const [apiInput, setApiInput] = useState("");
  const [latestMessage, setLatestMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleApiCall = async () => {
    const combinedInput = `
Current Topology Configuration:
${yaml.dump(topologyConfig) || "(No configuration provided)"}

User Input:
${apiInput}
    `;

    try {
      const response = await fetch('http://localhost:5000/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ combinedInput: combinedInput.trim() })
      });

      const rawData = await response.json();
      const data = JSON.parse(rawData.content);

      const parsedTopology = yaml.load(data.topology);
      setTopologyConfig(parsedTopology);
      setLatestMessage(data.message || "");
      setErrorMessage("");

    } catch (error) {
      console.error("Error in handleApiCall:", error);
      setLatestMessage("Error: Could not retrieve response.");
    }

    setApiInput("");
  };

  return (
    <div className="container">
      <div className="left-panel">
        <h1>Network Topology Generator</h1>

        <h2>Topology Configuration</h2>
        <textarea
          id="topologyInput"
          placeholder="Enter YAML configuration for the topology"
          value={yaml.dump(topologyConfig) || ""}
          onChange={(e) => {
            try {
              const parsedConfig = yaml.load(e.target.value);
              setTopologyConfig(parsedConfig);
              setErrorMessage("");
            } catch (error) {
              setErrorMessage("Invalid YAML syntax. Please correct the configuration.");
            }
          }}
        />

        <h2>Custom Command</h2>
        <textarea
          placeholder="Describe your changes or ask for modifications"
          value={apiInput}
          onChange={(e) => setApiInput(e.target.value)}
        />
        <button id="callApi" onClick={handleApiCall}>✨ Generate Topology Magic ✨</button>

        <h2>Topology Update Insights</h2>
        <div className="response-box">
          <p>{latestMessage || "No insights yet. Send a command to see updates here!"}</p>
        </div>
      </div>

      <div className="right-panel">
        <NetworkDiagram
          topologyConfig={topologyConfig}
          setTopologyConfig={(newConfig) => {
            setTopologyConfig(newConfig);
            document.getElementById("topologyInput").value = yaml.dump(newConfig);
          }}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
}

export default App;
