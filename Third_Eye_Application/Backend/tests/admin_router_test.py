from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)

def admin_test():
    response = client.get('/3EYE/V1/admin/test')
    assert response.status_code == 200