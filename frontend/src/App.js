import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { 
  Settings, 
  Plus, 
  Download, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Upload,
  FileText,
  Zap,
  Brain,
  TestTube,
  ChevronRight,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Home,
  Link,
  Mic,
  Menu,
  BarChart3,
  Database,
  Bot,
  GitBranch,
  UserCheck,
  Calendar,
  Clock,
  Filter,
  Search
} from 'lucide-react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Sidebar Navigation Component
const Sidebar = ({ activeSection, onSectionChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'ai-config', label: 'AI Configuration', icon: Brain },
    { id: 'alm-config', label: 'ALM Configuration', icon: Link },
    { id: 'transcription', label: 'Gen Transcription AI', icon: Mic },
    { id: 'test-cases', label: 'Test Cases', icon: TestTube },
  ];

  return (
    <div className={`bg-gray-900 text-white h-screen transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <TestTube className="text-blue-400" size={32} />
            {!isCollapsed && <h1 className="text-xl font-bold">Gen Studio AI</h1>}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

// AI Provider Configuration Component
const AIProviderConfig = ({ onClose, onSave }) => {
  const [provider, setProvider] = useState('openai');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4');
  const [maxTokens, setMaxTokens] = useState(4000);
  const [temperature, setTemperature] = useState(0.7);
  const [loading, setLoading] = useState(false);

  const providerModels = {
    openai: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo'],
    anthropic: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    google: ['gemini-pro', 'gemini-pro-vision']
  };

  const handleSave = async () => {
    if (!apiKey) {
      alert('Please enter your API key');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/ai-providers`, {
        provider,
        api_key: apiKey,
        model,
        max_tokens: maxTokens,
        temperature
      });
      onSave();
      onClose();
    } catch (error) {
      alert('Failed to save AI provider configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">AI Provider Configuration</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Provider
            </label>
            <select
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                setModel(providerModels[e.target.value][0]);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic Claude</option>
              <option value="google">Google Gemini</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your API key"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {providerModels[provider].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Tokens: {maxTokens}
            </label>
            <input
              type="range"
              min="1000"
              max="8000"
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature: {temperature}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component (Main Test Case Generation)
const Dashboard = ({ transcripts, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [testType, setTestType] = useState('Functional');
  const [numTestCases, setNumTestCases] = useState(5);
  const [files, setFiles] = useState([]);
  const [selectedTranscripts, setSelectedTranscripts] = useState([]);
  const [selectedALM, setSelectedALM] = useState('');
  const [selectedALMItems, setSelectedALMItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    onDrop: (acceptedFiles) => {
      setFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a description for test case generation');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('test_type', testType);
      formData.append('num_test_cases', numTestCases.toString());
      formData.append('selected_transcripts', JSON.stringify(selectedTranscripts));
      formData.append('selected_alm', selectedALM);
      formData.append('selected_alm_items', JSON.stringify(selectedALMItems));
      
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post(`${API}/generate-test-cases`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onGenerate(response.data);
      setPrompt('');
      setFiles([]);
      setSelectedTranscripts([]);
      setSelectedALMItems([]);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate test cases. Please check your AI provider configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Generate Test Cases</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe what you want to test *
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="e.g., User authentication system with login, logout, and password reset functionality"
            />
          </div>

          {/* ALM Context Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ALM Context (Optional)
            </label>
            <select
              value={selectedALM}
              onChange={(e) => setSelectedALM(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select ALM System</option>
              <option value="jira">JIRA</option>
              <option value="azure">Azure DevOps</option>
            </select>
            {selectedALM && (
              <p className="text-sm text-gray-500 mt-1">
                Configure your {selectedALM.toUpperCase()} connection in ALM Configuration to see available items.
              </p>
            )}
          </div>

          {/* Meeting Transcripts Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Transcripts (Optional)
            </label>
            <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
              {transcripts.length === 0 ? (
                <p className="text-gray-500 text-sm">No transcripts available. Upload transcripts in Gen Transcription AI.</p>
              ) : (
                transcripts.map((transcript) => (
                  <div key={transcript.id} className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id={transcript.id}
                      checked={selectedTranscripts.includes(transcript.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTranscripts([...selectedTranscripts, transcript.id]);
                        } else {
                          setSelectedTranscripts(selectedTranscripts.filter(id => id !== transcript.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={transcript.id} className="text-sm text-gray-700 cursor-pointer">
                      {transcript.title} - {new Date(transcript.created_at).toLocaleDateString()}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Type
              </label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="Functional">Functional</option>
                <option value="Performance">Performance</option>
                <option value="Security">Security</option>
                <option value="Usability">Usability</option>
                <option value="Integration">Integration</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Test Cases
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={numTestCases}
                onChange={(e) => setNumTestCases(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Context Files (Optional)
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="text-sm text-gray-600">
                Drop files here or click to select
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported: .txt, .pdf, .docx
              </p>
            </div>

            {files.length > 0 && (
              <div className="mt-2 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <FileText size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} />}
            <span>{loading ? 'Generating...' : 'Generate Test Cases'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// AI Configuration Page
const AIConfigPage = ({ activeProvider, onProviderUpdate }) => {
  const [showConfigModal, setShowConfigModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">AI Configuration</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {activeProvider ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span className="text-sm text-gray-600">
                    Active: {activeProvider.provider} - {activeProvider.model}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <AlertCircle className="text-orange-500" size={20} />
                  <span className="text-sm text-gray-600">No AI provider configured</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Settings size={16} />
              <span>Configure AI Provider</span>
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Supported AI Providers</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Bot className="text-blue-500" size={16} />
                <span className="text-sm">OpenAI (GPT-4, GPT-3.5-turbo)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bot className="text-purple-500" size={16} />
                <span className="text-sm">Anthropic Claude</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bot className="text-green-500" size={16} />
                <span className="text-sm">Google Gemini</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfigModal && (
        <AIProviderConfig
          onClose={() => setShowConfigModal(false)}
          onSave={onProviderUpdate}
        />
      )}
    </div>
  );
};

// ALM Configuration Page
const ALMConfigPage = () => {
  const [selectedALM, setSelectedALM] = useState('');
  const [jiraConfig, setJiraConfig] = useState({
    url: '',
    username: '',
    apiToken: ''
  });
  const [azureConfig, setAzureConfig] = useState({
    organization: '',
    project: '',
    patToken: ''
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Link className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">ALM Configuration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select ALM System
            </label>
            <select
              value={selectedALM}
              onChange={(e) => setSelectedALM(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose ALM System</option>
              <option value="jira">JIRA</option>
              <option value="azure">Azure DevOps</option>
            </select>
          </div>

          {selectedALM === 'jira' && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-4">JIRA Configuration</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    JIRA URL
                  </label>
                  <input
                    type="url"
                    value={jiraConfig.url}
                    onChange={(e) => setJiraConfig({...jiraConfig, url: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="https://yourcompany.atlassian.net"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username/Email
                  </label>
                  <input
                    type="email"
                    value={jiraConfig.username}
                    onChange={(e) => setJiraConfig({...jiraConfig, username: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Token
                  </label>
                  <input
                    type="password"
                    value={jiraConfig.apiToken}
                    onChange={(e) => setJiraConfig({...jiraConfig, apiToken: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Your JIRA API token"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedALM === 'azure' && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-4">Azure DevOps Configuration</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={azureConfig.organization}
                    onChange={(e) => setAzureConfig({...azureConfig, organization: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="yourorganization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project
                  </label>
                  <input
                    type="text"
                    value={azureConfig.project}
                    onChange={(e) => setAzureConfig({...azureConfig, project: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="yourproject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Personal Access Token
                  </label>
                  <input
                    type="password"
                    value={azureConfig.patToken}
                    onChange={(e) => setAzureConfig({...azureConfig, patToken: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Azure DevOps PAT token"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              disabled={!selectedALM}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Gen Transcription AI Page
const TranscriptionPage = ({ transcripts, onTranscriptsUpdate }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [newTranscript, setNewTranscript] = useState({
    title: '',
    content: '',
    meetingDate: '',
    participants: ''
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
    },
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    }
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select a transcript file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post(`${API}/transcripts/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onTranscriptsUpdate();
      setFiles([]);
      alert('Transcripts uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload transcripts');
    } finally {
      setUploading(false);
    }
  };

  const handleManualAdd = async () => {
    if (!newTranscript.title || !newTranscript.content) {
      alert('Please provide title and content');
      return;
    }

    try {
      await axios.post(`${API}/transcripts`, newTranscript);
      onTranscriptsUpdate();
      setNewTranscript({
        title: '',
        content: '',
        meetingDate: '',
        participants: ''
      });
      alert('Transcript added successfully!');
    } catch (error) {
      console.error('Failed to add transcript:', error);
      alert('Failed to add transcript');
    }
  };

  const handleDelete = async (transcriptId) => {
    if (window.confirm('Are you sure you want to delete this transcript?')) {
      try {
        await axios.delete(`${API}/transcripts/${transcriptId}`);
        onTranscriptsUpdate();
      } catch (error) {
        alert('Failed to delete transcript');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Mic className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Gen Transcription AI</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Transcripts */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Upload Transcript Files</h3>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="text-sm text-gray-600">
                Drop transcript files here or click to select
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported: .txt files only
              </p>
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <FileText size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {uploading ? <RefreshCw size={16} className="animate-spin" /> : <Upload size={16} />}
                  <span>{uploading ? 'Uploading...' : 'Upload Transcripts'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Manual Entry */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Transcript Manually</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newTranscript.title}
                  onChange={(e) => setNewTranscript({...newTranscript, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Meeting title or description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Date
                </label>
                <input
                  type="date"
                  value={newTranscript.meetingDate}
                  onChange={(e) => setNewTranscript({...newTranscript, meetingDate: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Participants
                </label>
                <input
                  type="text"
                  value={newTranscript.participants}
                  onChange={(e) => setNewTranscript({...newTranscript, participants: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe, Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  value={newTranscript.content}
                  onChange={(e) => setNewTranscript({...newTranscript, content: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={8}
                  placeholder="Enter the meeting transcript content here..."
                />
              </div>
              <button
                onClick={handleManualAdd}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Transcript</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transcripts List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Existing Transcripts</h3>
        {transcripts.length === 0 ? (
          <div className="text-center py-8">
            <Mic className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No transcripts uploaded yet</p>
            <p className="text-gray-400 text-sm">Upload or add transcripts to provide context for test case generation</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transcripts.map((transcript) => (
              <div key={transcript.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{transcript.title}</h4>
                  <button
                    onClick={() => handleDelete(transcript.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {transcript.meeting_date && (
                    <span className="mr-4">📅 {new Date(transcript.meeting_date).toLocaleDateString()}</span>
                  )}
                  {transcript.participants && (
                    <span>👥 {transcript.participants}</span>
                  )}
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {transcript.content.substring(0, 200)}...
                </p>
                <div className="text-xs text-gray-500 mt-2">
                  Added: {new Date(transcript.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Test Case Card Component
const TestCaseCard = ({ testCase, onEdit, onDelete, onToggleSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: testCase.title,
    description: testCase.description,
    preconditions: testCase.preconditions,
    steps: testCase.steps,
    expected_result: testCase.expected_result,
    priority: testCase.priority,
    category: testCase.category
  });

  const handleSave = async () => {
    try {
      await axios.put(`${API}/test-cases/${testCase.id}`, {
        ...editData,
        steps: editData.steps.filter(step => step.trim() !== '')
      });
      onEdit();
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update test case');
    }
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...editData.steps];
    newSteps[index] = value;
    setEditData({ ...editData, steps: newSteps });
  };

  const addStep = () => {
    setEditData({ ...editData, steps: [...editData.steps, ''] });
  };

  const removeStep = (index) => {
    setEditData({ ...editData, steps: editData.steps.filter((_, i) => i !== index) });
  };

  const priorityColors = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800'
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preconditions</label>
            <textarea
              value={editData.preconditions}
              onChange={(e) => setEditData({ ...editData, preconditions: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Steps</label>
            {editData.steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => removeStep(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={addStep}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
            >
              <Plus size={16} />
              <span>Add Step</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Result</label>
            <textarea
              value={editData.expected_result}
              onChange={(e) => setEditData({ ...editData, expected_result: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={editData.priority}
                onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={editData.category}
                onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="Functional">Functional</option>
                <option value="Performance">Performance</option>
                <option value="Security">Security</option>
                <option value="Usability">Usability</option>
                <option value="Integration">Integration</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border ${testCase.is_selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onToggleSelect(testCase.id)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              testCase.is_selected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
            }`}
          >
            {testCase.is_selected && <Check size={14} className="text-white" />}
          </button>
          <h3 className="text-lg font-semibold text-gray-800">{testCase.title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[testCase.priority]}`}>
            {testCase.priority}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-blue-600"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(testCase.id)}
            className="text-gray-500 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-3">{testCase.description}</p>

      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-gray-700">Preconditions:</h4>
          <p className="text-gray-600 text-sm">{testCase.preconditions}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700">Steps:</h4>
          <ol className="text-gray-600 text-sm list-decimal list-inside space-y-1">
            {testCase.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        <div>
          <h4 className="font-medium text-gray-700">Expected Result:</h4>
          <p className="text-gray-600 text-sm">{testCase.expected_result}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <span className="text-sm text-gray-500">Category: {testCase.category}</span>
        <span className="text-sm text-gray-500">
          {new Date(testCase.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

// Test Cases Management Page
const TestCasesPage = ({ testCases, onTestCasesUpdate }) => {
  const handleDelete = async (testCaseId) => {
    if (window.confirm('Are you sure you want to delete this test case?')) {
      try {
        await axios.delete(`${API}/test-cases/${testCaseId}`);
        onTestCasesUpdate();
      } catch (error) {
        alert('Failed to delete test case');
      }
    }
  };

  const handleToggleSelect = async (testCaseId) => {
    try {
      const testCase = testCases.find(tc => tc.id === testCaseId);
      await axios.put(`${API}/test-cases/${testCaseId}`, {
        is_selected: !testCase.is_selected
      });
      onTestCasesUpdate();
    } catch (error) {
      alert('Failed to update test case selection');
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await axios.get(`${API}/export/${format}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', format === 'excel' ? 'test_cases.xlsx' : 'test_cases.json');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export test cases. Please select some test cases first.');
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all test cases? This cannot be undone.')) {
      try {
        await axios.delete(`${API}/test-cases`);
        onTestCasesUpdate();
      } catch (error) {
        alert('Failed to clear test cases');
      }
    }
  };

  const selectedCount = testCases.filter(tc => tc.is_selected).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <TestTube className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Test Cases Management</h2>
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
              {testCases.length} total
            </span>
            {selectedCount > 0 && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                {selectedCount} selected
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('json')}
              disabled={selectedCount === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => handleExport('excel')}
              disabled={selectedCount === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handleClearAll}
              disabled={testCases.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {testCases.length === 0 ? (
          <div className="text-center py-12">
            <TestTube className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No test cases yet</p>
            <p className="text-gray-400 text-sm">Generate some test cases in the Dashboard to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {testCases.map((testCase) => (
              <TestCaseCard
                key={testCase.id}
                testCase={testCase}
                onEdit={onTestCasesUpdate}
                onDelete={handleDelete}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [testCases, setTestCases] = useState([]);
  const [transcripts, setTranscripts] = useState([]);
  const [activeProvider, setActiveProvider] = useState(null);

  // Load data
  useEffect(() => {
    loadTestCases();
    loadTranscripts();
    loadActiveProvider();
  }, []);

  const loadTestCases = async () => {
    try {
      const response = await axios.get(`${API}/test-cases`);
      setTestCases(response.data);
    } catch (error) {
      console.error('Failed to load test cases:', error);
    }
  };

  const loadTranscripts = async () => {
    try {
      const response = await axios.get(`${API}/transcripts`);
      setTranscripts(response.data);
    } catch (error) {
      console.error('Failed to load transcripts:', error);
      setTranscripts([]); // Set empty array if endpoint doesn't exist yet
    }
  };

  const loadActiveProvider = async () => {
    try {
      const response = await axios.get(`${API}/ai-providers/active`);
      setActiveProvider(response.data);
    } catch (error) {
      console.error('Failed to load active provider:', error);
    }
  };

  const handleGenerate = (newTestCases) => {
    setTestCases(prev => [...newTestCases, ...prev]);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard
            transcripts={transcripts}
            onGenerate={handleGenerate}
          />
        );
      case 'ai-config':
        return (
          <AIConfigPage
            activeProvider={activeProvider}
            onProviderUpdate={loadActiveProvider}
          />
        );
      case 'alm-config':
        return <ALMConfigPage />;
      case 'transcription':
        return (
          <TranscriptionPage
            transcripts={transcripts}
            onTranscriptsUpdate={loadTranscripts}
          />
        );
      case 'test-cases':
        return (
          <TestCasesPage
            testCases={testCases}
            onTestCasesUpdate={loadTestCases}
          />
        );
      default:
        return <Dashboard transcripts={transcripts} onGenerate={handleGenerate} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;