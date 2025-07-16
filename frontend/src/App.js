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
  CheckCircle2
} from 'lucide-react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Component: AI Provider Configuration
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

// Component: Test Case Generator
const TestCaseGenerator = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [requirements, setRequirements] = useState('');
  const [testType, setTestType] = useState('Functional');
  const [numTestCases, setNumTestCases] = useState(5);
  const [files, setFiles] = useState([]);
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
      formData.append('requirements', requirements);
      formData.append('test_type', testType);
      formData.append('num_test_cases', numTestCases.toString());
      
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
      setRequirements('');
      setFiles([]);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate test cases. Please check your AI provider configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Requirements (Optional)
          </label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            placeholder="e.g., Focus on edge cases, include performance testing, consider mobile responsiveness"
          />
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
  );
};

// Component: Test Case Card
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

// Main App Component
function App() {
  const [testCases, setTestCases] = useState([]);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [activeProvider, setActiveProvider] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load test cases and active provider
  useEffect(() => {
    loadTestCases();
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

  const handleDelete = async (testCaseId) => {
    if (window.confirm('Are you sure you want to delete this test case?')) {
      try {
        await axios.delete(`${API}/test-cases/${testCaseId}`);
        setTestCases(prev => prev.filter(tc => tc.id !== testCaseId));
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
      setTestCases(prev => prev.map(tc => 
        tc.id === testCaseId ? { ...tc, is_selected: !tc.is_selected } : tc
      ));
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
        setTestCases([]);
      } catch (error) {
        alert('Failed to clear test cases');
      }
    }
  };

  const selectedCount = testCases.filter(tc => tc.is_selected).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <TestTube className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">Gen Studio AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {activeProvider ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="text-green-500" size={16} />
                    <span className="text-sm text-gray-600">
                      {activeProvider.provider} - {activeProvider.model}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="text-orange-500" size={16} />
                    <span className="text-sm text-gray-600">No AI provider configured</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowConfigModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                <Settings size={16} />
                <span>Configure AI</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Test Case Generator */}
        <TestCaseGenerator onGenerate={handleGenerate} />

        {/* Test Cases Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <FileText className="text-gray-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Test Cases</h2>
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
              <p className="text-gray-400 text-sm">Generate some test cases using AI to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testCases.map((testCase) => (
                <TestCaseCard
                  key={testCase.id}
                  testCase={testCase}
                  onEdit={loadTestCases}
                  onDelete={handleDelete}
                  onToggleSelect={handleToggleSelect}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* AI Provider Configuration Modal */}
      {showConfigModal && (
        <AIProviderConfig
          onClose={() => setShowConfigModal(false)}
          onSave={loadActiveProvider}
        />
      )}
    </div>
  );
}

export default App;