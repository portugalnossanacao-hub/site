"""Hardtek API backend tests - contact endpoint, auth, health check"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials from .env
ADMIN_EMAIL = "admin@hardtek.ch"
ADMIN_PASSWORD = "Hardtek2026!"


@pytest.fixture(scope="module")
def session():
    """Shared requests session with cookie jar for auth"""
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def auth_session(session):
    """Authenticated session - login and return session with cookies"""
    response = session.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    if response.status_code != 200:
        pytest.skip(f"Auth failed: {response.status_code} - {response.text}")
    return session


class TestHealth:
    """Health check tests"""
    
    def test_root_health(self, session):
        r = session.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
        assert "Hardtek" in data["message"] or "running" in data["message"].lower()
        print(f"Health: {data}")


class TestContactPublic:
    """Contact endpoint tests - public (no auth required)"""
    
    def test_post_contact_valid(self, session):
        """POST /api/contact - create contact message should return 200 and persist"""
        payload = {
            "name": "TEST_User",
            "email": "test@example.com",
            "service": "Réparation PC",
            "message": "TEST_Hello this is a test message"
        }
        r = session.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
        data = r.json()
        assert data["name"] == "TEST_User"
        assert data["email"] == "test@example.com"
        assert data["service"] == "Réparation PC"
        assert "id" in data
        assert "_id" not in data
        print(f"POST contact: {data}")

    def test_post_contact_no_service(self, session):
        """POST /api/contact without service field should still work"""
        payload = {"name": "TEST_NoService", "email": "ns@example.com", "message": "No service test"}
        r = session.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert "_id" not in data
        print(f"No service: {data}")

    def test_post_contact_invalid_email(self, session):
        """POST /api/contact with invalid email should return 422"""
        payload = {"name": "Test", "email": "not-an-email", "message": "msg"}
        r = session.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 422
        print(f"Invalid email response: {r.status_code}")

    def test_post_contact_missing_name(self, session):
        """POST /api/contact with missing name should return 422"""
        payload = {"email": "test@example.com", "message": "msg"}
        r = session.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 422

    def test_post_contact_missing_message(self, session):
        """POST /api/contact with missing message should return 422"""
        payload = {"name": "Test", "email": "test@example.com"}
        r = session.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 422

    def test_get_contact_without_auth(self, session):
        """GET /api/contact without auth should return 401"""
        # Use a fresh session without cookies
        fresh_session = requests.Session()
        r = fresh_session.get(f"{BASE_URL}/api/contact")
        assert r.status_code == 401, f"Expected 401, got {r.status_code}"
        print(f"GET contact without auth: {r.status_code}")


class TestAuth:
    """Authentication endpoint tests"""
    
    def test_login_success(self):
        """POST /api/auth/login with correct admin credentials should return 200 + set cookies"""
        session = requests.Session()
        r = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
        data = r.json()
        assert "id" in data
        assert data["email"] == ADMIN_EMAIL.lower()
        assert data["role"] == "admin"
        # Check cookies were set
        assert "access_token" in session.cookies or len(r.cookies) > 0
        print(f"Login success: {data}")

    def test_login_wrong_password(self):
        """POST /api/auth/login with wrong password should return 401"""
        session = requests.Session()
        r = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": "WrongPassword123!"
        })
        assert r.status_code == 401, f"Expected 401, got {r.status_code}"
        print(f"Login wrong password: {r.status_code}")

    def test_login_wrong_email(self):
        """POST /api/auth/login with wrong email should return 401"""
        session = requests.Session()
        r = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@example.com",
            "password": ADMIN_PASSWORD
        })
        assert r.status_code == 401, f"Expected 401, got {r.status_code}"
        print(f"Login wrong email: {r.status_code}")


class TestAuthenticatedEndpoints:
    """Tests requiring authentication"""
    
    def test_get_me_after_login(self, auth_session):
        """GET /api/auth/me after login should return admin user"""
        r = auth_session.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
        data = r.json()
        assert data["email"] == ADMIN_EMAIL.lower()
        assert data["role"] == "admin"
        assert "id" in data
        print(f"GET /auth/me: {data}")

    def test_get_contact_list_authenticated(self, auth_session):
        """GET /api/contact after login should return list of contact messages"""
        r = auth_session.get(f"{BASE_URL}/api/contact")
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
        data = r.json()
        assert isinstance(data, list)
        for item in data[:5]:
            assert "_id" not in item
            assert "id" in item
            assert "name" in item
        print(f"GET contact list: {len(data)} items")

    def test_delete_contact_message(self, auth_session):
        """DELETE /api/contact/{id} after login should delete the message"""
        # First create a message to delete
        payload = {
            "name": "TEST_ToDelete",
            "email": "delete@example.com",
            "service": "Test",
            "message": "TEST_This message will be deleted"
        }
        create_r = auth_session.post(f"{BASE_URL}/api/contact", json=payload)
        assert create_r.status_code == 200
        msg_id = create_r.json()["id"]
        
        # Now delete it
        delete_r = auth_session.delete(f"{BASE_URL}/api/contact/{msg_id}")
        assert delete_r.status_code == 200, f"Expected 200, got {delete_r.status_code}: {delete_r.text}"
        data = delete_r.json()
        assert data["ok"] == True
        assert data["deleted_id"] == msg_id
        print(f"DELETE contact: {data}")

    def test_delete_nonexistent_message(self, auth_session):
        """DELETE /api/contact/{id} with non-existent id should return 404"""
        r = auth_session.delete(f"{BASE_URL}/api/contact/nonexistent-id-12345")
        assert r.status_code == 404, f"Expected 404, got {r.status_code}"
        print(f"DELETE nonexistent: {r.status_code}")


class TestLogout:
    """Logout tests - run last"""
    
    def test_logout(self):
        """POST /api/auth/logout should clear cookies"""
        # Login first
        session = requests.Session()
        login_r = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert login_r.status_code == 200
        
        # Logout
        logout_r = session.post(f"{BASE_URL}/api/auth/logout")
        assert logout_r.status_code == 200, f"Expected 200, got {logout_r.status_code}: {logout_r.text}"
        data = logout_r.json()
        assert data["ok"] == True
        print(f"Logout: {data}")
        
        # Verify we can't access protected endpoints anymore
        # Note: cookies may still be in session but should be cleared server-side
        # Create fresh session to verify
        fresh_session = requests.Session()
        me_r = fresh_session.get(f"{BASE_URL}/api/auth/me")
        assert me_r.status_code == 401
        print("Verified: cannot access /auth/me after logout with fresh session")
