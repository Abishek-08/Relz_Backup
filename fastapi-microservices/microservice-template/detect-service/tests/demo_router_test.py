from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)

def test_demo_test():
    response = client.get('/detect/V1/demo/test')
    assert response.status_code == 200
    assert response.json() == {'status':'demo-router is running from detect-service'}
