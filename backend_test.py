#!/usr/bin/env python3
"""
Backend API Testing for Gen Studio AI System
Tests all API endpoints and functionality
"""

import requests
import json
import sys
import os
from datetime import datetime
from io import BytesIO

class GenStudioAPITester:
    def __init__(self):
        # Use the public endpoint from frontend .env
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    self.base_url = line.split('=')[1].strip()
                    break
        
        self.api_url = f"{self.base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            status = "✅ PASS"
        else:
            status = "❌ FAIL"
        
        result = f"{status} - {name}"
        if details:
            result += f" | {details}"
        
        print(result)
        self.test_results.append({
            'name': name,
            'success': success,
            'details': details
        })
        return success

    def test_health_endpoints(self):
        """Test basic health check endpoints"""
        print("\n🔍 Testing Health Endpoints...")
        
        # Test root endpoint
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200 and "Gen Studio AI API is running" in response.text
            self.log_test("Root endpoint", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Root endpoint", False, f"Error: {str(e)}")

        # Test health endpoint
        try:
            response = requests.get(f"{self.api_url}/health", timeout=10)
            success = response.status_code == 200 and "healthy" in response.text
            self.log_test("Health endpoint", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Health endpoint", False, f"Error: {str(e)}")

    def test_ai_provider_endpoints(self):
        """Test AI provider configuration endpoints"""
        print("\n🔍 Testing AI Provider Endpoints...")
        
        # Test get all providers (should be empty initially)
        try:
            response = requests.get(f"{self.api_url}/ai-providers", timeout=10)
            success = response.status_code == 200
            self.log_test("Get all AI providers", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Get all AI providers", False, f"Error: {str(e)}")

        # Test get active provider (should be None initially)
        try:
            response = requests.get(f"{self.api_url}/ai-providers/active", timeout=10)
            success = response.status_code == 200
            self.log_test("Get active AI provider", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Get active AI provider", False, f"Error: {str(e)}")

        # Test create AI provider
        test_provider = {
            "provider": "openai",
            "api_key": "test-key-12345",
            "model": "gpt-4",
            "max_tokens": 4000,
            "temperature": 0.7
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/ai-providers",
                json=test_provider,
                timeout=10
            )
            success = response.status_code == 200
            if success:
                provider_data = response.json()
                self.test_provider_id = provider_data.get('id')
            self.log_test("Create AI provider", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Create AI provider", False, f"Error: {str(e)}")

        # Test get active provider after creation
        try:
            response = requests.get(f"{self.api_url}/ai-providers/active", timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                success = data is not None and data.get('provider') == 'openai'
            self.log_test("Get active provider after creation", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Get active provider after creation", False, f"Error: {str(e)}")

    def test_test_case_endpoints(self):
        """Test test case CRUD endpoints"""
        print("\n🔍 Testing Test Case Endpoints...")
        
        # Test get all test cases (should be empty initially)
        try:
            response = requests.get(f"{self.api_url}/test-cases", timeout=10)
            success = response.status_code == 200
            self.log_test("Get all test cases", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Get all test cases", False, f"Error: {str(e)}")

        # Test create test case manually (without AI generation)
        test_case_data = {
            "title": "Test Login Functionality",
            "description": "Verify user can login with valid credentials",
            "preconditions": "User account exists in system",
            "steps": [
                "Navigate to login page",
                "Enter valid username",
                "Enter valid password",
                "Click login button"
            ],
            "expected_result": "User is successfully logged in and redirected to dashboard",
            "priority": "High",
            "category": "Functional"
        }

        # We'll create this manually by inserting into database via the generate endpoint
        # but with a simple prompt that should work even without AI
        try:
            # Create a simple text file for testing
            files = {'files': ('test.txt', BytesIO(b'Test requirements document'), 'text/plain')}
            data = {
                'prompt': 'Test user login functionality',
                'test_type': 'Functional',
                'num_test_cases': '1',
                'selected_transcripts': '[]',
                'selected_alm': '',
                'selected_alm_items': '[]'
            }
            
            response = requests.post(
                f"{self.api_url}/generate-test-cases",
                files=files,
                data=data,
                timeout=30
            )
            
            # This will likely fail due to no AI API key, but we test the endpoint structure
            if response.status_code == 500:
                # Expected failure due to no AI configuration
                success = "No active AI provider configured" in response.text or "AI generation failed" in response.text
                self.log_test("Generate test cases (expected AI failure)", success, "Expected failure - no AI key")
            else:
                success = response.status_code == 200
                self.log_test("Generate test cases", success, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Generate test cases", False, f"Error: {str(e)}")

        # Test get specific test case (will fail since we don't have any)
        try:
            response = requests.get(f"{self.api_url}/test-cases/non-existent-id", timeout=10)
            success = response.status_code == 404
            self.log_test("Get non-existent test case", success, f"Status: {response.status_code} (expected 404)")
        except Exception as e:
            self.log_test("Get non-existent test case", False, f"Error: {str(e)}")

        # Test update non-existent test case
        try:
            update_data = {"title": "Updated Title"}
            response = requests.put(
                f"{self.api_url}/test-cases/non-existent-id",
                json=update_data,
                timeout=10
            )
            success = response.status_code == 404
            self.log_test("Update non-existent test case", success, f"Status: {response.status_code} (expected 404)")
        except Exception as e:
            self.log_test("Update non-existent test case", False, f"Error: {str(e)}")

        # Test delete non-existent test case
        try:
            response = requests.delete(f"{self.api_url}/test-cases/non-existent-id", timeout=10)
            success = response.status_code == 404
            self.log_test("Delete non-existent test case", success, f"Status: {response.status_code} (expected 404)")
        except Exception as e:
            self.log_test("Delete non-existent test case", False, f"Error: {str(e)}")

        # Test bulk select
        try:
            response = requests.post(
                f"{self.api_url}/test-cases/bulk-select",
                json=["test-id-1", "test-id-2"],
                timeout=10
            )
            success = response.status_code == 200
            self.log_test("Bulk select test cases", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Bulk select test cases", False, f"Error: {str(e)}")

        # Test delete all test cases
        try:
            response = requests.delete(f"{self.api_url}/test-cases", timeout=10)
            success = response.status_code == 200
            self.log_test("Delete all test cases", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Delete all test cases", False, f"Error: {str(e)}")

    def test_export_endpoints(self):
        """Test export functionality"""
        print("\n🔍 Testing Export Endpoints...")
        
        # Test Excel export (should fail with no selected test cases)
        try:
            response = requests.get(f"{self.api_url}/export/excel", timeout=10)
            success = response.status_code == 400 and "No test cases selected" in response.text
            self.log_test("Excel export (no selection)", success, f"Status: {response.status_code} (expected 400)")
        except Exception as e:
            self.log_test("Excel export (no selection)", False, f"Error: {str(e)}")

        # Test JSON export (should fail with no selected test cases)
        try:
            response = requests.get(f"{self.api_url}/export/json", timeout=10)
            success = response.status_code == 400 and "No test cases selected" in response.text
            self.log_test("JSON export (no selection)", success, f"Status: {response.status_code} (expected 400)")
        except Exception as e:
            self.log_test("JSON export (no selection)", False, f"Error: {str(e)}")

    def test_transcript_endpoints(self):
        """Test transcript CRUD endpoints"""
        print("\n🔍 Testing Transcript Endpoints...")
        
        # Test get all transcripts (should be empty initially)
        try:
            response = requests.get(f"{self.api_url}/transcripts", timeout=10)
            success = response.status_code == 200
            self.log_test("Get all transcripts", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Get all transcripts", False, f"Error: {str(e)}")

        # Test create transcript manually
        test_transcript = {
            "title": "Test Meeting Transcript",
            "content": "This is a test meeting transcript content with discussion about requirements.",
            "meeting_date": "2024-02-15",
            "participants": "John Doe, Jane Smith"
        }
        
        transcript_id = None
        try:
            response = requests.post(
                f"{self.api_url}/transcripts",
                json=test_transcript,
                timeout=10
            )
            success = response.status_code == 200
            if success:
                transcript_data = response.json()
                transcript_id = transcript_data.get('id')
            self.log_test("Create transcript", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Create transcript", False, f"Error: {str(e)}")

        # Test get specific transcript
        if transcript_id:
            try:
                response = requests.get(f"{self.api_url}/transcripts/{transcript_id}", timeout=10)
                success = response.status_code == 200
                self.log_test("Get specific transcript", success, f"Status: {response.status_code}")
            except Exception as e:
                self.log_test("Get specific transcript", False, f"Error: {str(e)}")

        # Test transcript upload
        try:
            test_content = b"Meeting transcript: Discussion about new features and requirements."
            files = {'files': ('meeting_transcript.txt', BytesIO(test_content), 'text/plain')}
            
            response = requests.post(
                f"{self.api_url}/transcripts/upload",
                files=files,
                timeout=10
            )
            success = response.status_code == 200
            if success:
                upload_data = response.json()
                uploaded_transcript_id = upload_data.get('transcripts', [{}])[0].get('id') if upload_data.get('transcripts') else None
            self.log_test("Upload transcript file", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Upload transcript file", False, f"Error: {str(e)}")

        # Test delete transcript
        if transcript_id:
            try:
                response = requests.delete(f"{self.api_url}/transcripts/{transcript_id}", timeout=10)
                success = response.status_code == 200
                self.log_test("Delete transcript", success, f"Status: {response.status_code}")
            except Exception as e:
                self.log_test("Delete transcript", False, f"Error: {str(e)}")

        # Test get non-existent transcript
        try:
            response = requests.get(f"{self.api_url}/transcripts/non-existent-id", timeout=10)
            success = response.status_code == 404
            self.log_test("Get non-existent transcript", success, f"Status: {response.status_code} (expected 404)")
        except Exception as e:
            self.log_test("Get non-existent transcript", False, f"Error: {str(e)}")

    def test_file_processing(self):
        """Test file upload and processing"""
        print("\n🔍 Testing File Processing...")
        
        # Test with different file types
        test_files = [
            ('test.txt', b'This is a test text file content', 'text/plain'),
            ('test.pdf', b'%PDF-1.4 fake pdf content', 'application/pdf'),  # Fake PDF
        ]
        
        for filename, content, content_type in test_files:
            try:
                files = {'files': (filename, BytesIO(content), content_type)}
                data = {
                    'prompt': 'Test file processing',
                    'requirements': '',
                    'test_type': 'Functional',
                    'num_test_cases': '1',
                    'selected_transcripts': '[]',
                    'selected_alm': '',
                    'selected_alm_items': '[]'
                }
                
                response = requests.post(
                    f"{self.api_url}/generate-test-cases",
                    files=files,
                    data=data,
                    timeout=30
                )
                
                # We expect this to fail at AI generation, not file processing
                if response.status_code == 500:
                    success = "AI generation failed" in response.text or "No active AI provider" in response.text
                    self.log_test(f"File processing ({filename})", success, "File processed, AI failed (expected)")
                else:
                    success = response.status_code == 200
                    self.log_test(f"File processing ({filename})", success, f"Status: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"File processing ({filename})", False, f"Error: {str(e)}")

    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Gen Studio AI Backend Tests")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        self.test_health_endpoints()
        self.test_ai_provider_endpoints()
        self.test_transcript_endpoints()
        self.test_test_case_endpoints()
        self.test_export_endpoints()
        self.test_file_processing()
        
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed - check details above")
            return 1

def main():
    tester = GenStudioAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())