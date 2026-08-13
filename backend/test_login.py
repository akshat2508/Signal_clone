import httpx
import sys

def test_login():
    # Test seeded user alice
    print("Testing Alice login...")
    try:
        r = httpx.post("http://localhost:8000/api/auth/login", json={
            "username": "alice",
            "password": "password123"
        })
        print(f"Alice login: {r.status_code}")
        print(r.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login()
