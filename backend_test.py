import requests
import sys
import json
from datetime import datetime
import time

class CortexifyAPITester:
    def __init__(self, base_url="https://ai-assistant-221.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.session_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status} - {name}")
        if details:
            print(f"   Details: {details}")

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}, Response: {response.json() if success else response.text}"
            self.log_test("API Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("API Root Endpoint", False, f"Error: {str(e)}")
            return False

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test POST status
        try:
            test_data = {"client_name": f"test_client_{int(time.time())}"}
            response = requests.post(f"{self.api_url}/status", json=test_data, timeout=10)
            success = response.status_code == 200
            details = f"POST Status: {response.status_code}"
            if success:
                response_data = response.json()
                details += f", ID: {response_data.get('id', 'N/A')}"
            self.log_test("POST Status Check", success, details)
            
            if not success:
                return False
                
        except Exception as e:
            self.log_test("POST Status Check", False, f"Error: {str(e)}")
            return False

        # Test GET status
        try:
            response = requests.get(f"{self.api_url}/status", timeout=10)
            success = response.status_code == 200
            details = f"GET Status: {response.status_code}"
            if success:
                status_list = response.json()
                details += f", Count: {len(status_list)}"
            self.log_test("GET Status Check", success, details)
            return success
            
        except Exception as e:
            self.log_test("GET Status Check", False, f"Error: {str(e)}")
            return False

    def test_chat_functionality(self):
        """Test chat endpoints"""
        # Generate unique session ID
        self.session_id = f"test_session_{int(time.time())}"
        
        # Test sending a chat message
        try:
            chat_data = {
                "message": "Hello, this is a test message. Please respond briefly.",
                "session_id": self.session_id
            }
            
            print(f"🔄 Sending chat message (this may take a few seconds)...")
            response = requests.post(f"{self.api_url}/chat", json=chat_data, timeout=30)
            success = response.status_code == 200
            
            if success:
                response_data = response.json()
                ai_message = response_data.get('ai_message', '')
                details = f"Status: {response.status_code}, AI Response Length: {len(ai_message)} chars"
                if len(ai_message) > 0:
                    details += f", Sample: '{ai_message[:50]}...'"
            else:
                details = f"Status: {response.status_code}, Error: {response.text}"
                
            self.log_test("Send Chat Message", success, details)
            
            if not success:
                return False
                
        except Exception as e:
            self.log_test("Send Chat Message", False, f"Error: {str(e)}")
            return False

        return True

    def test_session_management(self):
        """Test session management endpoints"""
        if not self.session_id:
            self.log_test("Session Management", False, "No session ID available")
            return False
            
        # Test get chat sessions
        try:
            response = requests.get(f"{self.api_url}/chat/sessions", timeout=10)
            success = response.status_code == 200
            
            if success:
                sessions = response.json()
                details = f"Status: {response.status_code}, Sessions Count: {len(sessions)}"
                # Check if our test session exists
                test_session_found = any(s.get('id') == self.session_id for s in sessions)
                if test_session_found:
                    details += ", Test session found"
                else:
                    details += ", Test session not found"
            else:
                details = f"Status: {response.status_code}, Error: {response.text}"
                
            self.log_test("Get Chat Sessions", success, details)
            
            if not success:
                return False
                
        except Exception as e:
            self.log_test("Get Chat Sessions", False, f"Error: {str(e)}")
            return False

        # Test get chat history
        try:
            response = requests.get(f"{self.api_url}/chat/session/{self.session_id}", timeout=10)
            success = response.status_code == 200
            
            if success:
                messages = response.json()
                details = f"Status: {response.status_code}, Messages Count: {len(messages)}"
                if len(messages) >= 2:  # Should have user + AI message
                    details += ", Contains user and AI messages"
                else:
                    details += f", Expected 2+ messages, got {len(messages)}"
            else:
                details = f"Status: {response.status_code}, Error: {response.text}"
                
            self.log_test("Get Chat History", success, details)
            return success
            
        except Exception as e:
            self.log_test("Get Chat History", False, f"Error: {str(e)}")
            return False

    def test_session_deletion(self):
        """Test session deletion"""
        if not self.session_id:
            self.log_test("Delete Session", False, "No session ID available")
            return False
            
        try:
            response = requests.delete(f"{self.api_url}/chat/session/{self.session_id}", timeout=10)
            success = response.status_code == 200
            
            if success:
                response_data = response.json()
                details = f"Status: {response.status_code}, Message: {response_data.get('message', 'N/A')}"
            else:
                details = f"Status: {response.status_code}, Error: {response.text}"
                
            self.log_test("Delete Session", success, details)
            return success
            
        except Exception as e:
            self.log_test("Delete Session", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting CORTEXIFY Backend API Tests")
        print(f"📡 Testing API at: {self.api_url}")
        print("=" * 60)
        
        # Test API availability
        if not self.test_api_root():
            print("❌ API root endpoint failed - stopping tests")
            return False
            
        # Test status endpoints
        self.test_status_endpoints()
        
        # Test chat functionality
        if self.test_chat_functionality():
            # Test session management
            self.test_session_management()
            
            # Test session deletion
            self.test_session_deletion()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = CortexifyAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/test_reports/backend_test_results.json', 'w') as f:
        json.dump({
            'summary': {
                'total_tests': tester.tests_run,
                'passed_tests': tester.tests_passed,
                'success_rate': f"{(tester.tests_passed/tester.tests_run*100):.1f}%" if tester.tests_run > 0 else "0%",
                'timestamp': datetime.now().isoformat()
            },
            'test_results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())