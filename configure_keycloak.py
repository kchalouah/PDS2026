import requests
import json
import time

KEYCLOAK_URL = "http://localhost:8180"
ADMIN_USER = "admin"
ADMIN_PASS = "KeycloakAdmin2024!"
REALM_NAME = "medinsight"
CLIENT_ID = "medinsight-client"

ROLES = [
    "ROLE_ADMIN",
    "ROLE_MEDECIN",
    "ROLE_PATIENT",
    "ROLE_GESTIONNAIRE",
    "ROLE_RESPONSABLE_SECURITE"
]

def get_admin_token():
    url = f"{KEYCLOAK_URL}/realms/master/protocol/openid-connect/token"
    payload = {
        "username": ADMIN_USER,
        "password": ADMIN_PASS,
        "grant_type": "password",
        "client_id": "admin-cli"
    }
    try:
        response = requests.post(url, data=payload)
        response.raise_for_status()
        return response.json()["access_token"]
    except Exception as e:
        print(f"Failed to get admin token: {e}")
        return None

def create_realm(token):
    url = f"{KEYCLOAK_URL}/admin/realms"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = {
        "realm": REALM_NAME,
        "enabled": True,
        "registrationAllowed": True,
        "verifyEmail": False,
        "smtpServer": {},
        "bruteForceProtected": False
    }
    
    # Check if exists
    resp = requests.get(f"{url}/{REALM_NAME}", headers=headers)
    if resp.status_code == 200:
        print(f"Realm '{REALM_NAME}' already exists.")
        return

    resp = requests.post(url, json=payload, headers=headers)
    if resp.status_code == 201:
        print(f"Realm '{REALM_NAME}' created.")
    else:
        print(f"Failed to create realm: {resp.text}")

def create_client(token):
    url = f"{KEYCLOAK_URL}/admin/realms/{REALM_NAME}/clients"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # Check if exists (requires getting all and filtering)
    resp = requests.get(url, headers=headers, params={"clientId": CLIENT_ID})
    if resp.status_code == 200 and len(resp.json()) > 0:
        print(f"Client '{CLIENT_ID}' already exists.")
        return resp.json()[0]["id"]

    payload = {
        "clientId": CLIENT_ID,
        "enabled": True,
        "publicClient": True,
        "directAccessGrantsEnabled": True,
        "standardFlowEnabled": True,
        "implicitFlowEnabled": False,
        "redirectUris": ["*"],
        "webOrigins": ["*"],
        "attributes": {
            "post.logout.redirect.uris": "*"
        }
    }
    
    resp = requests.post(url, json=payload, headers=headers)
    if resp.status_code == 201:
        # Get ID
        resp = requests.get(url, headers=headers, params={"clientId": CLIENT_ID})
        print(f"Client '{CLIENT_ID}' created.")
        return resp.json()[0]["id"]
    else:
        print(f"Failed to create client: {resp.text}")
        return None

def create_roles(token):
    url = f"{KEYCLOAK_URL}/admin/realms/{REALM_NAME}/roles"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    for role in ROLES:
        payload = {"name": role}
        resp = requests.post(url, json=payload, headers=headers)
        if resp.status_code == 201:
            print(f"Role '{role}' created.")
        elif resp.status_code == 409:
            print(f"Role '{role}' already exists.")
        else:
            print(f"Failed to create role '{role}': {resp.text}")

def create_user(token):
    url = f"{KEYCLOAK_URL}/admin/realms/{REALM_NAME}/users"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # Check if exists
    resp = requests.get(url, headers=headers, params={"username": "admin"})
    user_id = None
    if resp.status_code == 200 and len(resp.json()) > 0:
        print("User 'admin' already exists.")
        user_id = resp.json()[0]["id"]
    else:
        payload = {
            "username": "admin",
            "enabled": True,
            "email": "admin@medinsight.com",
            "firstName": "Admin",
            "lastName": "User",
            "credentials": [{
                "type": "password",
                "value": "password",
                "temporary": False
            }]
        }
        resp = requests.post(url, json=payload, headers=headers)
        if resp.status_code == 201:
            print("User 'admin' created.")
            # Get ID
            resp = requests.get(url, headers=headers, params={"username": "admin"})
            user_id = resp.json()[0]["id"]
        else:
            print(f"Failed to create user: {resp.text}")
            return None
            
    # Assign Roles
    if user_id:
        role_url = f"{KEYCLOAK_URL}/admin/realms/{REALM_NAME}/users/{user_id}/role-mappings/realm"
        # Get all roles to map correct IDs
        all_roles_resp = requests.get(f"{KEYCLOAK_URL}/admin/realms/{REALM_NAME}/roles", headers=headers)
        all_roles = all_roles_resp.json()
        
        roles_to_assign = [r for r in all_roles if r["name"] in ROLES]
        
        resp = requests.post(role_url, json=roles_to_assign, headers=headers)
        if resp.status_code == 204:
            print("Roles assigned to 'admin'.")
        else:
            print(f"Failed to assign roles: {resp.text}")

if __name__ == "__main__":
    print("Configuring Keycloak...")
    token = get_admin_token()
    if token:
        create_realm(token)
        create_roles(token)
        create_client(token)
        create_user(token)
        
        print("\nConfiguration Complete. User 'admin' / 'password' has all roles.")
    else:
        print("Could not authenticate.")
