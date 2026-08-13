import httpx
import sys

def run_test():
    url = "http://localhost:8000/api/auth"
    
    # 1. Register
    username = "testuser123"
    password = "password123"
    
    print("Registering...")
    res = httpx.post(f"{url}/register", json={
        "username": username,
        "display_name": "Test User",
        "phone_number": "1231231234",
        "password": password
    })
    print(f"Register status: {res.status_code}")
    if res.status_code != 200:
        print(res.text)
        
    # 2. Login
    print("\nLogging in...")
    res = httpx.post(f"{url}/login", json={
        "username": username,
        "password": password
    })
    print(f"Login status: {res.status_code}")
    print(res.text)

if __name__ == "__main__":
    run_test()
