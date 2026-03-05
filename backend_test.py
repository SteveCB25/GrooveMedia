import requests
import sys
import json
from datetime import datetime
import uuid

class GrooveMediaAPITester:
    def __init__(self, base_url="https://lead-capture-md.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
        self.admin_token = None
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
            "status": "PASS" if success else "FAIL", 
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details and not success:
            print(f"   Details: {details}")

    def test_health_endpoint(self):
        """Test basic health check"""
        try:
            response = requests.get(f"{self.api_base}/health", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Formspree: {data.get('formspree_configured', False)}"
            self.log_test("Health Check", success, details)
            return success
        except Exception as e:
            self.log_test("Health Check", False, str(e))
            return False

    def test_admin_login(self):
        """Test admin login with correct credentials"""
        try:
            login_data = {
                "username": "admin",
                "password": "groovemedia2024"
            }
            response = requests.post(f"{self.api_base}/admin/login", 
                                   json=login_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("token"):
                    self.admin_token = data["token"]
                    self.log_test("Admin Login", True, "Token received")
                    return True
                else:
                    self.log_test("Admin Login", False, "No token in response")
                    return False
            else:
                self.log_test("Admin Login", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Admin Login", False, str(e))
            return False

    def test_admin_login_invalid(self):
        """Test admin login with invalid credentials"""
        try:
            login_data = {
                "username": "wrong",
                "password": "wrong"
            }
            response = requests.post(f"{self.api_base}/admin/login", 
                                   json=login_data, timeout=10)
            
            success = response.status_code == 401
            details = f"Status: {response.status_code} (Expected 401)"
            self.log_test("Admin Login Invalid", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Login Invalid", False, str(e))
            return False

    def test_create_lead(self):
        """Test lead creation"""
        try:
            # Create unique test data
            timestamp = datetime.now().strftime("%H%M%S")
            lead_data = {
                "name": f"Test User {timestamp}",
                "business_name": f"Test Business {timestamp}",
                "phone": "301-555-0123",
                "email": f"test{timestamp}@example.com",
                "website": "https://example.com",
                "service_type": "Roofing"
            }
            
            response = requests.post(f"{self.api_base}/leads", 
                                   json=lead_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("id"):
                    self.test_lead_id = data["id"]  # Store for later tests
                    self.log_test("Create Lead", True, f"Lead ID: {data['id']}")
                    return True
                else:
                    self.log_test("Create Lead", False, "No ID in response")
                    return False
            else:
                self.log_test("Create Lead", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Create Lead", False, str(e))
            return False

    def test_create_lead_validation(self):
        """Test lead creation with invalid data"""
        try:
            # Missing required fields
            lead_data = {
                "name": "Test",
                # missing required fields
            }
            
            response = requests.post(f"{self.api_base}/leads", 
                                   json=lead_data, timeout=10)
            
            success = response.status_code == 422  # FastAPI validation error
            details = f"Status: {response.status_code} (Expected 422)"
            self.log_test("Lead Validation", success, details)
            return success
        except Exception as e:
            self.log_test("Lead Validation", False, str(e))
            return False

    def test_get_leads(self):
        """Test retrieving leads"""
        try:
            response = requests.get(f"{self.api_base}/leads", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    count = len(data)
                    self.log_test("Get Leads", True, f"Retrieved {count} leads")
                    return True
                else:
                    self.log_test("Get Leads", False, "Response not a list")
                    return False
            else:
                self.log_test("Get Leads", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Leads", False, str(e))
            return False

    def test_get_leads_count(self):
        """Test leads count endpoint"""
        try:
            response = requests.get(f"{self.api_base}/leads/count", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "count" in data and isinstance(data["count"], int):
                    self.log_test("Get Leads Count", True, f"Count: {data['count']}")
                    return True
                else:
                    self.log_test("Get Leads Count", False, "Invalid count response")
                    return False
            else:
                self.log_test("Get Leads Count", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Leads Count", False, str(e))
            return False

    def test_delete_lead(self):
        """Test lead deletion"""
        if not hasattr(self, 'test_lead_id'):
            self.log_test("Delete Lead", False, "No test lead ID available")
            return False
            
        try:
            response = requests.delete(f"{self.api_base}/leads/{self.test_lead_id}", 
                                     timeout=10)
            
            success = response.status_code == 200
            details = f"Status: {response.status_code}, Lead ID: {self.test_lead_id}"
            self.log_test("Delete Lead", success, details)
            return success
        except Exception as e:
            self.log_test("Delete Lead", False, str(e))
            return False

    def test_delete_nonexistent_lead(self):
        """Test deleting non-existent lead"""
        try:
            fake_id = str(uuid.uuid4())
            response = requests.delete(f"{self.api_base}/leads/{fake_id}", 
                                     timeout=10)
            
            success = response.status_code == 404
            details = f"Status: {response.status_code} (Expected 404)"
            self.log_test("Delete Nonexistent Lead", success, details)
            return success
        except Exception as e:
            self.log_test("Delete Nonexistent Lead", False, str(e))
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Groove Media API Tests...")
        print(f"Testing against: {self.base_url}")
        print("=" * 50)
        
        # Basic connectivity
        if not self.test_health_endpoint():
            print("❌ Health check failed - stopping tests")
            return False
        
        # Authentication tests
        self.test_admin_login()
        self.test_admin_login_invalid()
        
        # Lead CRUD tests
        self.test_create_lead()
        self.test_create_lead_validation()
        self.test_get_leads()
        self.test_get_leads_count()
        
        # Cleanup tests (delete the test lead we created)
        self.test_delete_lead()
        self.test_delete_nonexistent_lead()
        
        # Results summary
        print("=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"✨ Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = GrooveMediaAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    results_file = "/app/test_reports/backend_api_results.json"
    try:
        import os
        os.makedirs("/app/test_reports", exist_ok=True)
        
        with open(results_file, 'w') as f:
            json.dump({
                "summary": {
                    "total_tests": tester.tests_run,
                    "passed_tests": tester.tests_passed,
                    "success_rate": (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0,
                    "timestamp": datetime.now().isoformat()
                },
                "test_details": tester.test_results
            }, f, indent=2)
        
        print(f"📝 Detailed results saved to: {results_file}")
    except Exception as e:
        print(f"⚠️  Could not save results file: {e}")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())